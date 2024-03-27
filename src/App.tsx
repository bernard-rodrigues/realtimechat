import { ChatRoom } from "./components/ChatRoom";
import { RoomCreation } from "./components/RoomCreation";
import { RoomNotFound } from "./components/RoomNotFound";
import { Rooms } from "./components/Rooms"
import { UserCreation } from "./components/UserCreation"
import { useChat } from "./contexts/ChatContext"
import { Route, Routes } from "react-router-dom";

export const App = () => {
  const {user, roomList} = useChat()
  
  return (
    <Routes>
      <Route path="/" element={user ? <Rooms /> : <UserCreation />} />
      <Route path="/room-create/" element={user ? <RoomCreation /> : <UserCreation />} />
      {roomList.map(room => (
        <Route key={room.roomName} path={`/room/${room.roomName.replace(' ', '')}/`} element={<ChatRoom room={room}/>} />
      ))}
      <Route path="/room/*" element={<RoomNotFound />} />
    </Routes>
  )
}
