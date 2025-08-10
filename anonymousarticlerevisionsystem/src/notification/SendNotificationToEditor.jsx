import React, {useState} from 'react';
import axios from 'axios';
import './css/SendNotificationToEditor.css';

function SendNotificationToEditor(props) {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [response, setResponse] = useState(null);
    const sendMessage = async () => {
        const payload = {
            email: email,
            message: message
        }
        const response = await axios.post("https://localhost:8080/v1/notification/send-editor", payload)
        setResponse(response.data);
    }
    return (
        <div className="send-notification-container">
            <label>Send Message To Editor</label>
            <div>
                <label>Email : </label>
                <input type="text" onChange={(e) => setEmail(e.target.value)} value={email}/>
            </div>
            <div>
                <label>Message : </label>
                <input type="text" onChange={(e) => setMessage(e.target.value)} value={message}/>
            </div>
            <button onClick={sendMessage}>Send</button>
            {response && (
                <div className="response-message">
                    {response.message}
                </div>
            )}
        </div>
    );
}

export default SendNotificationToEditor;