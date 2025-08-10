import React, {useEffect} from 'react';

function GetArticleForDirector({id, isSelected}) {
    const [data, setData] = React.useState(null);
    const [decryptedArticleData, setDecryptedArticleData] = React.useState(null);
    const [decryptedCensoredArticleData, setDecryptedCensoredArticleData] = React.useState(null);
    const [decryptedReviewedArticleData, setDecryptedReviewedArticleData] = React.useState(null);
    const [decryptedCensoredReviewedArticleData, setDecryptedCensoredReviewedArticleData] = React.useState(null);
    const [error, setError] = React.useState(null);

    const handleQueryWithId = async () => {
        try {
            const response = await fetch(`https://localhost:8080/v1/article/get?id=${id}`);
            const formData = await response.formData();

            const result = {};
            const pdfUrls = {};

            for (const [key, value] of formData.entries()) {
                if (value instanceof Blob) {
                    // PDF dosyalarını işle
                    const blob = new Blob([value], {type: value.type || 'application/pdf'});
                    const url = URL.createObjectURL(blob);

                    // PDF türüne göre uygun state'e ata
                    if (key === 'decryptedArticleData') {
                        pdfUrls.decryptedArticleData = url;
                    } else if (key === 'decryptedCensoredArticleData') {
                        pdfUrls.decryptedCensoredArticleData = url;
                    } else if (key === 'decryptedReviewedArticleData') {
                        pdfUrls.decryptedReviewedArticleData = url;
                    } else if (key === 'decryptedCensoredReviewedArticleData') {
                        pdfUrls.decryptedCensoredReviewedArticleData = url;
                    }
                } else {
                    // JSON verilerini işle
                    result[key] = value;
                }
            }

            // State'leri güncelle
            setData(result);
            setDecryptedArticleData(pdfUrls.decryptedArticleData);
            setDecryptedCensoredArticleData(pdfUrls.decryptedCensoredArticleData);
            setDecryptedReviewedArticleData(pdfUrls.decryptedReviewedArticleData);
            setDecryptedCensoredReviewedArticleData(pdfUrls.decryptedCensoredReviewedArticleData);
        } catch (error) {
            console.error(error);
            setError("Veri alınırken bir hata oluştu.");
        }
    };

    useEffect(() => {
        const fetch = async () => {
            await handleQueryWithId();
        };
        fetch();
    }, [id]);

    const handleNewWindow = (url) => {
        if (url) {
            window.open(url, "_blank");
        } else {
            setError("PDF URL'si bulunamadı.");
        }
    };

    return (
        <div className={`article-card ${isSelected ? 'selected' : ''}`}>
            <div>
                <label>Article ID: {id}</label>

                {error && <div className="error">{error}</div>}

                {data && (
                    <div>
                        <p>Email: {data.email}</p>
                        <p>Article Status: {data.articleStatus}</p>
                    </div>
                )}

                {decryptedArticleData && (
                    <div>
                        <h4>Raw Article:</h4>
                        <button onClick={() => handleNewWindow(decryptedArticleData)}>
                            PDF'yi Yeni Sekmede Aç
                        </button>
                        <a href={decryptedArticleData} download="decryptedArticleData.pdf">
                            PDF'yi İndir
                        </a>
                    </div>
                )}

                {decryptedCensoredArticleData && (
                    <div>
                        <h4>Censored Article:</h4>
                        <button onClick={() => handleNewWindow(decryptedCensoredArticleData)}>
                            PDF'yi Yeni Sekmede Aç
                        </button>
                        <a href={decryptedCensoredArticleData} download="decryptedCensoredArticleData.pdf">
                            PDF'yi İndir
                        </a>
                    </div>
                )}

                {decryptedReviewedArticleData && (
                    <div>
                        <h4>Reviewed Article:</h4>
                        <button onClick={() => handleNewWindow(decryptedReviewedArticleData)}>
                            PDF'yi Yeni Sekmede Aç
                        </button>
                        <a href={decryptedReviewedArticleData} download="decryptedReviewedArticleData.pdf">
                            PDF'yi İndir
                        </a>
                    </div>
                )}

                {decryptedCensoredReviewedArticleData && (
                    <div>
                        <h4>Censored & Reviewed Article:</h4>
                        <button onClick={() => handleNewWindow(decryptedCensoredReviewedArticleData)}>
                            PDF'yi Yeni Sekmede Aç
                        </button>
                        <a href={decryptedCensoredReviewedArticleData}
                           download="decryptedCensoredReviewedArticleData.pdf">
                            PDF'yi İndir
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
}

export default GetArticleForDirector;