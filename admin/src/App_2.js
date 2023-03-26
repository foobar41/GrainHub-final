import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import axios from 'axios';
import Login from './Login';
import Dashboard from './Dashboard';
import Products from './Products';
import Orders from './Orders';
import Analytics from './Analytics';

function App() {
    const [loggedIn, setLoggedIn] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const checkLoggedIn = async () => {
            const token = localStorage.getItem('adminToken');
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
        checkLoggedIn();
    }, []);

    const handleLogin = async (email, password) => {
        try {
            const res = await axios.post('/api/admin/login', { email, password });
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

    return (
        <Router>
            <Switch>
                <Route exact path="/">
                    {loggedIn ? (
                        <Dashboard user={user} handleLogout={handleLogout} />
                    ) : (
                        <Login handleLogin={handleLogin} />
                    )}
                </Route>
                <Route path="/products">
                    {loggedIn ? (
                        <Products user={user} />
                    ) : (
                        <Login handleLogin={handleLogin} />
                    )}
                </Route>
                <Route path="/orders">
                    {loggedIn ? (
                        <Orders user={user} />
                    ) : (
                        <Login handleLogin={handleLogin} />
                    )}
                </Route>
                <Route path="/analytics">
                    {loggedIn ? (
                        <Analytics user={user} />
                    ) : (
                        <Login handleLogin={handleLogin} />
                    )}
                </Route>
            </Switch>
        </Router>
    );
}

export default App;