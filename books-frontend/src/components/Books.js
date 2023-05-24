import { useQuery } from '@apollo/client'
import { BOOKS } from '../queries'
import { useState } from 'react'

const Books = () => {
  const booksResult = useQuery(BOOKS)
  const [selectedGenre, setSelectedGenre] = useState(null)
  const variables = selectedGenre && selectedGenre !== 'all genres' ? {genre: selectedGenre} : {}
  const filterBooksResult = useQuery(BOOKS,{
    variables: variables,
  })
  
  const genreOnClick = (genre) => {
    setSelectedGenre(genre)
  }

  const GenreList = ({ genres, genreOnClick }) => (
    <div>
      {genres.map(genre => (
        <button
          key={genre}
          onClick={() => { genreOnClick(genre) }}
        >{genre}</button>
      ))}
    </div>
  )

  if (booksResult.loading || filterBooksResult.loading) {
    return <div>loading...</div>
  }

  if (booksResult.error || filterBooksResult.error) {
    return <div>Error: {booksResult.error ? 
      booksResult.error.message
      : filterBooksResult.error.message
    }</div>
  }

  const books = booksResult.data.allBooks
  const genres = [...new Set(books.reduce((arr, book) => arr = arr.concat(...book.genres), ['all genres']))]
  const displayBooks = !selectedGenre || selectedGenre === 'all genres' ? books : books.filter(book => book.genres.includes(selectedGenre))

  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {displayBooks.map((a) => {
            return (<tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>)
          })}
        </tbody>
      </table>
      <GenreList genres={genres} genreOnClick={genreOnClick}/>
    </div>
  )
}

export default Books
