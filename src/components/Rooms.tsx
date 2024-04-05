import { Link } from "react-router-dom";
import { useChat } from "../contexts/ChatContext"
import { AddIcon } from "../assets/AddIcon";
import { LogoutButton } from "./LogoutButton";

export const Rooms = () => {
    const {user, roomList, handleEnterRoom} = useChat();
  
    return(
        <div className="h-screen">
            <div className="bg-texture2 p-4 mb-5">
                <h2 className="text-2xl text-texture1">Welcome, <span style={{color: user?.color}}>{user?.username}</span>! <LogoutButton /></h2>
                <h3 className="text-base text-texture1">Rooms Available ({roomList ? roomList.length : 0})</h3>
            </div>
            <div className="
                h-[calc(100vh-12.5rem)] overflow-y-scroll
                xl:flex xl:flex-wrap xl:[&>a]:w-1/3
            ">
                {roomList ?
                    roomList.slice().sort((a, b) => a.roomName.localeCompare(b.roomName)).map(room => (
                        <Link 
                            to={`/room/${room.roomName.replace(' ', '')}`} 
                            key={room.roomName}
                            onClick={user ? () => handleEnterRoom(user, room) : () => alert("No user assigned")}
                        >
                            <div className="mx-4 bg-gradient-to-r from-texture2 to-texture3 p-2 flex flex-col shadow mb-1">
                                <span className="text-lg text-texture1">{room.roomName}</span>
                                <span className="text-texture1 text-xs text-end">Created by {room.createdBy.username} ({room.users.length === 1 ? `${room.users.length} user` : `${room.users.length} users`})</span>
                            </div>
                        </Link>
                    ))
                    :
                    <></>
                }
            </div>
            <Link to={"room-create/"}>
                <div className="
                    bg-primary w-fit flex justify-center items-center rounded-full p-2 shadow-lg
                    fixed bottom-4 right-4
                    xl:top-3 xl:bottom-auto xl:hover:scale-95"
                >
                    <span className="ps-3 text-texture3">New room</span>
                    <AddIcon fill={"#49708a"} size={48}/>
                </div>
            </Link>
        </div>
    )
}