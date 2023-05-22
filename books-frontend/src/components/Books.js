import { useQuery } from '@apollo/client'
import { BOOKS } from '../queries'
import { useState } from 'react'

const Books = (props) => {
  const result = useQuery(BOOKS)
  const [selectedGenre, setSelectedGenre] = useState(null)

  const genreOnClick = (genre) => {
    setSelectedGenre(genre)
  }

  const GenreList = ({ genres, genreOnClick }) => (
    <div>
      {genres.map(genre => (
        <button
          onClick={() => { genreOnClick(genre) }}
        >{genre}</button>
      ))}
    </div>
  )

  if (result.loading) {
    return <div>loading...</div>
  }

  if (result.error) {
    return <div>Error: {result.error.message}</div>
  }

  const books = result.data.allBooks
  const genres = [...new Set(books.reduce((arr, book) => arr = arr.concat(...book.genres), ['all genres']))]
  const filterBooks = !selectedGenre || selectedGenre === 'all genres' ? books : books.filter(book => book.genres.includes(selectedGenre))

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
          {filterBooks.map((a) => {
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
