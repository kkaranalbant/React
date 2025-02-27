import React from 'react';
import {Link, useLocation} from 'react-router-dom';
import './Header.css'

function Header(props) {
    const url = useLocation()
    if (url.pathname !== '/') {
        return null
    }
    return (
        <div>
            <header className="header-container">
                <Link className="link" to="/login">Login</Link>
                <Link className="link" to="/register">Register</Link>
            </header>
        </div>
    );
}

export default Header;