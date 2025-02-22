import React from 'react'
import './Course.css'
import {courses} from './Data';

function Course({course}) {
    return (
        <div className="course">
            <img src={course.image}/>
            <h4>{course.name}</h4>
            <h5>{course.description}</h5>
            <h3>{course.price}</h3>
        </div>
    )
}

export default Course;