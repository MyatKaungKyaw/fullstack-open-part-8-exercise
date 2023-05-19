import { useEffect, useState } from "react"
import { useQuery, useMutation } from "@apollo/client"
import { AUTHORS, EDIT_BIRTH } from "../queries"

const EditBirthYear = () => {
    const [name, setName] = useState('')
    const [born, setBorn] = useState('')

    const result = useQuery(AUTHORS)
    const [editBithYear] = useMutation(EDIT_BIRTH, {
        refetchQueries: [
            { query: AUTHORS }
        ],
        onError: error => {
            console.log(error)
        },
    })

    useEffect(() => {
        resetName()
    },[result.data]) // eslint-disable-line

    if (result.loading) {
        return null
    }

    const authorsName = result.data.allAuthors.map(a => a.name)

    const submit = async e => {
        e.preventDefault()

        editBithYear({
            variables: {
                name,
                setBornTo: parseInt(born),
            }
        })
        resetName()
        setBorn('')
    }

    const resetName = () => {setName(result.data.allAuthors[0].name)}

    return (
        <div>
            <h2>Set birthyear</h2>
            <form onSubmit={submit}>
                <div>
                    name
                    <select value={name} onChange={e => {setName(e.target.value)}}>
                        {
                            authorsName.map(author => (
                                <option key={author} value={author}>{author}</option>
                            ))
                        }
                    </select>
                </div>
                <div>
                    born
                    <input
                        value={born}
                        type="number"
                        onChange={({ target }) => { setBorn(target.value) }}
                    />
                </div>
                <button type='submit'>update author</button>
            </form>
        </div>
    )
}

export default EditBirthYear