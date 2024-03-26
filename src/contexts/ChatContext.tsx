import { FormEvent, ReactNode, createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export interface User{
    username: string;
    color: string;
}

export interface Room{
    roomName: string,
    users: User[],
    createdBy: User
}

interface Message{
    createdBy: User,
    timeCreated: Date,
    message: string,
    messageTo: User | null,
    room: Room
}

interface ChatContextProps{
    userList: User[],
    addUser: (e: FormEvent<HTMLFormElement>, user: User) => void,
    removeUser: (e: FormEvent<HTMLFormElement>, user: User) => void,
    
    user: User | null,
    handleCreateUser: (e: FormEvent<HTMLFormElement>, current_user: User) => void,
    
    roomList: Room[],
    handleCreateRoom: (e: FormEvent<HTMLFormElement>, roomName: string, user: User) => void,

    messages: Message[],
    addMessage: (e: FormEvent<HTMLFormElement>, message: Message) => void
}

interface ChatContextProviderProps{
    children: ReactNode
}

export const ChatContext = createContext({} as ChatContextProps);

export const UserContextProvider = (props: ChatContextProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [userList, setUserList] = useState<User[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);

    useEffect(() => {
        fetch('/fakeAPI.json')
            .then(response => response.json())
            .then(data => {
                setUserList(data.users as User[]);
                setMessages(data.messages as Message[]);
                setRoomList(data.rooms as Room[])
            })
    }, [])

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
            alert('Room name not available');
        }
    }

    const addUser = (e: FormEvent<HTMLFormElement>, user: User) => {
        e.preventDefault();
        if(userList.filter(currentUser => currentUser === user).length === 0){
            setUserList([...userList, user])
        }else{
            alert('User already exists');
        }
    }

    const removeUser = (e: FormEvent<HTMLFormElement>, user: User) => {
        e.preventDefault();
        setUserList(userList.filter(currentUser => currentUser !== user));
    }

    const addMessage = (e: FormEvent<HTMLFormElement>, message: Message) => {
        e.preventDefault();
        setMessages([...messages, message]);
    }
    
    return(
        <ChatContext.Provider 
            value={
                {
                    userList,
                    user,
                    handleCreateUser,
                    roomList,
                    handleCreateRoom,
                    addUser,
                    removeUser,
                    messages,
                    addMessage
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