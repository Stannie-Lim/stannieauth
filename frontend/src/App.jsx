import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

import { Routes, Route, Link, useNavigate } from "react-router-dom";

import axios from "axios";

const Login = ({ setUser }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const onSubmit = async (ev) => {
    ev.preventDefault();

    try {
      const { data } = await axios.post(
        "http://localhost:3000/api/auth/login",
        {
          username,
          password,
        }
      );

      const { data: user } = await axios.get(
        "http://localhost:3000/api/auth/me",
        { headers: { authorization: data } }
      );

      setUser(user);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <input
        placeholder="username"
        value={username}
        onChange={(ev) => setUsername(ev.target.value)}
      />
      <input
        placeholder="password"
        value={password}
        onChange={(ev) => setPassword(ev.target.value)}
        type="password"
      />
      <button>Login</button>
    </form>
  );
};

const Register = ({ setUser }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const onSubmit = async (ev) => {
    ev.preventDefault();

    try {
      const { data } = await axios.post(
        "http://localhost:3000/api/auth/register",
        {
          username,
          password,
        }
      );

      window.localStorage.setItem("token", data);

      const { data: user } = await axios.get(
        "http://localhost:3000/api/auth/me",
        { headers: { authorization: data } }
      );

      setUser(user);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <input
        placeholder="username"
        value={username}
        onChange={(ev) => setUsername(ev.target.value)}
      />
      <input
        placeholder="password"
        value={password}
        onChange={(ev) => setPassword(ev.target.value)}
        type="password"
      />
      <button>Register</button>
    </form>
  );
};

const Nav = () => {
  return (
    <nav>
      <ul style={{ display: "flex", justifyContent: "space-between" }}>
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
      </ul>
    </nav>
  );
};

function App() {
  const [user, setUser] = useState(null);

  return (
    <>
      {!user && <Nav />}
      <Routes>
        {user ? (
          <Route path="/" element={<div>Hello {user.username}</div>} />
        ) : (
          <>
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/register" element={<Register setUser={setUser} />} />
          </>
        )}
      </Routes>
    </>
  );
}

export default App;
