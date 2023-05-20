import { useQuery } from '@apollo/client'
import { BOOKS } from '../queries'

const Books = (props) => {
  const result = useQuery(BOOKS)
  let genres = []

  const GenreList =  ({genres}) => {
    const uniqueGenres = [... new Set(genres)]
    return (
      <div>
        {uniqueGenres.map(genre => <button>{genre}</button>)}
      </div>
    )
  }

  if (result.loading) {
    return <div>loading...</div>
  }

  const books = result.data.allBooks

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
          {books.map((a) => {
            genres = genres.concat(...a.genres)

            return (<tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>)
          })}
        </tbody>
      </table>
      <GenreList genres={genres}/>
    </div>
  )
}

export default Books
