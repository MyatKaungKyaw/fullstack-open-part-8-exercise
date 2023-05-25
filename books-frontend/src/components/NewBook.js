import { useState } from 'react'
import { useMutation } from '@apollo/client'
import { ADD_BOOK, AUTHORS, BOOKS } from '../queries'

const NewBook = (props) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [published, setPublished] = useState('')
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState([])

  const [addBook] = useMutation(ADD_BOOK, {
    update: (cache, { data: { addBook } }) => {
      cache.updateQuery({ query: AUTHORS }, (data) => {
        return {
          allAuthors: data.allAuthors.map(author => author.name === addBook.author.name ?
            {
              ...author,
              bookCount: author.bookCount + 1,
            }
            : author
          )
        }
      })

      cache.updateQuery({ query: BOOKS }, (data) => {
        return {
          allBooks: data.allBooks.concat(addBook)
        }
      })

    },
    onError: error => {
      console.log(error)
    },
  })

  const submit = async (event) => {
    event.preventDefault()

    addBook({
      variables: {
        title: title.trim(),
        author: author.trim(),
        published: parseInt(published),
        genres,
      }
    })

    setTitle('')
    setPublished('')
    setAuthor('')
    setGenres([])
    setGenre('')
  }

  const addGenre = () => {
    setGenres(genres.concat(genre.trim()))
    setGenre('')
  }

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          title
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author
          <input
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          published
          <input
            type="number"
            value={published}
            onChange={({ target }) => setPublished(target.value)}
          />
        </div>
        <div>
          <input
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
          <button onClick={addGenre} type="button">
            add genre
          </button>
        </div>
        <div>genres: {genres.join(' ')}</div>
        <button type="submit">create book</button>
      </form>
    </div>
  )
}

export default NewBook