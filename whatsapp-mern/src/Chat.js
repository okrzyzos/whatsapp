import { Avatar, IconButton } from '@material-ui/core';
import React,{useState} from 'react';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import SearchOutlinedIcon from '@material-ui/icons/SearchOutlined';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import MicIcon from '@material-ui/icons/Mic';
import AttachFile from '@material-ui/icons/AttachFile';
import './Chat.css'
import axios from './axios'


const Chat = ({messages}) => {

    const [input,setInput] = useState("");

    const sendMessage = async (e) =>{
        e.preventDefault();

       await  axios.post("/messages/new" ,{
message:input,
name : "olivier",
timestamp:"just now",
received : false,

        });
        setInput("");
        
    }
    return (
        <div className="chat">
            <div className="chat__header">
                <Avatar />
                <div className="chat__headerInfo">
                    <h3>Room name</h3>
                    <p>last seen at ...</p>
                </div>

                <div className="chat__headerRight">
                    <IconButton>
                        <SearchOutlinedIcon />
                    </IconButton>
                    <IconButton>
                        <AttachFile />
                    </IconButton>
                    <IconButton>
                        <MoreVertIcon />
                    </IconButton>

                </div>
            </div>
            <div className="chat__body">
            {messages.map(message=>{
                return (

                    <p  key={message.id} className={`chat__message ${message.received && 'chat__reciever'}`}>
                    <span className="chat__name">{message.name}</span>
            {message.message}
            <span className="chat__timestamp">{message.timestamp}</span>
            </p>
                )
               

            })}
               
                

            </div>
            <div className="chat__footer">
                <InsertEmoticonIcon />
                <form>
                    <input onChange={(e)=>setInput(e.target.value)} value={input} type="text"
                        placeholder="Type a message" />
                    <button 
                    onClick={sendMessage}
                        type="submit">
                        Send a message
                        </button>
                </form>
                <MicIcon/>
            </div>
        </div>
    );
};

export default Chat;