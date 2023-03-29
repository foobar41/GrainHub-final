import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../redux/apiCalls";
import axios from 'axios';

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { isFetching, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const handleLogin = async(e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/admin/login', { username, password });
      if (res.data.isAdmin) {
        localStorage.setItem('adminToken', res.data.accessToken);
        login(dispatch, { username, password });
        window.location.reload();
      } else {
        alert('You are not an admin!');
      }

    } catch (err) {
      console.log('something:',err);
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <input
        style={{ padding: 10, marginBottom: 20 }}
        type="text"
        placeholder="username"
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        style={{ padding: 10, marginBottom: 20 }}
        type="password"
        placeholder="password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin} style={{ padding: 10, width:100 }}>
        Login
      </button>
      {error && <h1>Something went wrong...</h1>}
    </div>
  );
};

export default Login;
