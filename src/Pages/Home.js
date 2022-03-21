import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
const Home = () => {
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState("");
  const [userName, setUserName] = useState("");
  const createNewRoom = (e) => {
    e.preventDefault();
    const id = uuidv4();
    setRoomId(id);
    toast.success("Created a new room");
  };
  const joinRoom = () => {
    if (!roomId || !userName) {
      toast.error("Room Id and Username is required");
      return;
    }
    // navigator is can be used in place of history hook we can also pass some data int object from to the next route

    navigate(`/editor/${roomId}`, {
      state: {
        userName,
      },
    });
  };
  const handleInputEnter = (e) => {
    if (e.code === "Enter") {
      joinRoom();
    }
  };
  return (
    <div className="homePageWrapper">
      <div className="formWrapper">
        <img className="homePageLogo" src="./logo.png" alt="codeLogo" />
        <h4 className="mainLabel">Paste Invitation Room Id</h4>
        <div className="inputGroup">
          <input
            type="text"
            className="inputBox"
            placeholder="roomId"
            onChange={(e) => setRoomId(e.target.value)}
            onKeyUp={handleInputEnter}
            value={roomId}
          />
          <input
            type="text"
            className="inputBox"
            placeholder="username"
            onChange={(e) => setUserName(e.target.value)}
            onKeyUp={handleInputEnter}
            value={userName}
          />
          <button className="btn joinBtn" onClick={joinRoom}>
            Join
          </button>
          <span className="createInfo">
            If you don't have invite the create &nbsp;
            <a href="" className="createNewBtn" onClick={createNewRoom}>
              new room
            </a>
          </span>
        </div>
      </div>
      <footer>
        <h4>Built with 🤦🏽‍♂️ by Abhishek </h4>
      </footer>
    </div>
  );
};

export default Home;
