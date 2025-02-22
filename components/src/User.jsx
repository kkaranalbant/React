import React from 'react'
import Login from './Login'


export const user = {

    username : "user" ,
    password : "xxx"

}

function User () {
    return (<div>

            <p>Hoşgeldin User</p>
            <Login />

    </div>)
}

export default User