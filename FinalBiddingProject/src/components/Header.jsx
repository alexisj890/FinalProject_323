import React from 'react';

function Header({onLoginClick}){
    return(
        <header>
            <nav>
                <h1>Bidding</h1>
                <ul>
                    <li>
                        <a href="#features">Features</a>
                    </li>
                    <li>
                        <a href="#user-types">User types</a>
                    </li>
                    <li>
                        <a href="#signup">Sign Up</a>
                    </li>
                    <li>
                    <button className="nav-button" onClick={onLoginClick}>Login</button>
                    </li>
                </ul>
            </nav>
        </header>
    )
}

export default Header