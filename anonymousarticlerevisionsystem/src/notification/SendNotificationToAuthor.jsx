import React, {useState} from 'react';
import axios from "axios";
import './css/SendNotificationToAuthor.css';

function SendNotificationToAuthor({email, isSelected}) {
    const [message, setMessage] = useState('');
    const [response, setResponse] = useState(null);
    const sendMessage = async () => {
        const payload = {
            email: email,
            message: message
        }
        const response = await axios.post("https://localhost:8080/v1/notification/send-author", payload)
        setResponse(response.data)
    }
    return (
        <div>
            {isSelected && (
                <div className="send-notification-container">
                    <label>Send Message To Author</label>
                    <input type="text" onChange={(e) => setMessage(e.target.value)} value={message}/>
                    <button onClick={sendMessage}>Send</button>
                    {response && (
                        <div className="response-message">
                            {response.message}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default SendNotificationToAuthor;