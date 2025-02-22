import {useEffect , useState} from "react";

function App() {

  const [name , setName] = useState('Kaan') ;

  const [lastname , setLastname] = useState('Karanalbant');

  const [message , setMessage] = useState('')

  useEffect(() => {
    setMessage(`İsim değişti : ${name}`)
  }, [name]);

  useEffect(()=>{
    setMessage(`Soyisim Değişti : ${lastname}`)
  } , [lastname])

  useEffect(() => {
    setMessage("Hem İsim Hem Soyisim Değişti")
  }, [name , lastname]);

  return (
    <div >
      <button onClick={()=>setName("Yeni İsimx")} > Change Name</button>
      <button onClick={()=>setLastname("Yeni Soyisim")} > Change Lastname</button>
      <p>{message}</p>
    </div>
  );
}

export default App;
