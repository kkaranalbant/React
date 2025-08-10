import React from 'react';
import axios from "axios";
import GetArticleForReferee from "./GetArticleForReferee";
import "./css/AllArticlesForReferee.css";

function AllArticlesForReferee() {
    const [id, setId] = React.useState(null);
    const [articleIds, setArticleIds] = React.useState(null);

    const loadArticleIds = async () => {
        const response = await axios.get("https://localhost:8080/v1/article/get-all-reviewer?reviewerId=" + id);
        setArticleIds(response.data);
    };

    return (
        <div className="root-container">
            <div className="input-group">
                <label>Enter Reviewer Id:</label>
                <input
                    type="number"
                    onChange={(e) => setId(e.target.value)}
                    placeholder="Enter reviewer id"
                />
            </div>
            <button className="button" onClick={loadArticleIds}>Load Referee Articles</button>
            {articleIds && (
                <div className="article-list">
                    {articleIds.map((article) => (
                        <div key={article.id} className="article-item">
                            <GetArticleForReferee id={article.id}/>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default AllArticlesForReferee;