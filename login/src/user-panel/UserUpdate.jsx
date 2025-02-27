import React from 'react';
import './css/UserUpdate.css'
import {useDispatch, useSelector} from "react-redux";
import {fetchUserData} from "../redux/UserInfoReducer";
import {updateUser} from ".//../redux/UserUpdateReducer"
import {
    updateBirthDate,
    updateEmail,
    updateImage,
    updateLastName,
    updateName, updatePassword,
    updateUsername
} from "../redux/UserUpdateReducer";
import {useEffect} from "react";

function UserUpdate(props) {
    const {
        username,
        password,
        name,
        lastname,
        birthDate,
        image,
        email ,
    } = useSelector((store) => store.userUpdateReducer);


    const dispatch = useDispatch();

    useEffect(() => {
        const fetchData = async () => {
            const data = await dispatch(fetchUserData()).unwrap();
            dispatch(updateUsername(data.username));
            dispatch(updateName(data.name));
            dispatch(updateLastName(data.lastname));
            dispatch(updateImage(data.image)); // Base64 formatındaki resim
            dispatch(updateEmail(data.email));
            dispatch(updateBirthDate(data.birthDate));
        };
        fetchData();
    }, [dispatch]);

    const updateUserInfos = async () => {
        try {
            if (!image) {
                updateImage(Array.from(image))
            }
            const result = await dispatch(updateUser()).unwrap();
            console.log("Update başarılı:", result);
        } catch (error) {
            console.error("Update başarısız:", error);
        }
    };

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result.split(",")[1]; // Base64 verisini al
                dispatch(updateImage(base64String)); // Redux state'ini güncelle
            };
            reader.readAsDataURL(file); // Dosyayı Base64 formatına dönüştür
        }
    };

    return (
        <div className="fom">
            <div className="form-label-input-container">
                <label htmlFor="username">Username</label>
                <input type="text" name="username" value={username}
                       onChange={(e) => dispatch(updateUsername(e.target.value))}/>
            </div>
            <div className="form-label-input-container">
                <label htmlFor="password">Password</label>
                <input type="password" name="password" onChange={(e) => dispatch(updatePassword(e.target.value))}/>
            </div>
            <div className="form-label-input-container">
                <label htmlFor="birthDate">Birth Date</label>
                <input type="date" name="birthDate" value={birthDate}
                       onChange={(e) => dispatch(updateBirthDate(e.target.value))}/>
            </div>
            <div className="form-label-input-container">
                <label htmlFor="email">E-mail</label>
                <input type="text" name="email" value={email}
                       onChange={(e) => dispatch(updateEmail(e.target.value))}/>
            </div>
            <div className="form-label-input-container">
                <label htmlFor="name">Name</label>
                <input type="text" name="name" value={name} onChange={(e) => dispatch(updateName(e.target.value))}/>
            </div>
            <div className="form-label-input-container">
                <label htmlFor="lastname">Lastname</label>
                <input type="text" name="lastname" value={lastname}
                       onChange={(e) => dispatch(updateLastName(e.target.value))}/>
            </div>
            <div className="form-label-input-container">
                <label htmlFor="image">Image</label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                />
                {image && (
                    <img
                        src={`data:image/jpeg;base64,${image}`}
                        alt="User Profile"
                        style={{width: "100px", height: "100px"}}
                    />
                )}
            </div>
            <button onClick={updateUserInfos}>Update</button>
        </div>
    );
}

export default UserUpdate;