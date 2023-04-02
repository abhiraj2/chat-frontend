import React, { useEffect, useRef, useState } from 'react'
import {TextField} from '@mui/material'
import { ArrowCircleRight } from '@mui/icons-material'
import MessageHolder from "./message"
import "./room.css"
//import { io } from 'socket.io-client'
import { Message } from './constructors'
import { useParams } from "react-router-dom";

//const serverURL = 'https://chat-backend-w1tg.onrender.com/'
const serverURL = "http://localhost:8000/";

export default (props)=>{
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([])
    const [message, setMessage] = useState('')
    const [rec, setRec] = useState(true);
    const sendButt = useRef(null)
    const socket = props.socket
    let {roomid} = useParams()

    const fetchUser = ()=>{
        fetch(serverURL + 'getUser/' + roomid)
            .then((res)=> {console.log(res); return res.json()})
            .then((res)=>{
                if(res.status == 200){
                    setUsers(res.users)
                }
            })
    }
    
    const fetchMessages = () => {
        console.log("New Message")
        fetch(serverURL+'getMessages/' + roomid)
            .then(res=>res.json())
            .then(res=>{console.log(res); setMessages(res.messages.slice())})
    }

    socket.on('newMsg', fetchMessages);
    socket.on('newUser', fetchUser);
    socket.on('userLeft', fetchUser);

    socket.on('received', ()=>{
        setRec(true);
    })
    
    useEffect(fetchUser,[])
    useEffect(fetchMessages,[])
    const handleSend = (ev) => {
        {
            let msg = new Message(props.username, message, roomid, new Date());
            socket.emit("sendMsg", msg);
            setMessage('')
        }
        
    }

    return(
        <div className='room'>
            <div className='infoArea' style={{textAlign: "left", backgroundColor: "#7ed6df"}}>
                <div id='infoText'>User List</div>
                <div className='userList'>{users.map((ele, idx)=><div style={{width:"50%"}} key={ele}>{ele}</div>)}</div>
            </div>
            <div className='chatArea' style={{backgroundColor: "#c7ecee"}}>
                <div className='messageGroup' style={{width:"100%", marginBottom:"20px"}}>
                    <div className='messagesArea'>
                        {messages.map((ele, idx)=><MessageHolder key={idx} username={ele.username} message={ele.message} timestamp={ele.timestamp}></MessageHolder>)}
                    </div>
                    <div className='messageBox' style={{width:"100%"}}>
                        <TextField onKeyPress={(ev)=>{
                            if(ev.key == 'Enter'){   
                                sendButt.current.dispatchEvent(
                                    new MouseEvent('click', {
                                      view: window,
                                      bubbles: true,
                                      cancelable: true,
                                      buttons: 1,
                                    }),
                                );
                            }
                        }} onChange={(ev => setMessage(ev.target.value))} value={message} variant='filled' label={"Message"} sx={{width:"70%"}}> </TextField>
                        <ArrowCircleRight ref={sendButt} id = 'sendButton' sx={{fontSize:"3.5em", color:"#686de0"}} onClick={(rec)?handleSend:()=>{console.log("Disabled")}}></ArrowCircleRight>
                    </div>
                </div>
            </div>
        </div>
    )
}