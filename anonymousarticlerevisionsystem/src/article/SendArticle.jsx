import React from 'react';
import { useDispatch, useSelector } from "react-redux";
import { sendData, setData, setEmail } from "../redux/article/SendArticleReducer";
import "./css/SendArticle.css"

function SendArticle(props) {

    const { email, data } = useSelector((store) => store.sendArticleReducer);
    const dispatch = useDispatch();

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = (event) => {
            const arrayBuffer = event.target.result;
            const uInt8Array = new Uint8Array(arrayBuffer);
            let binary = '';
            for (let i = 0; i < uInt8Array.length; i++) {
                binary += String.fromCharCode(uInt8Array[i]);
            }
            const base64 = btoa(binary);
            dispatch(setData(base64));
        };
        reader.readAsArrayBuffer(file);
    };

    const handleSubmit = async () => {
        await dispatch(sendData());
    };

    return (
        <div className="root-container">
            <div className="form-group">
                <label>Email :</label>
                <input
                    type="text"
                    value={email}
                    onChange={(e) => dispatch(setEmail(e.target.value))}
                />
            </div>
            <div className="form-group">
                <label>Your Article (Only PDF Format !) :</label>
                <input type="file" onChange={handleFileChange} />
            </div>
            <div className="button-container">
                <button className="button" onClick={handleSubmit}>Send</button>
            </div>
        </div>
    );
}

export default SendArticle;