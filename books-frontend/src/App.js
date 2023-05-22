import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'
import Recommend from './components/Recommend'
import {
  Link,
  Routes,
  Route,
  useNavigate,
} from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useApolloClient } from '@apollo/client'

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

  const navigate = useNavigate()

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
    navigate('/')
  }

  return (
    <div>
      <div>
        <Link style={padding} to='/'>authors</Link>
        <Link style={padding} to='/books'>books</Link>
        {token ?
          <>
            <Link style={padding} to='/add-book'>add book</Link>
            <Link sytle={padding} to='/recommend'>recommend</Link>
            <Link style={padding} onClick={logout}>logout</Link>
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

export default App
