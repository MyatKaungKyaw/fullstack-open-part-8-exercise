import { useEffect, useState } from 'react'
import { useMutation } from '@apollo/client'
import { LOGIN } from '../queries'

const LoginForm = ({ setToken }) => {
    const [username, setUsername] = useState(null)
    const [password, setPassword] = useState(null)

    const [login, result] = useMutation(LOGIN, {
        onError: error => {
            console.log(error.graphQLErrors[0].message)
        }
    })

    useEffect(() => {
        if (result.data) {
            const token = result.data.login.value
            setToken(token)
            localStorage.setItem('user-token', token)
        }
    }, [result.data]) //elint-disable-line

    const submit = event => {
        event.preventDefault()
        login({ variables: { username, password } })
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