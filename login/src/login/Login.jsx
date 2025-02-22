import React from 'react'
import axios from 'axios'
import './Login.css'
import {useState} from 'react'


const LOGIN_URL = "http://localhost:8080/login"

function Login() {

    const [username, setUsername] = useState('')

    const [password, setPassword] = useState('')

    const postLogin = async () => {
        const loginDto = {
            username: username,
            password: password
        }
        const response = await axios.post(LOGIN_URL, loginDto)
    }

    return (

        <div className="login">
            <div className="username-container">
                <label htmlFor="username" className="label">Username : </label>
                <input type="text" name="username" id="username" onChange={(e) => {
                    setUsername(e.target.value)
                }} required/>
            </div>
            <div className="password-container">
                <label htmlFor="password" className="label">Password : </label>
                <input type="password" name="password" id="password" onChange={(e) => {
                    setPassword(e.target.value)
                }} required/>
            </div>
            <div>
                <button onClick={postLogin}> Login</button>
            </div>
        </div>
    )
        ;

}

export default Login;