import React from 'react'


function Names() {
    const [names, setNames] = React.useState(["Kaan", "Cagri", "Dudu", "Mehmet"]);

    const changeNames = () => (
        setNames(["Ahmet", "Mehmet", "Veli", "XX","Mx"])
    )

    return (<div>
        <p>{names+""}</p>
        <button onClick={changeNames}>Change Names</button>
    </div>);

}

export default Names;