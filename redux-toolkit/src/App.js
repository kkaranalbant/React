import logo from './logo.svg';
import './App.css';
import {useDispatch, useSelector} from "react-redux"
import {decrement, increment} from "./redux/CounterSlice";

function App() {
    const {count} = useSelector((store) => store.counter);
    const dispatch = useDispatch()
    return (
        <div className="App">
            {count}
            <button onClick={() => dispatch(increment())}> Increment</button>
            <button onClick={() => dispatch(decrement())}> Decrease</button>
        </div>
    );
}

export default App;
