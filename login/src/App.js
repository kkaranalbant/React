import logo from './logo.svg';
import './App.css';
import Login from "./login/Login"
import {useState} from "react";
import {Routes, Route} from "react-router-dom";
import Router from "../src/route/Router"
import Header from "./Header";

function App() {
    return (
        <div>
            <Header/>
            <Router/>
        </div>
    );
}

export default App;
