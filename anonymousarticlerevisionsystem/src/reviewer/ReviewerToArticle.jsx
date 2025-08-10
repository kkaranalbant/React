import React from 'react';

function ReviewerToArticle({data}) {
    return (
        <div>
            <label> ID : {data.id}</label>
            <label> Name  : {data.name}</label>
            <label> Lastname : {data.lastname}</label>
            <button onClick={}>Assign</button>
        </div>
    );
}

export default ReviewerToArticle;