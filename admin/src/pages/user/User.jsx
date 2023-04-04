import {
  CalendarToday,
  LocationSearching,
  MailOutline,
  PermIdentity,
  PhoneAndroid,
  Publish,
} from "@material-ui/icons";
import { Link } from "react-router-dom";
import "./user.css";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { userRequest } from "../../requestMethods";
import { useDispatch } from "react-redux";


export default function User() {
  const location = useLocation();
  const id = location.pathname.split("/")[2];
  const [user, setUser] = useState({});
  const dispatch = useDispatch();
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone);
  const [address, setAddress] = useState(user.address);
  
  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await userRequest.get("/users/find/" + id);

        setUser(res.data);
      } catch {}
    };

    getUser();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault()
    const updatedUser = {
      name,
      email,
      phone,
      address,
    };
    userRequest
      .put(`http://localhost:5000/api/users/update/${id}`, updatedUser)
      .then((response) => {
        console.log(response.data);
        alert("User updated successfully.");
      })
      .catch((error) => {
        console.log(error);
        alert("An error occurred while updating the user.");
      });
  };

  return (
    <div className="user">
      
      <div><b>Username: </b>{user.name} </div>
      <div><b>Email: </b>{user.email} </div>

      {/* {"  Email:  " + user.email} */}
      <div></div>
      <div className="userTitleContainer">
        <h1 className="userTitle">Edit User</h1>
        {/* <Link to="/newUser">
          <button className="userAddButton">Create</button>
        </Link> */}
      </div>
      <div className="userContainer">
        <div className="userShow">
          <div className="userShowTop">
            <div className="userShowTopTitle">
              <span className="userShowUsername">{user.name}</span>
            </div>
          </div>
          <div className="userShowBottom">
            <span className="userShowTitle">User</span>
            <div className="userShowInfo">
              <PermIdentity className="userShowIcon" />
              <span className="userShowInfoTitle">{user.name}</span>
            </div>
            <div className="userShowInfo">
              <CalendarToday className="userShowIcon" />
              <span className="userShowInfoTitle">{user.createdAt}</span>
            </div>
            <span className="userShowTitle">Contact Details</span>
            <div className="userShowInfo">
              <PhoneAndroid className="userShowIcon" />
              <span className="userShowInfoTitle">{user.phone}</span>
            </div>
            <div className="userShowInfo">
              <MailOutline className="userShowIcon" />
              <span className="userShowInfoTitle">{user.email}</span>
            </div>
            <div className="userShowInfo">
              <LocationSearching className="userShowIcon" />
              <span className="userShowInfoTitle">{user.address}</span>
            </div>
          </div>
        </div>
        <div className="userUpdate">
          <span className="userUpdateTitle">Edit</span>
          <form className="userUpdateForm">
            <div className="userUpdateLeft">
              <div className="userUpdateItem">
                <label>Username</label>
                <input
                  type="text"
                  placeholder={user.name}
                  className="userUpdateInput"
                  onChange={(event) => setName(event.target.value)}
                />
              </div>
              <div className="userUpdateItem">
                <label>Email</label>
                <input
                  type="text"
                  placeholder={user.email}
                  className="userUpdateInput"
                  onChange={(event) => setEmail(event.target.value)}
                />
              </div>
              <div className="userUpdateItem">
                <label>Phone</label>
                <input
                  type="text"
                  placeholder={user.phone}
                  className="userUpdateInput"
                  onChange={(event) => setPhone(event.target.value)}
                />
              </div>
              <div className="userUpdateItem">
                <label>Address</label>
                <input
                  type="text"
                  placeholder={user.address}
                  className="userUpdateInput"
                  onChange={(event) => setAddress(event.target.value)}
                />
              </div>
            </div>
            <div className="userUpdateRight">
              <button onClick={handleUpdate} className="userUpdateButton">Update</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
