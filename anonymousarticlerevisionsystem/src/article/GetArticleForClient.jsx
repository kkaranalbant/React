// import React, {useState} from 'react';
// import {useDispatch, useSelector} from 'react-redux';
// import {setId, handleQuery, handleQueryWithId} from '../redux/article/GetArticleReducer';
//
// function GetArticleForClient() {
//     const dispatch = useDispatch();
//     const [id, setId] = useState(null);
//     const {
//         // id ,
//         data,
//         decryptedArticleData,
//         decryptedCensoredArticleData,
//         decryptedReviewedArticleData,
//         decryptedCensoredReviewedArticleData,
//         loading,
//         error
//     } = useSelector(state => state.getArticleReducer);
//
//     const handleNewWindow = (url) => {
//         window.open(url, "_blank");
//     }
//
//     const handleSetId = async (id) => {
//         //await dispatch(setId(id));
//         setId(id);
//     }
//
//     return (
//         <div>
//             <label>Article ID: </label>
//             <input
//                 type="text"
//                 value={id || ''}
//                 onChange={(e) => setId(e.target.value)}  // Doğrudan setId kullan
//             />
//             <button
//                 onClick={() => {
//                     if (id) dispatch(handleQueryWithId(id));
//                 }}
//                 disabled={loading}
//             >
//                 {loading ? 'Loading...' : 'Query'}
//             </button>
//
//             {error && <div className="error">{error}</div>}
//
//             {data && (
//                 <div>
//                     <p>Email: {data.email}</p>
//                     <p>Article Status: {data.articleStatus}</p>
//                 </div>
//             )}
//
//             {/* PDF görüntüleme bölümleri aynı kalacak */}
//             {decryptedArticleData && (
//                 <div>
//                     <h4>Raw Article:</h4>
//                     <button onClick={() => handleNewWindow(decryptedArticleData)}>
//                         PDF'yi Yeni Sekmede Aç
//                     </button>
//                     <a href={decryptedArticleData} download="raw_article.pdf">
//                         PDF'yi İndir
//                     </a>
//                 </div>
//             )}
//             {
//                 decryptedCensoredArticleData && (
//                     <div>
//                         <h4>Censored Article:</h4>
//                         <button onClick={() => handleNewWindow(decryptedCensoredArticleData)}>
//                             PDF'yi Yeni Sekmede Aç
//                         </button>
//                         <a href={decryptedCensoredArticleData} download="censored_article.pdf">
//                             PDF'yi İndir
//                         </a>
//                     </div>
//                 )
//             }
//             {/* Diğer PDF bölümleri */}
//         </div>
//     );
// }
//
// export default GetArticleForClient;

import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {setId, handleQuery, handleQueryWithId} from '../redux/article/GetArticleReducer';
import "./css/GetArticleForClient.css";

function GetArticleForClient() {
    const dispatch = useDispatch();
    const [id, setId] = useState(null);
    const {
        data,
        decryptedArticleData,
        decryptedCensoredArticleData,
        decryptedReviewedArticleData,
        decryptedCensoredReviewedArticleData,
        loading,
        error
    } = useSelector(state => state.getArticleReducer);

    const handleNewWindow = (url) => {
        window.open(url, "_blank");
    };

    return (
        <div className="root-container">
            <div>
                <label className="title-label">Article ID:</label>
                <input
                    type="text"
                    value={id || ''}
                    className="input-field"
                    onChange={(e) => setId(e.target.value)}
                    placeholder="Enter article id"
                />
            </div>
            <button
                className="button"
                onClick={() => {
                    if (id) dispatch(handleQueryWithId(id));
                }}
                disabled={loading}
            >
                {loading ? 'Loading...' : 'Query'}
            </button>

            {error && <div className="error">{error}</div>}

            {data && (
                <div className="article-info">
                    <p>Email: {data.email}</p>
                    <p>Article Status: {data.articleStatus}</p>
                </div>
            )}

            {decryptedArticleData && (
                <div className="pdf-section">
                    <h4>Raw Article:</h4>
                    <button className="button" onClick={() => handleNewWindow(decryptedArticleData)}>
                        Open PDF in New Tab
                    </button>
                    <a className="button"
                       style={{textDecoration: 'none', textAlign: 'center', display: 'inline-block', marginTop: '10px'}}
                       href={decryptedArticleData} download="raw_article.pdf">
                        Download PDF
                    </a>
                </div>
            )}

            {decryptedCensoredArticleData && (
                <div className="pdf-section">
                    <h4>Censored Article:</h4>
                    <button className="button" onClick={() => handleNewWindow(decryptedCensoredArticleData)}>
                        Open PDF in New Tab
                    </button>
                    <a className="button"
                       style={{textDecoration: 'none', textAlign: 'center', display: 'inline-block', marginTop: '10px'}}
                       href={decryptedCensoredArticleData} download="censored_article.pdf">
                        Download PDF
                    </a>
                </div>
            )}
            {/* Additional PDF sections can be styled similarly */}
        </div>
    );
}

export default GetArticleForClient;