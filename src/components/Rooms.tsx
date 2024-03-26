import { Link } from "react-router-dom";
import { useChat } from "../contexts/ChatContext"

export const Rooms = () => {
    const {user, roomList, handleEnterRoom} = useChat();
  
    return(
        <div>
            <h1>Rooms</h1>
            <h2>Welcome, <span style={{color: user?.color}}>{user?.username}</span>!</h2>
            <h1>Rooms Available ({roomList.length})</h1>
            {roomList ?
                roomList.map(room => (
                    <Link 
                        to={room.roomName.replace(' ', '')} 
                        key={room.roomName}
                        onClick={user ? () => handleEnterRoom(user, room) : () => alert("No user assigned")}
                    >
                            {room.roomName}
                    </Link>
                ))
                :
                <></>
            }
            <Link to={"room-create/"}>Create a room</Link>
        </div>
    )
}