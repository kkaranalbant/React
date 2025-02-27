import React, {useEffect} from "react";
import "./Login.css";
import {useDispatch, useSelector} from "react-redux";
import {login, setUsername, setPassword} from "../redux/LoginPanelReducer";
import {useNavigate} from "react-router-dom";

function Login() {
    const {isLoggedIn, username, password, waiting, error} = useSelector(
        (store) => store.loginReducer
    );
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Başarılı login durumunda yönlendirme
    useEffect(() => {
        if (isLoggedIn) {
            navigate("/main-user");
        }
    }, [isLoggedIn, navigate]);

    const handleLogin = () => {
        dispatch(login({username, password}));
    };

    return (
        <div className="login">
            <div className="username-container">
                <label htmlFor="username" className="label">
                    Username:
                </label>
                <input
                    type="text"
                    name="username"
                    id="username"
                    value={username || ""}
                    onChange={(e) => dispatch(setUsername(e.target.value))}
                    required
                />
            </div>
            <div className="password-container">
                <label htmlFor="password" className="label">
                    Password:
                </label>
                <input
                    type="password"
                    name="password"
                    id="password"
                    value={password || ""}
                    onChange={(e) => dispatch(setPassword(e.target.value))}
                    required
                />
            </div>
            <div>
                <button onClick={handleLogin} disabled={waiting}>
                    {waiting ? "Logging in..." : "Login"}
                </button>
            </div>
            {!isLoggedIn && !waiting && (
                <p style={{color: "red"}}>Incorrect Username or Password</p>
            )}
        </div>
    );
}

export default Login;