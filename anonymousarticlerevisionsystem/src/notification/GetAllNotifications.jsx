import React, {useEffect, useState} from 'react';
import axios from "axios";
import SendNotificationToAuthor from "./SendNotificationToAuthor";
import './css/GetAllNotifications.css';

function GetAllNotifications(props) {
    const [notifications, setNotifications] = useState([]);
    const [selectedNotification, setSelectedNotification] = useState(null);

    const handleGetAllNotifications = async () => {
        const response = await axios.get("https://localhost:8080/v1/notification/get-all");
        setNotifications(response.data);
    };

    useEffect(() => {
        handleGetAllNotifications();
    }, []);

    return (
        <div className="notifications-container">
            {notifications.map((notification) => (
                <div key={notification.id} className="notification-item">
                    <div>Id: {notification.id}</div>
                    <div>Message: {notification.message}</div>
                    <div>Email: {notification.email}</div>
                    <div>Sent At: {notification.createdAt}</div>
                    <button onClick={() => setSelectedNotification(notification)}>
                        Send Message To Owner
                    </button>
                </div>
            ))}
            {selectedNotification && (
                <SendNotificationToAuthor
                    email={selectedNotification.email}
                    isSelected={true}
                />
            )}
        </div>
    );
}

export default GetAllNotifications;