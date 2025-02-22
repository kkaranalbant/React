import React, {useState} from 'react'




function Increment({name}) {

    const [value , setValue] = useState(0)


    const increment = () => {
        setValue(value+1)
    }

    return (<div>

        <p>Hello {name}</p>
        <p>Clicking Number : {value}</p>
        <button onClick={increment}>Click</button>

    </div>) ;


}

export default Increment ;