const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const { v1: uuid } = require('uuid')
const mongoose = require('mongoose')
const Author = require('./models/Author')
const Book = require('./models/Book')
const User = require('./models/User')
const { GraphQLError } = require('graphql')
const jwt = require('jsonwebtoken')

require('dotenv').config()
mongoose.set('strictQuery', false)
const MONGODB_URI = process.env.MONGODB_URI

console.log('connecting to', MONGODB_URI)

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })


let authors = [
  {
    name: 'Robert Martin',
    id: "afa51ab0-344d-11e9-a414-719c6709cf3e",
    born: 1952,
  },
  {
    name: 'Martin Fowler',
    id: "afa5b6f0-344d-11e9-a414-719c6709cf3e",
    born: 1963
  },
  {
    name: 'Fyodor Dostoevsky',
    id: "afa5b6f1-344d-11e9-a414-719c6709cf3e",
    born: 1821
  },
  {
    name: 'Joshua Kerievsky', // birthyear not known
    id: "afa5b6f2-344d-11e9-a414-719c6709cf3e",
  },
  {
    name: 'Sandi Metz', // birthyear not known
    id: "afa5b6f3-344d-11e9-a414-719c6709cf3e",
  },
]

/*
 * Suomi:
 * Saattaisi olla järkevämpää assosioida kirja ja sen tekijä tallettamalla kirjan yhteyteen tekijän nimen sijaan tekijän id
 * Yksinkertaisuuden vuoksi tallennamme kuitenkin kirjan yhteyteen tekijän nimen
 *
 * English:
 * It might make more sense to associate a book with its author by storing the author's id in the context of the book instead of the author's name
 * However, for simplicity, we will store the author's name in connection with the book
 *
 * Spanish:
 * Podría tener más sentido asociar un libro con su autor almacenando la id del autor en el contexto del libro en lugar del nombre del autor
 * Sin embargo, por simplicidad, almacenaremos el nombre del autor en conección con el libro
*/

let books = [
  {
    title: 'Clean Code',
    published: 2008,
    author: 'Robert Martin',
    id: "afa5b6f4-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring']
  },
  {
    title: 'Agile software development',
    published: 2002,
    author: 'Robert Martin',
    id: "afa5b6f5-344d-11e9-a414-719c6709cf3e",
    genres: ['agile', 'patterns', 'design']
  },
  {
    title: 'Refactoring, edition 2',
    published: 2018,
    author: 'Martin Fowler',
    id: "afa5de00-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring']
  },
  {
    title: 'Refactoring to patterns',
    published: 2008,
    author: 'Joshua Kerievsky',
    id: "afa5de01-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring', 'patterns']
  },
  {
    title: 'Practical Object-Oriented Design, An Agile Primer Using Ruby',
    published: 2012,
    author: 'Sandi Metz',
    id: "afa5de02-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring', 'design']
  },
  {
    title: 'Crime and punishment',
    published: 1866,
    author: 'Fyodor Dostoevsky',
    id: "afa5de03-344d-11e9-a414-719c6709cf3e",
    genres: ['classic', 'crime']
  },
  {
    title: 'The Demon ',
    published: 1872,
    author: 'Fyodor Dostoevsky',
    id: "afa5de04-344d-11e9-a414-719c6709cf3e",
    genres: ['classic', 'revolution']
  },
]

const typeDefs = `
  type Author{
    name:String!
    born:Int
    bookCount:Int
  }

  type Book{
  title:String!
  published:Int!
  author:Author!
  genres:[String!]!
  }

  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }
  
  type Token {
    value: String!
  }

  type Query{
    bookCount:Int
    authorCount:Int
    allBooks(author:String genre:String):[Book!]
    allAuthors:[Author!]!
    me:User
  }

  type Mutation{
    addBook(
      title:String!
      published:Int!
      author:String!
      genres:[String!]!
    ):Book
    editAuthor(
      name:String!
      setBornTo:Int!
    ):Author
    createUser(
      username: String!
      favoriteGenre: String!
    ): User
    login(
      username: String!
      password: String!
    ): Token
  }
`

const resolvers = {
  Query: {
    bookCount: async () => await Book.collection.countDocuments(),
    authorCount: async () => await Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      const author = args.author && await Author.findOne({ name: args.author })
      const filter = {
        ...(author && { author: author._id.toString() }),
        ...(args.genre && { genres: [args.genre] }),
      }

      return await Book.find(filter).populate('author')
    },
    allAuthors: async () => {
      return await Author.find({})
    },
    me: (root,args,{currentUser}) => currentUser
  },
  Mutation: {
    addBook: async (root, args) => {
      const author = await Author.findOne({ name: args.author })
      const book = new Book({ ...args, author: author })
      try {
        await book.save()
      } catch (error) {
        throw new GraphQLError('Saving book failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args,
            error,
          }
        })
      }

      return book
    },
    editAuthor: async (root, args) => {
      const author = await Author.findOne({name:args.name})
      if(!author){
        return null
      }

      author.born = args.setBornTo
      try{
        await author.save()
      }catch(error){
        throw new GraphQLError('edit author failed',{
          extensions:{
            code: 'BAD_USER_INPUT',
            invalidArgs: args,
            error,
          }
        })
      }
      return author
    },
    createUser: async (root,args) => {
      const user = new User({...args})
      return user.save()
        .catch(error => {
          return GraphQLError('saving user failed',{
            extensions:{
              code:'BAD_USER_INPUT',
              invalidArgs: args,
              error,
            }
          })
        })
    },
    login: async (root,args) => {
      const user = await User.findOne({username:args.username})
      if(!user && args.password !== 'secret'){
         throw new GraphQLError('wrong credentials',{
          extensions:{code:'BAD_USER_INPUT'}
         }) 
      }
      
      const userForToken = {
        username:user.name,
        id:user._id,
      }
      return {value: jwt.sign(userForToken,process.env.JWT_SECRET)}
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async (req,res) => {
    const auth = req.auth ? req.header.authorization : null
    if(auth && auth.startsWith('Bearer ')){
      const decodeToken = jwt.verify(auth.subString(7),process.env.JWT_SECRET)
      const currentUser = await User.findById(decodeToken.id)
      return {currentUser}
    }
  }
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})