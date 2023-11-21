import React from "react";

interface ButtonNavProps {
    color: string;
    text: string;
}

function ButtonNav({ color, text }: ButtonNavProps) {
    const buttonStyle = {
        display: 'flex',
        alignItems: 'center',
        fontFamily: 'inherit',
        fontWeight: 500,
        fontSize: '16px',
        padding: '0.7em 1.4em 0.7em 1.1em',
        color: 'white',
        background: `linear-gradient(0deg, ${color} 0%, rgba(102,247,113,1) 100%)`,
        border: 'none',
        boxShadow: '0 0.7em 1.5em -0.5em #14a73e98',
        letterSpacing: '0.05em',
        borderRadius: '20em',
        cursor: 'pointer',
        userSelect: 'none' as const, // Specify the type as 'none'
        WebkitUserSelect: 'none' as const, // Specify the type as 'none'
        touchAction: 'manipulation',
    };

    return (
        <button style={buttonStyle}>
            {text}
        </button>
    );
}

export default ButtonNav;
