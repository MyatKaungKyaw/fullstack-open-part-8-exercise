import { gql } from '@apollo/client'

//query
export const AUTHORS = gql`
  query Query {
    allAuthors {
      name
      born
      bookCount
    }
  }
`

export const BOOKS = gql`
  query AllBooks($author: String, $genre: String) {
    allBooks(author: $author, genre: $genre) {
      title
      published
      author {
        bookCount
        born
        name
      }
      genres
    }
  }
`

export const ME = gql`
  query Me {
    me {
      username
      favoriteGenre
      id
    }
  }
`


//mutation
export const ADD_BOOK = gql`
  mutation AddBook($title: String!, $published: Int!, $author: String!, $genres: [String!]!) {
    addBook(title: $title, published: $published, author: $author, genres: $genres) {
      title
      published
      author {
        name
        born
        bookCount
      }
      genres
    }
  }
`

export const EDIT_BIRTH = gql`
  mutation EditAuthor($name: String!, $setBornTo: Int!) {
    editAuthor(name: $name, setBornTo: $setBornTo) {
      name
      born
      bookCount
    }
  }
`

export const LOGIN = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      value
    }
  }
`