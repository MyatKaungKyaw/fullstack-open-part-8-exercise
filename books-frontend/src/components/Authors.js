import { useQuery } from "@apollo/client"
import {AUTHORS} from '../queries'
import EditBirthYear from "./EditBirthYear"

const Authors = () => {
  const result = useQuery(AUTHORS)

  if(result.loading){
    return <div>loading...</div>
  }

  if(result.error){
    return <div>Error: {result.error.message}</div>
  }

  const authors = result.data.allAuthors

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th>name</th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <EditBirthYear/>
    </div>
  )
}

export default Authors
