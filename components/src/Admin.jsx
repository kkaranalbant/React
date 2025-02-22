import React from 'react'
import Login from './Login'


export const admin = {

    username : "admin" ,
    password: "xxx"

} ;


function Admin () {
    return (<div>

            <p>Hoşgeldin Admin</p>
            <Login />
    </div>)
}

export default Admin ;