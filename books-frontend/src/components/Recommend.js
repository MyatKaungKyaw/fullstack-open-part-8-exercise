import { useContext } from "react"
import { useQuery } from "@apollo/client"
import { BOOKS, ME } from "../queries"

const Recommend = () => {
  const booksResult = useQuery(BOOKS)
  const meResult = useQuery(ME)

  if(booksResult.loading || meResult.loading){
    return <div>loading...</div>
  }

  if(booksResult.error || meResult.error){
    return (<div>Error: {booksResult.error ? 
      booksResult.error.message 
      : meResult.error.message}</div>)
  }

  const books = booksResult.data.allBooks
  const recomGenre = meResult.data.me.favoriteGenre
  const recomBooks = books.filter(book => book.genres.includes(recomGenre))

  return(
      <div>
          <h2>recommendations</h2>
          <div>books in your favorite genre <b>patterns</b></div>
        <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {recomBooks.map((a) => {
            return (<tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>)
          })}
        </tbody>
      </table>
      </div>
  )
}

export default Recommend