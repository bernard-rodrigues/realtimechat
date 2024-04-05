interface ButtonProps{
    disabled: boolean,
    title: string
}

export const Button = (props: ButtonProps) => {
    return(
        <button
            type="submit" 
            disabled={props.disabled}
            className="border w-full h-16 bg-primary text-texture3 text-xl lg:w-[31rem] disabled:bg-slate-200"
        >
            {props.title}
        </button>
    )
}