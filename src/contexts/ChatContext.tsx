import { FormEvent, ReactNode, createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { database } from "../utils/firebase";
import { onValue, ref, set } from "firebase/database";

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
    colors: string[],

    userList: User[],
    
    user: User | null,
    handleCreateUser: (e: FormEvent<HTMLFormElement>, current_user: User) => void,
    
    roomList: Room[],
    handleCreateRoom: (e: FormEvent<HTMLFormElement>, roomName: string, user: User) => void,
    handleEnterRoom: (user: User, room: Room) => void,
    handleLeaveRoom: (user: User, room: Room) => void,
    handleCloseRoom: (room: Room) => void,

    messages: Message[],
    handleAddMessage: (e: FormEvent<HTMLFormElement>, message: Message) => void
}

interface ChatContextProviderProps{
    children: ReactNode
}

export const ChatContext = createContext({} as ChatContextProps);

export const UserContextProvider = (props: ChatContextProviderProps) => {
    const navigate = useNavigate();
    
    const [user, setUser] = useState<User | null>(null);
    const [userList, setUserList] = useState<User[]>([]);
    const [roomList, setRoomList] = useState<Room[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [colors, setColors] = useState<string[]>([]);

    useEffect(() => {
        // fetch('/fakeAPI.json')
        //     .then(response => response.json())
        //     .then(data => {
        //         setUserList(data.users as User[]);
        //         setMessages(data.messages.map((message: Message) => ({
        //             ...message,
        //             timeCreated: new Date(message.timeCreated),
        //         })) as Message[]);
        //         setRoomList(data.rooms as Room[]);
        //         set(ref(database, '/'), data)
        //     })

        const loggedUser = sessionStorage.getItem("user");

        if(loggedUser){
            setUser(JSON.parse(loggedUser) as User);
        }

        const dataRef = ref(database);
        if(dataRef){
            onValue(dataRef, (snapshot) => {
                if(snapshot.exists()){
                    const data = snapshot.val();
                    setUserList(data.users ? data.users as User[] : []);
                    setRoomList(data.rooms ? data.rooms as Room[] : []);
                    setMessages(data.messages ? data.messages.map((message: Message) => ({
                                    ...message,
                                    timeCreated: new Date(message.timeCreated),
                                })) as Message[] : []);
                    setColors(data.colors ? data.colors.colorsHEX as string[] : ['#000000']);
                }else{
                    alert("No data available");
                }
            })
        }
    }, [])

    // const addMessageToDatabase = (message: Message) => {
    //     set(ref(database, 'messages/'), message);
    // }
    
    const handleCreateUser = (e: FormEvent<HTMLFormElement>, user: User) => {
        e.preventDefault();
        if(userList ? userList.findIndex(currentUser => currentUser.username === user.username) === -1 : true){
            setUser(user);
            set(ref(database, 'users/'), [...userList, user]);
            const jsonCurrentUser = JSON.stringify(user);
            sessionStorage.setItem("user", jsonCurrentUser);
        }else{
            alert("Username already exists!");
        }
    }

    const handleCreateRoom = (e: FormEvent<HTMLFormElement>, roomName: string, user: User) => {
        e.preventDefault();
        if(roomList.findIndex(room => room.roomName === roomName) === -1){
            // write on database
            set(ref(database, 'rooms/'), [...roomList, {roomName: roomName, users: [user], createdBy: user}]);
            navigate('/room/' + roomName.replace(' ', '') + '/');
        }else{
            alert('Room name not available');
        }
    }

    const handleEnterRoom = (user: User, room: Room) => {
        // Filter every room but the one user is entering
        const notTheRoomItIsEntering = roomList.filter(currentRoom => currentRoom !== room);
        // Update the room user is entering
        room.users = [...room.users, user];
        // Update the room list with the updated room
        set(ref(database, 'rooms/'), [...notTheRoomItIsEntering, room]);
    }
    
    const handleLeaveRoom = (user: User, room: Room) => {
        // Filter every room but the one user is leaving
        const notTheRoomItIsEntering = roomList.filter(currentRoom => currentRoom !== room);
        // Remover user from leaved room
        room.users = room.users.filter(currentUser => currentUser.username !== user.username);
        if(room.users.length > 0){
            // Update the room list with the updated room
            set(ref(database, 'rooms/'), [...notTheRoomItIsEntering, room]);
        }else{
            // Remove the room from roomlist
            set(ref(database, 'rooms/'), notTheRoomItIsEntering);
        }
        navigate("/");
    }

    const handleCloseRoom = (room: Room) => {
        set(ref(database, 'rooms/'), roomList.filter(currentRoom => currentRoom !== room));
        navigate("/");
    }

    const handleAddMessage = (e: FormEvent<HTMLFormElement>, message: Message) => {
        e.preventDefault();
        set(ref(database, 'messages/'), [...messages, {...message, timeCreated: message.timeCreated.toLocaleString('en-US')}]);
    }
    
    return(
        <ChatContext.Provider 
            value={
                {
                    colors,
                    
                    userList,
                    
                    user,
                    handleCreateUser,
                    
                    roomList,
                    handleCreateRoom,
                    handleEnterRoom,
                    handleLeaveRoom,
                    handleCloseRoom,
                    
                    messages,
                    handleAddMessage
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