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
    isPrivate: boolean,
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
    const sessionTimeout = 900000;
    
    const [user, setUser] = useState<User | null>(null);
    const [userList, setUserList] = useState<User[]>([]);
    const [roomList, setRoomList] = useState<Room[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [colors, setColors] = useState<string[]>([]);

    const [lastActivity, setLastActivity] = useState(Date.now());

    useEffect(() => {
        const activityListener = () => {
            setLastActivity(Date.now());
        };

        document.addEventListener('mousemove', activityListener);
        document.addEventListener('keydown', activityListener);
        document.addEventListener('touchstart', activityListener);

        const interval = setInterval(() => {
            if (Date.now() - lastActivity > sessionTimeout) {
              // Session has ended
              handleRemoveUser();
              clearInterval(interval);
              window.location.reload();
            }
        }, 1000);

        return () => {
            document.removeEventListener('mousemove', activityListener);
            document.removeEventListener('keydown', activityListener);
            document.removeEventListener('touchstart', activityListener);
            clearInterval(interval);
        };
    }, [lastActivity]);

    useEffect(() => {
        // Stores the user in session
        const loggedUser = localStorage.getItem("user");

        // Checks if there is user stored in session
        if(loggedUser){
            setUser(JSON.parse(loggedUser) as User);
        }

        // Get data from database
        const dataRef = ref(database);
        
        // Stores data in states
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
            localStorage.setItem("user", jsonCurrentUser);
        }else{
            alert("Username already exists!");
        }
    }

    const handleRemoveUser = () => {
        const roomsWithUser = roomList.filter(currentRoom => currentRoom.users.some(currentUser => user && currentUser.username === user.username));
        roomsWithUser.forEach(currentRoom => user && handleLeaveRoom(user, currentRoom));
        localStorage.getItem("user") ? localStorage.removeItem("user") : "";

        set(ref(database, 'users/'), userList.filter(currentUser => user && currentUser.username !== user.username));
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
            // Deletes every message created in that room
            set(ref(database, 'messages/'), messages.filter(currentMessage => currentMessage.room === room));
            // Remove the room from roomlist if room is empty
            set(ref(database, 'rooms/'), notTheRoomItIsEntering);
        }
        navigate("/");
    }

    const handleCloseRoom = (room: Room) => {
        // Deletes every message created in that room
        set(ref(database, 'messages/'), messages.filter(currentMessage => currentMessage.room === room));
        set(ref(database, 'rooms/'), roomList.filter(currentRoom => currentRoom !== room));
        navigate("/");
    }

    const handleAddMessage = (e: FormEvent<HTMLFormElement>, message: Message) => {
        e.preventDefault();
        // Converts the Dates to strings for Realtime Database storage
        const messagesWithStrings = messages.map(msg => ({
            ...msg,
            timeCreated: msg.timeCreated.toLocaleString('en-US')
        }));
        set(ref(database, 'messages/'), [...messagesWithStrings, {...message, timeCreated: message.timeCreated.toLocaleString('en-US')}]);
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