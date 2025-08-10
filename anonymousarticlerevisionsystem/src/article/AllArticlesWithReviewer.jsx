import React, {useEffect, useState} from 'react';
import axios from 'axios';
import GetArticleForDirector from './GetArticleForDirector';
import GetReviewers from '../reviewer/GetReviewers';
import "./css/AllArticlesWithReviewer.css";

function AllArticlesWithReviewer() {
    const [data, setData] = useState(null);
    const [selectedArticle, setSelectedArticle] = useState(null);
    const [selectedReviewer, setSelectedReviewer] = useState(null);
    const [censorName, setCensorName] = useState(false);
    const [censorInstitution, setCensorInstitution] = useState(false);
    const [censorContact, setCensorContact] = useState(false);

    const getAllArticlesWithReviewer = async () => {
        const url = 'https://localhost:8080/v1/article/get-all-reviewed';
        const response = await axios.get(url);
        setData(response.data);
    };

    useEffect(() => {
        getAllArticlesWithReviewer();
    }, []);

    const handleChangeReviewer = async () => {
        if (selectedArticle && selectedReviewer) {
            try {
                await axios.post('https://localhost:8080/v1/article/change-reviewer', {
                    articleId: selectedArticle,
                    reviewerId: selectedReviewer,
                    nameCensored: censorName,
                    contactCensored: censorContact,
                    institutionCensored: censorInstitution,
                });
                alert('Reviewer changed successfully');
            } catch (err) {
                alert('Failed to change reviewer');
            }
        }
    };

    const handleRemoveReviewer = async (articleId) => {
        try {
            await axios.get(`https://localhost:8080/v1/article/delete-reviewer?id=${articleId}`);
            alert('Reviewer removed successfully');
            getAllArticlesWithReviewer();
        } catch (err) {
            alert('Failed to remove reviewer');
        }
    };

    const handleReviewerSelect = (reviewerId) => {
        // Toggle reviewer selection: if same reviewer is clicked, clear selection.
        if (selectedReviewer === reviewerId) {
            setSelectedReviewer(null);
        } else {
            setSelectedReviewer(reviewerId);
        }
    };

    if (!data) return null;

    return (
        <div>
            {data.map((element) => (
                <div
                    key={element.id}
                    onClick={() => setSelectedArticle(element.id)}
                    className={`article-container article-item ${selectedArticle === element.id ? 'selected' : ''}`}
                >
                    <div className="article-header">Article {element.id}</div>
                    <div className="article-content">
                        <GetArticleForDirector id={element.id} isSelected={selectedArticle === element.id}/>
                    </div>
                    <div className="article-footer">
                        <button className="button" onClick={() => handleRemoveReviewer(element.id)}>
                            Remove Reviewer
                        </button>
                    </div>
                </div>
            ))}
            <div>
                <GetReviewers onReviewerSelect={handleReviewerSelect} selectedReviewer={selectedReviewer}/>
            </div>
            {selectedArticle && selectedReviewer && (
                <div className="options-container">
                    <div className="options-header">Choose Censor Options :</div>
                    <div className="article-content">
                        <div className="option">
                            <input
                                type="checkbox"
                                value="Censor Name And Lastname"
                                onChange={() => setCensorName(!censorName)}
                            />
                            <span style={{marginLeft: '8px'}}>Censor Name And Lastname</span>
                        </div>
                        <div className="option">
                            <input
                                type="checkbox"
                                value="Censor Institution Info"
                                onChange={() => setCensorInstitution(!censorInstitution)}
                            />
                            <span style={{marginLeft: '8px'}}>Censor Institution Info</span>
                        </div>
                        <div className="option">
                            <input
                                type="checkbox"
                                value="Censor Contact Info"
                                onChange={() => setCensorContact(!censorContact)}
                            />
                            <span style={{marginLeft: '8px'}}>Censor Contact Info</span>
                        </div>
                    </div>
                    <div className="article-footer">
                        <button className="button" onClick={handleChangeReviewer}>
                            Change Reviewer
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AllArticlesWithReviewer;