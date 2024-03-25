import { Room } from "../contexts/ChatContext"

interface RoomProps{
    room: Room
}

export const ChatRoom = (props: RoomProps) => {   
    return(
        <>
            <h1>{props.room.roomName}</h1>
            <h2>Created by <span>{props.room.createdBy.username}</span></h2>
            <h3>Users online:</h3>
            {props.room.users.map(user => (
                <button key={user.username}>{user.username}</button>
            ))}
        </>
    )
}