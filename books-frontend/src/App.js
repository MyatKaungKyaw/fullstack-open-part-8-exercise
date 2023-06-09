import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'
import Recommend from './components/Recommend'
import {
  Link,
  Routes,
  Route,
} from 'react-router-dom'
import { useEffect, useState } from 'react'
import {
  useApolloClient,
  useSubscription,
} from '@apollo/client'
import { BOOK_ADDED, BOOKS } from './queries'

const App = () => {
  const [token, setToken] = useState(null)
  const client = useApolloClient()

  useEffect(() => {
    const token = localStorage.getItem('user-token')
    token && setToken(token)
  }, [])

  const padding = {
    padding: 5,
  }

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }

  useSubscription(BOOK_ADDED, {
    onData: ({ data, client }) => {
      const addedBook = data.data.bookAdded
      window.alert(`Book '${addedBook.title}' added`)
      updateAllBooksCache(client.cache, { query: BOOKS }, addedBook)
    }
  })

  return (
    <div>
      <div>
        <Link style={padding} to='/'>authors</Link>
        <Link style={padding} to='/books'>books</Link>
        {token ?
          <>
            <Link style={padding} to='/add-book'>add book</Link>
            <Link sytle={padding} to='/recommend'>recommend</Link>
            <Link style={padding} onClick={logout} to='/'>logout</Link>
          </>
          : <Link style={padding} to='/login'>login</Link>
        }
      </div>

      <Routes>
        <Route path='/' element={<Authors />} />
        <Route path='/books' element={<Books />} />
        <Route path='/add-book' element={<NewBook />} />
        <Route path='/login' element={<LoginForm setToken={setToken} />} />
        <Route path='/recommend' element={<Recommend />} />
      </Routes>
    </div>
  )
}

// function that takes care of manipulating cache
export const updateAllBooksCache = (cache, query, addedBook) => {
  try {
    //check if allBooks data exists in cache
    const cacheData = cache.readQuery({ query: BOOKS })
    if(!cacheData){
      return
    }

    // helper that is used to eliminate saving same person twice
    const uniqByName = (a) => {
      let seen = new Set()
      return a.filter((item) => {
        let k = item.title
        return seen.has(k) ? false : seen.add(k)
      })
    }

    cache.updateQuery(query, ({ allBooks }) => {
      return {
        allBooks: uniqByName(allBooks.concat(addedBook)),
      }
    })
  } catch (error) {
    console.log(error)
  }
}

export default App
