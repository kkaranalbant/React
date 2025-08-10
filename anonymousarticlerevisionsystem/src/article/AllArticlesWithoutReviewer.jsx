import React, {useEffect, useState} from "react";
import axios from "axios";
import GetArticleForDirector from "./GetArticleForDirector";
import GetReviewers from "../reviewer/GetReviewers";
import "./css/AllArticlesWithoutReviewer.css";

function AllArticlesWithoutReviewer() {
    const [data, setData] = useState(null);
    const [selectedArticle, setSelectedArticle] = useState(null);
    const [selectedReviewer, setSelectedReviewer] = useState(null);
    const [censorName, setCensorName] = useState(false);
    const [censorInstitution, setCensorInstitution] = useState(false);
    const [censorContact, setCensorContact] = useState(false);
    const [error, setError] = useState(null);

    const getAllArticlesWithoutReviewer = async () => {
        const url = "https://localhost:8080/v1/article/get-all-non-reviewed";
        const response = await axios.get(url);
        setData(response.data);
    };

    useEffect(() => {
        getAllArticlesWithoutReviewer();
    }, []);

    const handleArticleSelect = (articleId) => {
        // Only update selection if a different article is clicked.
        if (selectedArticle !== articleId) {
            setSelectedArticle(articleId);
        }
    };

    const handleReviewerSelect = (reviewerId) => {
        if (selectedReviewer === reviewerId) {
            setSelectedReviewer(null);
        } else {
            setSelectedReviewer(reviewerId);
        }
    };

    const handleAssignReviewer = async () => {
        if (!selectedArticle || !selectedReviewer) {
            alert("Lütfen bir makale ve hakem seçin");
            return;
        }

        try {
            await axios.post("https://localhost:8080/v1/article/send-to-reviewer", {
                articleId: selectedArticle,
                reviewerId: selectedReviewer,
                nameCensored: censorName,
                contactCensored: censorContact,
                institutionCensored: censorInstitution,
            });
            alert("Hakem başarıyla atandı");
            const response = await axios.get(
                "https://localhost:8080/v1/article/get-all-non-reviewed"
            );
            setData(response.data);
        } catch (err) {
            setError("Hakem atama işlemi başarısız oldu");
        }
    };

    if (!data) return null;

    return (
        <div className="all-articles">
            {data.map((element) => (
                <div
                    key={element.id}
                    onClick={() => handleArticleSelect(element.id)}
                    className={`article-container ${
                        selectedArticle === element.id ? "selected" : ""
                    }`}
                >
                    <div className="article-header">Article {element.id}</div>
                    <div className="article-content">
                        <GetArticleForDirector
                            id={element.id}
                            isSelected={selectedArticle === element.id}
                        />
                    </div>
                </div>
            ))}
            <div className="reviewers-section">
                <GetReviewers
                    onReviewerSelect={handleReviewerSelect}
                    selectedReviewer={selectedReviewer}
                />
            </div>
            {selectedArticle && selectedReviewer && (
                <div className="censor-options">
                    <div className="article-header">Choose Censor Options :</div>
                    <div className="article-content">
                        <label className="option">
                            <input
                                type="checkbox"
                                value="Censor Name And Lastname"
                                onChange={() => setCensorName(!censorName)}
                            />
                            Censor Name And Lastname
                        </label>
                        <label className="option">
                            <input
                                type="checkbox"
                                value="Censor Institution Info"
                                onChange={() => setCensorInstitution(!censorInstitution)}
                            />
                            Censor Institution Info
                        </label>
                        <label className="option">
                            <input
                                type="checkbox"
                                value="Censor Contact Info"
                                onChange={() => setCensorContact(!censorContact)}
                            />
                            Censor Contact Info
                        </label>
                    </div>
                    <div className="article-footer">
                        <button className="button" onClick={handleAssignReviewer}>
                            Assign Reviewer
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AllArticlesWithoutReviewer;
