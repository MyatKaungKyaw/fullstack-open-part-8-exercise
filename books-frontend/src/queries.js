import { gql } from '@apollo/client'

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
      genres
      author {
        name
        born
        bookCount
      }
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

export const EDIT_BIRTH = gql`
  mutation editBirth($name:String!,$setBornTo:Int!){
    editAuthor(
      name:$name,
      setBornTo:$setBornTo
    ){
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