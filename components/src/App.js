import logo from './logo.svg';
import './App.css';
import Admin from './Admin'
import User from './User'
import {admin} from './Admin'
import {user} from './User'

import Login from './Login'

function App() {
    return (
        <>
            <Admin />
            <User />
            <div>
                <p>User : {user.username} : {user.password} </p>
                <p>Admin : {admin.username} : {admin.password}</p>
            </div>
        </>
    );
}

export default App;
