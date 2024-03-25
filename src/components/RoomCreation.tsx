import { useState } from "react"
import { useChat } from "../contexts/ChatContext"

export const RoomCreation = () => {
    const {user, handleCreateRoom} = useChat();
    
    const [roomName, setRoomName] = useState('');

    return(
        <>
            <h1>Room Creation</h1>
            <h2>Creating a room for <span style={{color: user?.color}}>{user?.username}</span>:</h2>
            <form onSubmit={(e) => handleCreateRoom(e, roomName, user!)}>
                <label>Room name: </label>
                <input value={roomName} onChange={e => setRoomName(e.target.value)} />
                <button type="submit">Create</button>
            </form>
        </>
    )
}