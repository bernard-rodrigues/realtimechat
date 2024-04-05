import { useChat } from "../contexts/ChatContext"

export const LogoutButton = () => {
    const {handleRemoveUser} = useChat()
    
    return(
        <button onClick={handleRemoveUser} className="text-sm hover:text-primary hover:cursor-pointer">(Logout)</button>
    )
}