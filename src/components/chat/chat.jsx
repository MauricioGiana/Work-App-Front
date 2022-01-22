import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { profileUser } from "../../actions/profileActions";
import "./chat.css";
import axios from "axios";
import socket from "../socket";
import { getProfile } from "../../controllers";



export default function Chat({receiverId}) {
    const [messages, setMessages] = useState([]);
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth);
    const senderUserId = user.uid;
    const [chat, setChat] = useState({
        sender: user.uid,
        receiver: receiverId,
        message: "",
    });
    const [userReceiver, setUserReceiver] = useState({});
    const [displayChat, setDisplayChat] = useState(false);

    useEffect(() => {
        const getUserReceiver = async () => {
            const data = await getProfile(receiverId);
            console.log("userReceiver", data);
            setUserReceiver(data);
        }
        getUserReceiver();
    }, [receiverId]);

    useEffect(() => {
        socket.emit("register", senderUserId);
        socket.emit("chat-history", { userId1: senderUserId, userId2: receiverId });
        socket.on("chat-history", async (data) => {
            const chatHistory = await data;
            console.log("chatHistory", chatHistory);
            setMessages(chatHistory);
        });
        socket.on("response", (data) => {
            console.log("response: ", data);
            setMessages(messages => [...messages, data]);
            setChat({
                ...chat,
                receiver: data.sender,
            })
        });
    }, [receiverId]);

    const divRef = useRef(null)

    useEffect(() => {
        divRef.current.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleChange = (e) => {
        setChat({
            ...chat,
            message: e.target.value,
        });
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setMessages(messages => [...messages, chat]);
        socket.emit("message", chat);
    }

    const handleSaveChat = (e) => {
        e.preventDefault();
        socket.emit("save-chat", "save");
        console.log("save chat", chat);
    }

    return (
        <div className="chat-container">
            <div className="chat-window">
                <div className="chat-header">
                    <p>{userReceiver.usr_username}</p>
                </div>
                <div>
                    <input type="button" value="x" onClick={handleSaveChat}/>
                </div>
                <div className="chat-output">
                    {
                        messages?.map((m, i) => {
                            return (
                                <div key={i} className={m.sender === user.uid ? "chat-message" : "chat-message-response"}>
                                    <p className="message-body">{m.message}</p>
                                </div>
                            )
                        })
                    }
                    <div ref={divRef}></div>
                </div>
                <div className="chat-actions">

                </div>
            </div>
            <form >
                <p className="inputdata">{user.name}</p>
                <input className="inputdata" type="text" placeholder="Message" name="message" value={chat.message} onChange={handleChange} />
                <button className="send" onClick={handleSubmit}>Send</button>
            </form>
        </div>
    )
}