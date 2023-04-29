import {gql} from '@apollo/client'

export const AUTHORS = gql`
  query{
    allAuthors{
      name
      born
      bookCount
    }
  }
`

export const BOOKS = gql`
  query{
    allBooks{
      title
      published
      author
      genres
    }
  }
`

export const ADD_BOOK = gql`
  mutation createBook($title:String!, $published:Int!, $author:String!, $genres:[String!]!){
    addBook(
      title:$title,
      published:$published,
      author:$author,
      genres:$genres
    ){
      title
      published
      author
      genres
      
    }
  }
`