import { FormEvent, useState } from "react";
import { Room, User, useChat } from "../contexts/ChatContext"
import { ExitIcon } from "../assets/ExitIcon";
import { SendIcon } from "../assets/SendIcon";
import { HiddenIcon } from "../assets/HiddenIcon";
import { ShownIcon } from "../assets/ShownIcon";
import { UsersIcon } from "../assets/UsersIcon";
import { CloseIcon } from "../assets/CloseIcon";

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
    const {user, messages, handleAddMessage, handleLeaveRoom} = useChat();
    const [messageText, setMessageText] = useState('');
    const [messageTo, setMessageTo] = useState<User | null>(null);
    const [isPrivate, setIsPrivate] = useState(false);
    const [asideIsOpen, setAsideIsOpen] = useState(false);
    
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

    const toggleAsideIsOpen = () => {
        setAsideIsOpen(!asideIsOpen);
    }
    
    return(
        <div className="h-screen relative">
            <div 
                className="transition-all ease-in-out duration-300 h-screen absolute w-[calc(100vw-10%)] bg-white z-50 right-0 translate-x-[100%]"
                style={asideIsOpen ? {transform: "translateX(0)"} : {}}
            >
                <div className="bg-texture2 text-texture1 p-4 flex justify-between items-center">
                    <h3>Online users ({props.room.users.length})</h3>
                    <button type="button" onClick={toggleAsideIsOpen}><CloseIcon fill="#d0e0eb"/></button>
                </div>
                <div className="p-4">
                    <div>
                        <button 
                            type="button"
                            style={null === messageTo ? {fontWeight: 'bold', backgroundColor: "#d0e0eb"} : {}} 
                            onClick={() => {setMessageTo(null); setIsPrivate(false); setAsideIsOpen(false)}}
                            className="w-full text-left py-1 px-2"
                        >
                            Everyone
                        </button>
                    </div>
                    {props.room.users.map(currentUser => {
                        if(user && currentUser.username !== user.username){
                            return <button 
                                type="button" 
                                key={currentUser.username} 
                                style={currentUser === messageTo ? {color: currentUser.color, fontWeight: 'bold', backgroundColor: "#d0e0eb"} : {color: currentUser.color}} 
                                onClick={() => {setMessageTo(currentUser); setAsideIsOpen(false)}}
                                className="w-full text-left py-1 px-2"
                            >
                                {currentUser.username}
                            </button>
                        }
                    })}
                </div>
            </div>
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
                <div className="h-[calc(100vh-14rem)] bg-white p-1">
                    {messages
                        .filter(message => message.room.roomName === props.room.roomName) // Filters messages by the current room
                        .sort((a, b) => new Date(a.timeCreated).getTime() - new Date(b.timeCreated).getTime()) // Sorts messages by date (older to newer)
                        .map((currentMessage, index) => (
                            (user && currentMessage.createdBy.username === user.username) || !currentMessage.isPrivate || (currentMessage.isPrivate && user && currentMessage.messageTo?.username === user.username) ?
                            <p 
                                className={
                                    currentMessage.isPrivate ?
                                    "bg-slate-500 text-white px-1"
                                    : user && ((currentMessage.messageTo && currentMessage.messageTo.username === user.username) || currentMessage.createdBy.username === user.username) ?
                                    "bg-slate-300 px-1"
                                    :
                                    "px-1"
                                }
                                key={index}
                            >
                                <b><span style={{color: currentMessage.createdBy.color}}>{currentMessage.createdBy.username}</span> said {currentMessage.isPrivate ? <u>privately</u> : <></>} to <span style={{color: currentMessage.messageTo?.color}}>{currentMessage.messageTo ? currentMessage.messageTo.username : "everyone"}</span>:</b> {currentMessage.message} <span className="text-xs text-slate-400">(at {currentMessage.timeCreated.toLocaleDateString('en-US', options)})</span>
                            </p>
                            :
                            <div key={index}></div>
                    ))}
                </div>
                
                <div className="flex justify-between items-center relative">
                    <p className="bg-gradient-to-r from-texture2 to-[#00000010] w-full ps-1 my-4">Chating with <span style={messageTo? {color: messageTo.color} : {}}><b>{messageTo ? messageTo.username : "Everyone"}</b></span></p>
                    <button 
                        type="button" 
                        className="rounded-full p-3 bg-texture3 my-1 absolute right-0"
                        onClick={toggleAsideIsOpen}
                    >
                        <UsersIcon fill="#ffffff"/>
                    </button>
                </div>
                
                <div className="flex w-full justify-end gap-1">
                    <input 
                        type="text" 
                        value={messageText} 
                        placeholder="Type your message..." 
                        onChange={e => setMessageText(e.target.value)}
                        className="w-full px-1"
                    />
                    <div className="flex gap-1">
                        <button 
                            type="button" 
                            onClick={toggleIsPrivate} 
                            style={!messageTo ? {display: "none"} : isPrivate ? {backgroundColor: "#49708a"} : {}}
                            disabled={!messageTo ? true : false}
                            className="rounded-full p-3 bg-slate-300"
                        >
                            {/* Privately */}
                            {isPrivate ? <HiddenIcon  fill="#ffffff"/> : <ShownIcon/>}
                        </button>
                        <button className="bg-primary rounded-full p-3" type="submit" disabled={messageText === '' ? true : false}>
                            {/* Send to <span>{messageTo ? messageTo.username : "everyone"}</span> */}
                            <SendIcon />
                        </button>
                    </div>
                </div>
            </form>
        </div>
    )
}