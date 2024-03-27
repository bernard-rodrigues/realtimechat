import { FormEvent, useState } from "react";
import { Room, User, useChat } from "../contexts/ChatContext"

interface RoomProps{
    room: Room
}

const options: Intl.DateTimeFormatOptions = 
    {
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit', 
        hour: '2-digit', 
        minute: '2-digit'
    }

export const ChatRoom = (props: RoomProps) => {   
    const {user, messages, handleAddMessage, handleLeaveRoom, handleCloseRoom} = useChat();
    const [messageText, setMessageText] = useState('');
    const [messageTo, setMessageTo] = useState<User | null>(null);
    
    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        handleAddMessage(event, {
            createdBy: user!,
            message: messageText,
            messageTo: messageTo,
            room: props.room,
            timeCreated: new Date()
        })
        setMessageText('');
    }
    
    return(
        <>
            <div>
                <h1>{props.room.roomName}</h1>
                <h2>Created by <span>{props.room.createdBy.username}</span></h2>
                <h3>Users online:</h3>
                <div>
                    <button style={null === messageTo ? {fontWeight: 'bold'} : {}} onClick={() => setMessageTo(null)}>Everyone</button>
                </div>
                {props.room.users.map(currentUser => (
                    <div key={currentUser.username}>
                        {currentUser !== user ?
                            <button style={currentUser === messageTo ? {color: currentUser.color, fontWeight: 'bold'} : {color: currentUser.color}} onClick={() => setMessageTo(currentUser)}>{currentUser.username}</button>
                            :
                            <></>
                        }

                    </div>
                ))}
            </div>
            <form onSubmit={(e) => handleSubmit(e)}>
                <div>
                    {messages.filter(message => message.room.roomName === props.room.roomName).map((currentMessage, index) => (
                        <p key={index}><b><span style={{color: currentMessage.createdBy.color}}>{currentMessage.createdBy.username}</span> said to <span style={{color: currentMessage.messageTo?.color}}>{currentMessage.messageTo ? currentMessage.messageTo.username : "everyone"}</span>:</b> {currentMessage.message} <span>(at {currentMessage.timeCreated.toLocaleDateString('en-US', options)})</span></p>
                    ))}
                </div>
                <input type="text" value={messageText} placeholder="Type your message..." onChange={e => setMessageText(e.target.value)} />
                <button type="submit" disabled={messageText === '' ? true : false}>Send to <span>{messageTo ? messageTo.username : "everyone"}</span></button>
            </form>
            <button type="button" onClick={() => user ? handleLeaveRoom(user, props.room) : alert("No user assigned")}>Leave room</button>
            {props.room.createdBy === user ? 
            <button type="button" onClick={() => user ? handleCloseRoom(props.room) : alert("No user assigned")}>Close room</button>
            :
            <div></div>
            }
        </>
    )
}