import axios from "axios";
import { useRef } from "react";
import "./register.css";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";


export default function Register() {
  const name = useRef();
  const email = useRef();
  const password = useRef();
  const passwordAgain = useRef();
  const history = useHistory();

  const handleClick = async (e) => {
    e.preventDefault();
    if (passwordAgain.current.value !== password.current.value) {
      passwordAgain.current.setCustomValidity("Passwords don't match!");
    } else {
      const user = {
        name: name.current.value,
        email: email.current.value,
        password: password.current.value,
      };
      try {
        await axios.post("http://localhost:5000/api/auth/register", user);
        history.push("/login");
      } catch (err) {
        // passwordAgain.current.setCustomValidity("Incorrect credentials");
        console.log(err);
      }
    }
  };

  return (
    <div className="login">
      <div className="loginWrapper">
        <div className="loginLeft">
          <h3 className="loginLogo">GrainHub</h3>
          <span className="loginDesc">
            Connect with Farmers and the world around you on GrainHub.
          </span>
        </div>
        <div className="loginRight">
          <form className="loginBox" onSubmit={handleClick}>
            <input
              placeholder="Name"
              required
              ref={name}
              className="loginInput"
            />
            <input
              placeholder="Email"
              required
              ref={email}
              className="loginInput"
              type="email"
            />
            <input
              placeholder="Password"
              required
              ref={password}
              className="loginInput"
              type="password"
              minLength="6"
            />
            <input
              placeholder="Password Again"
              required
              ref={passwordAgain}
              className="loginInput"
              type="password"
            />
            <button className="loginButton" type="submit">
              Sign Up
            </button>
          </form>
          <button className="loginRegisterButton"><Link to="/login" style={{ textDecoration: 'none', color: 'white' }}>Log into Account</Link></button>

        </div>
      </div>
    </div>
  );
}