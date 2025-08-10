import React, {useEffect, useState} from 'react';
import axios from 'axios';
import "./css/GetReviewers.css";

function GetReviewers({onReviewerSelect, selectedReviewer}) {
    const url = "https://localhost:8080/v1/user/get-all-reviewers";
    const [data, setData] = useState(null);

    useEffect(() => {
        const makeRequest = async () => {
            try {
                const response = await axios.get(url);
                setData(response.data);
            } catch (error) {
                console.error("Hakemler yüklenemedi:", error);
            }
        };
        makeRequest();
    }, [url]);

    return (
        <div className="reviewer-list">
            {data &&
                data.map((reviewer) => (
                    <div
                        key={reviewer.id}
                        className={`reviewer-item ${selectedReviewer === reviewer.id ? 'selected' : ''}`}
                        onClick={() => onReviewerSelect(reviewer.id)}
                    >
                        <div>ID: {reviewer.id}</div>
                        <div>Ad: {reviewer.name}</div>
                        <div>Soyad: {reviewer.lastname}</div>
                    </div>
                ))}
        </div>
    );
}

export default GetReviewers;