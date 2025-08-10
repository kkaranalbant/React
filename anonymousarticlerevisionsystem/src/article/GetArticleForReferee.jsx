import React, {useEffect} from 'react';
import "./css/GetArticleForReferee.css";
import axios from "axios";

function GetArticleForReferee({id}) {
    const [data, setData] = React.useState(null);
    const [decryptedCensoredArticleData, setDecryptedCensoredArticleData] = React.useState(null);
    const [decryptedCensoredReviewedArticleData, setDecryptedCensoredReviewedArticleData] = React.useState(null);
    const [error, setError] = React.useState(null);
    const [isEditingMode, setEditingMode] = React.useState(false);
    const [review, setReview] = React.useState(null);

    const handleQueryWithId = async () => {
        try {
            const response = await fetch(`https://localhost:8080/v1/article/get-article-reviewer?id=${id}`);
            const formData = await response.formData();

            const result = {};
            const pdfUrls = {};

            for (const [key, value] of formData.entries()) {
                if (value instanceof Blob) {
                    const blob = new Blob([value], {type: value.type || 'application/pdf'});
                    const url = URL.createObjectURL(blob);
                    if (key === 'decryptedCensoredArticleData') {
                        pdfUrls.decryptedCensoredArticleData = url;
                    } else if (key === 'decryptedCensoredReviewedArticleData') {
                        pdfUrls.decryptedCensoredReviewedArticleData = url;
                    }
                } else {
                    result[key] = value;
                }
            }

            setData(result);
            setDecryptedCensoredArticleData(pdfUrls.decryptedCensoredArticleData);
            setDecryptedCensoredReviewedArticleData(pdfUrls.decryptedCensoredReviewedArticleData);
        } catch (error) {
            console.error(error);
            setError("Error occurred while fetching data.");
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            await handleQueryWithId();
        };
        fetchData();
    }, [id]);

    const handleNewWindow = (url) => {
        if (url) {
            window.open(url, "_blank");
        } else {
            setError("PDF URL not found.");
        }
    };

    const reviewArticle = async () => {
        const payload = {
            articleId: id,
            review: review
        };
        await axios.post("https://localhost:8080/v1/article/review", payload);
        setEditingMode(false);
    };

    return (
        <div className="get-article-container">
            <div className="article-header">Article ID: {id}</div>

            {error && <div className="error">{error}</div>}

            {data && (
                <div className="article-info">
                    <p>Email: {data.email}</p>
                    <p>Article Status: {data.articleStatus}</p>
                </div>
            )}

            {decryptedCensoredArticleData && (
                <div className="action-group">
                    <h4>Censored Article:</h4>
                    <button className="button" onClick={() => handleNewWindow(decryptedCensoredArticleData)}>
                        Open PDF in New Tab
                    </button>
                    <a className="button" style={{textDecoration: 'none', textAlign: 'center'}}
                       href={decryptedCensoredArticleData} download="decryptedCensoredArticleData.pdf">
                        Download PDF
                    </a>
                </div>
            )}

            {decryptedCensoredReviewedArticleData && (
                <div className="action-group">
                    <h4>Censored & Reviewed Article:</h4>
                    <button className="button" onClick={() => handleNewWindow(decryptedCensoredReviewedArticleData)}>
                        Open PDF in New Tab
                    </button>
                    <a className="button" style={{textDecoration: 'none', textAlign: 'center'}}
                       href={decryptedCensoredReviewedArticleData} download="decryptedCensoredReviewedArticleData.pdf">
                        Download PDF
                    </a>
                </div>
            )}

            <button className="button" onClick={() => setEditingMode(!isEditingMode)}>Review Article</button>

            {isEditingMode && (
                <div className="review-group">
                    <input
                        type="text"
                        className="review-input"
                        placeholder="Enter your review..."
                        onChange={(e) => setReview(e.target.value)}
                    />
                    <button className="button" onClick={reviewArticle}>Submit Review</button>
                </div>
            )}
        </div>
    );
}

export default GetArticleForReferee;