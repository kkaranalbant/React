import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import {fetchUserData} from "../redux/UserInfoReducer";
import {useEffect} from 'react';

function UserInfo() {
    const {data, error, loading} = useSelector((store) => store.userInfoReducer);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchUserData());
    }, [dispatch]);

    // 1. Yüklenme durumu
    if (loading) {
        return <div>Loading user data...</div>;
    }

    // 2. Hata durumu
    if (error) {
        return <div>Error: {error.toString()}</div>;
    }

    // 3. Data yoksa null dön (veya boş fragment)
    if (!data) {
        return null; // Veya <></>
    }

    // 4. Data varsa normal render
    return (
        <div style={{color:"red"}}>
            Username: {data.username}<br/>
            Name: {data.name}<br/>
            Lastname: {data.lastname}<br/>
            Birthdate: {data.birthdate?.toString()}
        </div>
    );
}

export default UserInfo;