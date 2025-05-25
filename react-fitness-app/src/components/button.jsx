const Button = ({ color, label, onClick }) => {

    return (
        <button className={"hover:background-dark-${color}"} onClick={onClick}>{label}</button>
    )
}

export default Button;