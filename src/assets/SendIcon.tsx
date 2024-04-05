interface SendIconProps{
    fill?: string
    size?: number
}

export const SendIcon = (props: SendIconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={props.size ? props.size : 24}
      height={props.size ? props.size : 24}
      fill={props.fill ? props.fill : "#000000"}
      viewBox="0 -960 960 960"
    >
      <path d="M120-160v-640l760 320-760 320zm80-120l474-200-474-200v140l240 60-240 60v140zm0 0v-400 400z"></path>
    </svg>
  );
}
