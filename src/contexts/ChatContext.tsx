import { FormEvent, ReactNode, createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

interface User{
    username: string;
    color: string;
    favorites: User[];
}

export interface Room{
    roomName: string,
    users: User[],
    createdBy: User
}

interface ChatContextProps{
    user: User | null,
    handleCreateUser: (e: FormEvent<HTMLFormElement>, current_user: User) => void,
    roomList: Room[],
    handleCreateRoom: (e: FormEvent<HTMLFormElement>, roomName: string, user: User) => void
}

interface ChatContextProviderProps{
    children: ReactNode
}

export const ChatContext = createContext({} as ChatContextProps);

export const UserContextProvider = (props: ChatContextProviderProps) => {
    const [user, setUser] = useState<User | null>(null);

    const navigate = useNavigate();

    const handleCreateUser = (e: FormEvent<HTMLFormElement>, current_user: User) => {
        e.preventDefault();
        setUser(current_user);
    }

    const [roomList, setRoomList] = useState<Room[]>([]);

    const handleCreateRoom = (e: FormEvent<HTMLFormElement>, roomName: string, user: User) => {
        e.preventDefault();
        if(roomList.filter(room => room.roomName === roomName).length === 0){
            setRoomList([...roomList, {roomName: roomName, users: [user], createdBy: user}]);
            navigate('/' + roomName.replace(' ', '') + '/');
        }else{
            alert('Room name not available')
        }
    }
    
    return(
        <ChatContext.Provider 
            value={
                {
                    user,
                    handleCreateUser,
                    roomList,
                    handleCreateRoom,
                }
            }
        >
            {props.children}
        </ChatContext.Provider>
    )
}

export const useChat = () => {
    return useContext(ChatContext);
}