import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from "./components/sidebar/Sidebar";
import Topbar from "./components/topbar/Topbar";
import "./App.css";
import Home from "./pages/home/Home";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import UserList from "./pages/userList/UserList";
import User from "./pages/user/User";
import NewUser from "./pages/newUser/NewUser";
import ProductList from "./pages/productList/ProductList";
import Product from "./pages/product/Product";
import NewProduct from "./pages/newProduct/NewProduct";
import Login from "./pages/login/Login";
import { useSelector } from "react-redux";
import ContactList from "./pages/contactList/ContactList";
import OrderList from "./pages/orderList/OrderList";
import Contact from "./pages/contact/Contact";
import PayList from "./pages/paymentList/Transactions";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    handleLogin();
    checkLoggedIn();
  }, []);

  const checkLoggedIn = async () => {
    const token = localStorage.getItem('adminToken');
    console.log('adminToken:', token);
    if (token) {
      try {
        const res = await axios.get('/api/admin/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setLoggedIn(true);
        setUser(res.data);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleLogin = async (email, password) => {
    try {
      const res = await axios.get('/api/users/findEmail/:email', { email, password });
      console.log('res:', res.data)
      localStorage.setItem('adminToken', res.data.token);
      setLoggedIn(true);
      setUser(res.data.user);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setLoggedIn(false);
    setUser(null);
  };


  const display = () => {
    console.log('adminToken_App:',localStorage.getItem('adminToken'))
  }
  // const admin = useSelector((state) => state.user.currentUser.isAdmin);
  const admin = false;
  return (
    <Router>
      {display()}
      <Switch>
        {!admin ? ( <Route exact path="/">
          <Login />
        </Route>) : (
          <>
            <Topbar />
            <div className="container">
              <Sidebar />
              <Route exact path="/">
                <Home />
              </Route>
              <Route path="/users">
                <UserList />
              </Route>
              <Route path="/user/:userId">
                <User />
              </Route>
              <Route path="/newUser">
                <NewUser />
              </Route>
              <Route path="/products">
                <ProductList />
              </Route>
              <Route path="/product/:productId">
                <Product />
              </Route>
              <Route path="/newproduct">
                <NewProduct />
              </Route>
              <Route path="/contacts">
                <ContactList />
              </Route>
              <Route path="/contact/:contactId">
                <Contact />
              </Route>
              <Route path="/orders">
                <OrderList />
              </Route>
              <Route path="/transactions">
                <PayList />
              </Route>
            </div>
          </>
        )}
      </Switch>
    </Router>
  );
}

export default App;
