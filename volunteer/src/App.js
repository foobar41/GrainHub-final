import Sidebar from "./components/sidebar/Sidebar";
import Topbar from "./components/topbar/Topbar";
import "./App.css";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import NewProduct from "./pages/newProduct/NewProduct";
import Login from "./pages/login/Login";
import { useSelector } from "react-redux";


function App() {
  let volunteer = true;
  try{
    const volunteer1 = useSelector((state) => state.user.currentUser.isVolunteer);

    volunteer = volunteer1;
  }
  catch(err){
    console.log(err);
    // volunteer = false;
  }
  // const volunteer = true;
  if (!volunteer){
    return (
      <Router>
        <Switch>
          <Route path="/"><Login /></Route>
        </Switch>
      </Router>
    );
  }
  else{
    return (
      <Router>
        <Switch>
          <>
            <Topbar />
            <div className="container">
              <Sidebar />
              <Route path="/"><NewProduct /></Route>              
            </div>
          </>
        </Switch>
      </Router>
    );
  }
}

export default App;
