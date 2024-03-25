import { useState } from "react"
import { useChat } from "../contexts/ChatContext";

const colors = ['red', 'green', 'blue'];

export const UserCreation = () => {

    const {handleCreateUser} = useChat()
    
    const [username, setUsername] = useState('');
    const [color, setColor] = useState(colors[0])

    return(
        <>
            <h1>User Creation</h1>
            <form onSubmit={(e) => handleCreateUser(e, {username: username, color: color, favorites: []})}>
                <label htmlFor="username">Username: </label>
                <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)}/>

                <label htmlFor="color">Color: </label>
                <select id="color" value={color} onChange={(e) => setColor(e.target.value)}>
                    {colors.map(color => (
                        <option key={color} value={color}>{color}</option>
                    ))}
                </select>
                <button type="submit" disabled={username ? false : true}>Create</button>
            </form>
        </>
    )
}