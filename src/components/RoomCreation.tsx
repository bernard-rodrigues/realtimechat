import { useState } from "react"
import { useChat } from "../contexts/ChatContext"
import { Logo } from "./Logo";
import { Button } from "./Button";

export const RoomCreation = () => {
    const {user, handleCreateRoom} = useChat();
    
    const [roomName, setRoomName] = useState('');

    return(
        <div className="h-screen flex flex-col items-center justify-center gap-4 text-texture3">
            <Logo />
            <h2 className="text-xl">Creating a room for <span style={{color: user?.color}}>{user?.username}</span>:</h2>
            <form 
                className="flex flex-col items-center gap-2"
                onSubmit={(e) => user ? handleCreateRoom(e, roomName, user!) : () => ''}
            >
                <label className="text-xl">Room name: </label>
                <input className="border h-12 w-full p-2 text-center text-xl lg:w-[31rem]" value={roomName} onChange={e => setRoomName(e.target.value)} />
                <Button disabled={roomName ? false : true} title="Create" />
            </form>
        </div>
    )
}