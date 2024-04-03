interface CloseIconProps{
    fill?: string
    size?: number
}

export const CloseIcon = (props: CloseIconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={props.size ? props.size : 24}
      height={props.size ? props.size : 24}
      fill={props.fill ? props.fill : "#000000"}
      viewBox="0 -960 960 960"
    >
      <path d="M256-200l-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224z"></path>
    </svg>
  );
}