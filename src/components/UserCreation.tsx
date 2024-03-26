import { useEffect, useState } from "react"
import { useChat } from "../contexts/ChatContext";

export const UserCreation = () => {

    const {handleCreateUser} = useChat()
    
    const [username, setUsername] = useState('');
    const [colors, setColors] = useState<string[]>([]);
    const [color, setColor] = useState('');

    useEffect(() => {
        fetch('/fakeAPI.json')
            .then(response => response.json())
            .then(data => setColors(data.colors.colorsHEX));
    }, [])

    useEffect(() => {
        if(colors){
            setColor(colors[0]);
        }
    },[colors]);

    return(
        <>
            <h1>User Creation</h1>
            <form onSubmit={(e) => handleCreateUser(e, {username: username, color: color})}>
                <label htmlFor="username">Username: </label>
                <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)}/>

                <label htmlFor="color">Color: </label>
                <select id="color" value={color} style={{color: color}} onChange={(e) => setColor(e.target.value)}>
                    {colors.map(color => (
                        <option key={color} value={color} style={{color: color}}>{color}</option>
                    ))}
                </select>
                <button type="submit" disabled={username ? false : true}>Create</button>
            </form>
        </>
    )
}