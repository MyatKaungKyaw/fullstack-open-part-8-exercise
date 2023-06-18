const Book = require('./models/Book')
const Author = require('./models/Author')
const { GraphQLError } = require('graphql')
const User = require('./models/User')
const jwt = require('jsonwebtoken')
const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()

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
        me: (root, args, { currentUser }) => currentUser
    },
    Mutation: {
        addBook: async (root, args, { currentUser }) => {
            if (!currentUser) {
                throw new GraphQLError('not authenticated', {
                    extensions: { code: 'BAD_USER_INPUT' }
                })
            }

            const author = await Author.findOne({ name: args.author })
            const book = new Book({ ...args, author: author })
            try {
                await book.save()
                await Author.updateOne({ name: args.author }, { bookCount: author.bookCount + 1 })
            } catch (error) {
                throw new GraphQLError('Saving book failed', {
                    extensions: {
                        code: 'BAD_USER_INPUT',
                        invalidArgs: args,
                        error,
                    }
                })
            }

            pubsub.publish('BOOK_ADDED', { bookAdded: book })

            return book
        },
        editAuthor: async (root, args, { currentUser }) => {
            if (!currentUser) {
                throw new GraphQLError('not authenticated', {
                    extensions: { code: 'BAD_USER_INPUT' }
                })
            }

            const author = await Author.findOne({ name: args.name })
            if (!author) {
                return null
            }

            author.born = args.setBornTo
            try {
                await author.save()
            } catch (error) {
                throw new GraphQLError('edit author failed', {
                    extensions: {
                        code: 'BAD_USER_INPUT',
                        invalidArgs: args,
                        error,
                    }
                })
            }
            return author
        },
        createUser: async (root, args) => {
            const user = new User({ ...args })
            return user.save()
                .catch(error => {
                    return GraphQLError('saving user failed', {
                        extensions: {
                            code: 'BAD_USER_INPUT',
                            invalidArgs: args,
                            error,
                        }
                    })
                })
        },
        login: async (root, args) => {
            const user = await User.findOne({ username: args.username })
            if (!user || args.password !== 'secret') {
                throw new GraphQLError('wrong credentials', {
                    extensions: { code: 'BAD_USER_INPUT' }
                })
            }

            const userForToken = {
                username: user.username,
                id: user._id,
            }
            return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
        }
    },
    Subscription: {
        bookAdded: {
            subscribe: () => pubsub.asyncIterator('BOOK_ADDED')
        }
    }
}

module.exports = resolvers