import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../redux/apiCalls";
import axios from 'axios';

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const { isFetching, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  // const handleClick = (e) => {
  //   e.preventDefault();
  //   login(dispatch, { username, password });
  // };

  const handleLogin = async(e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/admin/login', { username, password });
      console.log('res:', res)
      localStorage.setItem('adminToken', res.data.token);
      setLoggedIn(true);
      setUser(res.data.user);
      login(dispatch, { username, password });
    } catch (err) {
      console.error(err);
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
