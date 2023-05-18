import { useEffect, useState } from 'react'
import { useMutation } from '@apollo/client'
import { LOGIN } from '../queries'
import { useNavigate } from 'react-router-dom'

const LoginForm = ({ setToken }) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const [login, result] = useMutation(LOGIN, {
        onError: error => {
            console.log(error.graphQLErrors[0].message)
        }
    })

    const navigate = useNavigate()

    useEffect(() => {
        if (result.data) {
            const token = result.data.login.value
            setToken(token)
            localStorage.setItem('user-token', token)
            navigate('/')
        }
    }, [result.data]) //eslint-disable-line

    const submit = event => {
        event.preventDefault()
        login({ variables: { username, password } })
        setUsername('')
        setPassword('')
    }

    return (
        <>
            <h2>Login</h2>
            <form onSubmit={submit}>
                <div>
                    username<input
                        value={username}
                        onChange={({ target }) => { setUsername(target.value) }}
                    />
                </div>
                <div>
                    password<input
                        type='password'
                        value={password}
                        onChange={({ target }) => { setPassword(target.value) }}
                    />
                </div>
                <button type='submit'>login</button>
            </form>
        </>
    )
}

export default LoginForm