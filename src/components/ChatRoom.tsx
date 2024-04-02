import { FormEvent, useState } from "react";
import { Room, User, useChat } from "../contexts/ChatContext"
import { ExitIcon } from "../assets/ExitIcon";
import { SendIcon } from "../assets/SendIcon";
import { HiddenIcon } from "../assets/HiddenIcon";

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
        <div className="h-screen">
            <div>
                <div className="bg-texture2 p-4 mb-1 relative">
                    <h2 className="text-2xl text-texture1">{props.room.roomName}</h2>
                    <h3 className="text-base text-texture1">Created by <span>{props.room.createdBy.username}</span></h3>
                    <h3 className="text-base text-texture1 text-end">Online users: ({props.room.users.length - 1})</h3>
                    <button 
                        type="button" 
                        onClick={() => user ? handleLeaveRoom(user, props.room) : alert("No user assigned")}
                        className="absolute right-4 top-4"
                    >
                        <ExitIcon fill="#49708a" size={36}/>
                    </button>
                </div>
            </div>
            <form onSubmit={(e) => handleSubmit(e)} className="mx-1">
                <div className="h-[calc(100vh-13rem)] bg-white p-1">
                    {messages
                        .filter(message => message.room.roomName === props.room.roomName) // Filters messages by the current room
                        .sort((a, b) => new Date(a.timeCreated).getTime() - new Date(b.timeCreated).getTime()) // Sorts messages by date (older to newer)
                        .map((currentMessage, index) => (
                            (user && currentMessage.createdBy.username === user.username) || !currentMessage.isPrivate || (currentMessage.isPrivate && user && currentMessage.messageTo?.username === user.username) ?
                            <p key={index}><b><span style={{color: currentMessage.createdBy.color}}>{currentMessage.createdBy.username}</span> said {currentMessage.isPrivate ? <u>privately</u> : <></>} to <span style={{color: currentMessage.messageTo?.color}}>{currentMessage.messageTo ? currentMessage.messageTo.username : "everyone"}</span>:</b> {currentMessage.message} <span className="text-xs text-slate-400">(at {currentMessage.timeCreated.toLocaleDateString('en-US', options)})</span></p>
                            :
                            <div key={index}></div>
                    ))}
                </div>
                <div>
                    <button type="button" style={null === messageTo ? {fontWeight: 'bold'} : {}} onClick={() => {setMessageTo(null); setIsPrivate(false)}}>Everyone</button>
                </div>
                {props.room.users.map(currentUser => {
                    if(user && currentUser.username !== user.username){
                        return <button type="button" key={currentUser.username} style={currentUser === messageTo ? {color: currentUser.color, fontWeight: 'bold'} : {color: currentUser.color}} onClick={() => setMessageTo(currentUser)}>{currentUser.username}</button>
                    }
                })}
                
                <div className="flex">
                    <input type="text" value={messageText} placeholder="Type your message..." onChange={e => setMessageText(e.target.value)} />
                    <button 
                        type="button" 
                        onClick={toggleIsPrivate} 
                        style={isPrivate ? {backgroundColor: "lime"} : {}}
                        disabled={!messageTo ? true : false}
                    >
                        {/* Privately */}
                        <HiddenIcon />
                    </button>
                    <button type="submit" disabled={messageText === '' ? true : false}>
                        {/* Send to <span>{messageTo ? messageTo.username : "everyone"}</span> */}
                        <SendIcon />
                    </button>
                </div>
            </form>
            {user && props.room.createdBy.username === user.username ? 
            <button type="button" onClick={() => user ? handleCloseRoom(props.room) : alert("No user assigned")}>Close room</button>
            :
            <div></div>
            }
        </div>
    )
}