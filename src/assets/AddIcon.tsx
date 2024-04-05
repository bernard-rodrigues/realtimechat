interface AddIconProps{
    fill?: string
    size?: number
}

export const AddIcon = (props: AddIconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={props.size ? props.size : 24}
      height={props.size ? props.size : 24}
      viewBox="0 -960 960 960"
      fill={props.fill}
    >
      <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240z"></path>
    </svg>
  );
}