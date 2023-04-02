import React, {useState} from "react"
import './App.css';
import { io } from 'socket.io-client';
import Home from './pages/home'
import Room from './pages/room'
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate
} from "react-router-dom"

const socket = io("https://chat-backend-w1tg.onrender.com/");
//const socket = io("http://localhost:8000")
// // socket.on("connect", ()=>{
// //   console.log("Connection Established",);
// // })
// socket.emit("create", "testRoom1");
function App() {
  const [room, setRoom] = useState(null); 
  const [username, setUsername] = useState(null);
  let gotUser = (user) => {
    setUsername(user);
  }
  return (
    <div>
      <Router>
        <Routes>
          <Route path='/room/:roomid' element={(room)?(<Room username={username} socket={socket}/>):(<Navigate to={'/'}></Navigate>)}></Route>
          <Route path='/' element={(room)?(<Navigate to={'/room/'+room}></Navigate>):(<Home gotUser={gotUser} socket={socket} setRoom={setRoom}/>)} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
