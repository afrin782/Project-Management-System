import { useState } from "react";
import api from "./api";

interface LoginProps {
    onLogin: () => void;
}

function Login({ onLogin }: LoginProps) {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const login = async () => {

        try {

            const response = await api.post("/users/login", {
                email: email.trim(),
                password: password
            });

            localStorage.setItem("token", response.data);

            onLogin();

        } catch (error) {

            console.log(error);
            setMessage("Invalid email or password");

        }
    };

    return (
        <div className="container">

            <h1>Project Management Tool</h1>

            <h2>Login</h2>

            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <br /><br />

            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <br /><br />

            <button onClick={login}>
                Login
            </button>

            <p>{message}</p>

        </div>
    );
}

export default Login;	