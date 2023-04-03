import {
  CalendarToday,
  LocationSearching,
  MailOutline,
  PermIdentity,
  PhoneAndroid,
  Publish,
} from "@material-ui/icons";
import "./user.css";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import Announcement from "../components/Announcement";
import { userRequest } from "../requestMethods";
import { useDispatch } from "react-redux";
import axios from "axios"


export default function User() {
  const location = useLocation();
  const id = location.pathname.split("/")[2];
  const [user, setUser] = useState({});
  const [image, setImage] = useState("");
  const dispatch = useDispatch();
  const created = user?.createdAt?.slice(0, 10) ?? '';

  const getUser = async () => {
    try {
      const res = await userRequest.get("/users/find/" + id);
      setUser(res.data);
    } catch { }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("image", image);
      const res = await axios.post(`http://localhost:5000/api/upload/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUser();
  }, [id]);

  return (
    <div><Navbar />
      <Announcement />
      <div className="user">
        <div className="userTitleContainer">
          <h1 className="userTitle">Account Details</h1>
        </div>
        <div className="userContainer">
          <div className="userShow">
            <div className="userShowTop">
              <img
                src={user.image || "https://crowd-literature.eu/wp-content/uploads/2015/01/no-avatar.gif"}
                alt=""
                className="userShowImg"
              />
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
                <span className="userShowInfoTitle">{created}</span>
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
            <form className="userUpdateForm">
              <div className="userUpdateLeft">
                <span className="userUpdateTitle">Account Details</span>
                <div className="userUpdateItem">
                  <label>Name</label>
                  <input
                    type="text"
                    placeholder={user.name}
                    className="userUpdateInput"
                  />
                </div>
                <div className="userUpdateItem">
                  <label>Email</label>
                  <input
                    type="text"
                    placeholder={user.email}
                    className="userUpdateInput"
                  />
                </div>
                <div className="userUpdateItem">
                  <label>Phone</label>
                  <input
                    type="text"
                    placeholder={user.phone}
                    className="userUpdateInput"
                  />
                </div>
                <div className="userUpdateItem">
                  <label>Address</label>
                  <input
                    type="text"
                    placeholder={user.address}
                    className="userUpdateInput"
                  />
                </div>
              </div>
            </form>
            <div className="userUpdateRight">
              <div className="userUpdateUpload">
                <img
                  className="userUpdateImg"
                  src={user.image || "https://crowd-literature.eu/wp-content/uploads/2015/01/no-avatar.gif"}
                  alt=""
                />
                <label htmlFor="file">
                  <Publish className="userUpdateIcon" />
                </label>
                <form onSubmit={handleSubmit}>
                  <input
                    type="file"
                    id="file"
                    style={{ display: "none" }}
                    onChange={(e) => setImage(e.target.files[0])} />
                  <button type="submit" class="btn">Submit</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
