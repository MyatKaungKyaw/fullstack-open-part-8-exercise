import { useState } from "react"

const EditBirthYear = () => {
    const [name, setName] = useState(null)
    const [born, setBorn] = useState(null)

    const submit = async e => {
        e.preventDefault()
    }

    return (
        <div>
            <h2>Set birthyear</h2>
            <form onSubmit={submit}>
                <div>
                    name
                    <input
                        value={name}
                        onChange={({ target }) => { setName(target.value) }}
                    />
                </div>
                <div>
                    born
                    <input
                        value={born}
                        onChange={({ target }) => { setBorn(target.value) }}
                    />
                </div>
                <button type='submit'>update author</button>
            </form>
        </div>
    )
}

export default EditBirthYear