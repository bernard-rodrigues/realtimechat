interface ExitIconProps{
    fill?: string
    size?: number
}

export const ExitIcon = (props: ExitIconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={props.size ? props.size : 24}
      height={props.size ? props.size : 24}
      viewBox="0 -960 960 960"
      fill={props.fill ? props.fill : "#000000"}
    >
      <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200zm440-160l-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200z"></path>
    </svg>
  );
}
