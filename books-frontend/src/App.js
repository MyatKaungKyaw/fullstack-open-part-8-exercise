import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'
import {
  Link,
  Routes,
  Route,
} from 'react-router-dom'
import { useState } from 'react'

const App = () => {
  const [token, setToken] = useState(null)

  const padding = {
    padding: 5,
  }

  return (
    <div>
      <div>
        <Link style={padding} to='/'>authors</Link>
        <Link style={padding} to='/books'>books</Link>
        <Link style={padding} to='/add-book'>add book</Link>
        <Link style={padding} to='/login'>login</Link>
      </div>

      <Routes>
        <Route path='/' element={<Authors />} />
        <Route path='/books' element={<Books />} />
        <Route path='/add-book' element={<NewBook />} />
        <Route path='login' element={<LoginForm setToken={setToken} />} />
      </Routes>
    </div>
  )
}

export default App
