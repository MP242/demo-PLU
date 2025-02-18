interface MotProps {
    isOnomatope?: boolean;
    children: any;
}

const Mot = ({ isOnomatope, children }: MotProps) => {
    return (
        <span className={isOnomatope ? "text-red-500" : ""}>
            {children}
        </span>
    )
}

export default Mot
