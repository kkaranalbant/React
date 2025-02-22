import React from 'react'
import Header from './header/Header'
import {courses} from './course/Data'
import Course from './course/Course'


function App() {
    return (
        <>
            <div>
                <Header/>
            </div>
            <div className="course-container">
                {courses.map((course) => <Course key={course.id} course={course}/>)}
            </div>
        </>
    );
}

export default App;
