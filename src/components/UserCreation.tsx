import { useEffect, useState } from "react"
import { useChat } from "../contexts/ChatContext";
import { Logo } from "./Logo";
import { Button } from "./Button";

export const UserCreation = () => {

    const {handleCreateUser, colors} = useChat()
    
    const [username, setUsername] = useState('');
    const [currentColor, setCurrentColor] = useState('');

    useEffect(() => {
        if(colors){
            setCurrentColor(colors[0]);
        }
    },[colors]);

    return(
        <form 
            onSubmit={(e) => handleCreateUser(e, {username: username, color: currentColor})}
            className="
                h-screen flex flex-col items-center justify-center gap-4 px-8
                md:px-32
                [&>div]:flex [&>div]:flex-col [&>div]:items-center [&>div]:gap-2 [&>div]:w-full
            "
        >
            <Logo />
            <div>
                <label htmlFor="username" className="text-texture3 text-xl">Type your username: </label>
                <input 
                    type="text" 
                    id="username" 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)}
                    className="border h-12 w-full p-2 text-center text-xl lg:w-[31rem]"
                />
            </div>

            <div>
                <span className="text-texture3 text-xl">Choose a color: </span>
                <div className="grid md:flex grid-cols-4 gap-2">
                    {colors.map(color => (
                        <button 
                            type="button"
                            key={color} 
                            style={currentColor === color ? {backgroundColor: color, border: "solid #333 4px"} : {backgroundColor: color}}
                            className="h-12 w-12 rounded-full"
                            onClick={() => setCurrentColor(color)}
                        />
                    ))}
                </div>
            </div>
            
            <Button disabled={username ? false : true} title="Create"/>
        </form>
    )
}