import React,{useEffect,useState} from 'react'
import SideBar from './SideBar';
import './App.css'
import Chat from './Chat';
import Pusher from 'pusher-js';
import axios from './axios';



function App() {

  const [messages,setMessages] = useState([]);

  useEffect(() => {
   axios.get("/messages/sync").then((response)=>{
     setMessages(response.data);
   });
    }, []);


  useEffect(() => {
    const pusher = new Pusher('510b1b8ab1e64e0d0d3e', {
      cluster: 'eu',
    });

    const channel = pusher.subscribe("messages");
    channel.bind("inserted", (newMessage) =>{
      alert(JSON.stringify(newMessage));
      setMessages([...messages,newMessage]);
    });

    return () =>{
      channel.unbind_all();
      channel.unsubscribe();
    };
      
  }, [messages]);
  console.log(messages)
  return (

    
    <div className="app">
     <div className="app-body">
     <SideBar/>
     <Chat messages={messages}/>
     </div>
   
    </div>
  );
}

export default App;
