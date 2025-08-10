import React, {useState} from 'react';
import AllArticlesWithReviewer from './AllArticlesWithReviewer';
import AllArticlesWithoutReviewer from './AllArticlesWithoutReviewer';

function AllArticlesForDirector() {
    const [showWithReviewer, setShowWithReviewer] = useState(false);


    return (
        <div>
            <div>
                <button onClick={() => setShowWithReviewer(false)}>Show Articles Without Reviewer</button>
                <button onClick={() => setShowWithReviewer(true)}>Show Articles With Reviewer</button>
            </div>
            <div>
                {showWithReviewer ? (
                    <AllArticlesWithReviewer/>
                ) : (
                    <AllArticlesWithoutReviewer/>
                )}
            </div>
        </div>
    );
}

export default AllArticlesForDirector;