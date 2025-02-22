import logo from './logo.svg';
import './App.css';
import Hello from "./Hello"
import Container from "./Container";


function App() {
    let nameFromFunc = "Name"
    return (
        <div>
            <div> Header</div>
            <Container>
                <Hello name="Kaan"/>
            </Container>

            <Hello name={nameFromFunc}/>
        </div>
    );
}

export default App;
