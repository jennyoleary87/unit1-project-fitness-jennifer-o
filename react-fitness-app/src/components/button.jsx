
const Button = ({ label, onClick, type = "button", disabled = false, ...props }) => {
    // style="color: #EF7674"

    return (
        <button onClick={onClick} disabled={disabled}
            style={{
                backgroundColor: '#EF7674',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '4px',
                cursor: disabled ? 'not-allowed' : 'pointer',
                opacity: disabled ? 0.6 : 1
            }}
            {...props}>
            {label}
        </button>
    )
}

export default Button;