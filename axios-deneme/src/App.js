import logo from './logo.svg';
import './App.css';
import axios from "axios";
import {useState} from 'react'

function App() {

  const [id , setId] = useState(0) ;

  const userFetcher = async () => {
    const response = await axios.get("https://jsonplaceholder.typicode.com/users")
    console.log(response.data);
  }

  const getUserById = async () => {
    const response = await axios.get("https://jsonplaceholder.typicode.com/users/"+id)
    console.log(response.data);
  }

  return (
      <div>
        <button onClick={userFetcher}>Click</button>
        <input type="number" onChange = {(e) => (setId(e.target.value))}/>
        <button onClick={getUserById}>Click</button>
      </div>
  );
}

export default App;
