import { Link, NavLink } from 'react-router-dom';
import { useState } from 'react';
import logo from '../images/logo.png';

const Header = () => {

    const [isOpen, setIsOpen] = useState(false);

    return (
        <header>
            <nav className="navbar">
                <Link to="/" className="home-link"><img src={logo} /></Link>
                <div className="hamburger" onClick={() => { setIsOpen(!isOpen); }}>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
                <ul className={isOpen ? "open" : ""}>
                    <li><NavLink to="/">Home</NavLink></li>
                    <li><NavLink to="/timer">Timer</NavLink></li>
                    <li><NavLink to="/history">History</NavLink></li>
                    <li><NavLink to="/about">About</NavLink></li>
                </ul>
            </nav >
        </header>
    );
};

export default Header;