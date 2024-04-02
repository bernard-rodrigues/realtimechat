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
    const [isPrivate, setIsPrivate] = useState(false);
    
    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        handleAddMessage(event, {
            createdBy: user!,
            message: messageText,
            messageTo: messageTo,
            isPrivate: isPrivate,
            room: props.room,
            timeCreated: new Date()
        })
        setMessageText('');
    }

    const toggleIsPrivate = () => {
        setIsPrivate(!isPrivate);
    }
    
    return(
        <>
            <div>
                <h1>{props.room.roomName}</h1>
                <h2>Created by <span>{props.room.createdBy.username}</span></h2>
                <h3>Online users: ({props.room.users.length - 1})</h3>
                <div>
                    <button style={null === messageTo ? {fontWeight: 'bold'} : {}} onClick={() => {setMessageTo(null); setIsPrivate(false)}}>Everyone</button>
                </div>
                {props.room.users.map(currentUser => {
                    if(user && currentUser.username !== user.username){
                        return <button key={currentUser.username} style={currentUser === messageTo ? {color: currentUser.color, fontWeight: 'bold'} : {color: currentUser.color}} onClick={() => setMessageTo(currentUser)}>{currentUser.username}</button>
                    }
                })}
            </div>
            <form onSubmit={(e) => handleSubmit(e)}>
                <div>
                    {messages
                        .filter(message => message.room.roomName === props.room.roomName) // Filters messages by the current room
                        .sort((a, b) => new Date(a.timeCreated).getTime() - new Date(b.timeCreated).getTime()) // Sorts messages by date (older to newer)
                        .map((currentMessage, index) => (
                            (user && currentMessage.createdBy.username === user.username) || !currentMessage.isPrivate || (currentMessage.isPrivate && user && currentMessage.messageTo?.username === user.username) ?
                            <p key={index}><b><span style={{color: currentMessage.createdBy.color}}>{currentMessage.createdBy.username}</span> said {currentMessage.isPrivate ? <u>privately</u> : <></>} to <span style={{color: currentMessage.messageTo?.color}}>{currentMessage.messageTo ? currentMessage.messageTo.username : "everyone"}</span>:</b> {currentMessage.message} <span>(at {currentMessage.timeCreated.toLocaleDateString('en-US', options)})</span></p>
                            :
                            <div key={index}></div>
                    ))}
                </div>
                <input type="text" value={messageText} placeholder="Type your message..." onChange={e => setMessageText(e.target.value)} />
                <button 
                    type="button" 
                    onClick={toggleIsPrivate} 
                    style={isPrivate ? {backgroundColor: "lime"} : {}}
                    disabled={!messageTo ? true : false}
                >
                    Privately
                </button>
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