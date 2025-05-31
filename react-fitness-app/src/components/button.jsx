
const Button = ({ label, onClick, type = "button", disabled = false, ...props }) => {
    // style="color: #EF7674"

    return (
        <button onClick={onClick} disabled={disabled}  {...props}>
            {label}
        </button>
    )
}

export default Button;