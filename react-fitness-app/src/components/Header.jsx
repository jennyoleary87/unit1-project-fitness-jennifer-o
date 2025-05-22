import { Link } from 'react-router';

const Header = () => {
    return (
        <header>
            <h1>Fitness App</h1>
            <nav>
                <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/dashboard">Dashboard</Link></li>
                    <li><Link to="/timer">Timer</Link></li>
                    <li><Link to="/history">History</Link></li>
                    <li><Link to="/about">About</Link></li>
                </ul>
            </nav>
        </header>
    );

};

export default Header;