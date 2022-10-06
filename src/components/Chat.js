import React, { useEffect, useState, useRef } from 'react'
import { db, timestamp } from '../utils/firebase'
import Avatar from '@mui/material/Avatar';
import { RiSendPlaneFill } from 'react-icons/ri';

const Chat = ({ user }) => {

    const [message, setMessage] = useState('')
    const [messages, setMessages] = useState([])
    const endOfMessage = useRef(null)

    const scrollToBottom = () => {
        if (!endOfMessage.current) return
        endOfMessage.current.scrollIntoView({ behavior: 'smooth' })
    }


    useEffect(() => {
        const unsub = db.collection("chats")
            .orderBy("timestamp", "desc")
            .limit(15)
            .onSnapshot(snapshot => {
                setMessages(
                    snapshot.docs.map(doc => ({
                        ...doc.data(),
                        id: doc.id
                    }))
                );
                scrollToBottom()
            })
        return () => {
            unsub()
        }
    }, []);

    const recderChat = (chat) => {
        const byMe = chat?.email === user?.email
        if (byMe) return (
            <div key={chat?.id} className={` bg-[#c2f2d0] text-black max-w-[80%] w-fit rounded p-2 mb-2 self-end`}>
                {chat?.text}
            </div>
        )

        return (
            <div key={chat?.id} className={`flex bg-indigo-200 text-gray-900 max-w-[80%] w-fit rounded px-2 py-1 mb-2`}>
                <Avatar className=" !w-10 !h-10" alt={chat?.name} src={chat?.image} />
                <div className="flex-1 pl-2">
                    {chat?.text}
                    <div className="text-indigo-600 font-semibold text-sm text-right mt-1">{chat.name}</div>

                </div>
            </div>
        )
    }


    const sendMessage = (e) => {
        if (!message) return
        e.preventDefault();
        const data = {
            text: message,
            image: user?.photoURL,
            name: user?.displayName,
            email: user?.email,
            timestamp: timestamp,
        }
        db.collection("chats").add(data)
        setMessage("")
    }

    return (
        <div className="h-[85vh]  bg-gray-100 flex-grow rounded-md flex flex-col">
            <div className="flex-grow flex flex-col-reverse overflow-y-auto max-h-full p-2">
                <div ref={endOfMessage}></div>
                {messages?.map(chat => recderChat(chat))}
            </div>


            <div className="h-16  bg-fuchsia-300 bg-opacity-20 pt-3">
                <div className="flex justify-between items-center">
                    <input
                        type="text"
                        className=" bg-gray-50 appearance-none border border-gray-400 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                        placeholder="Type a Message"
                    />
                    <button
                        onClick={sendMessage}
                        className="ml-3 flex items-center justify-between text-indigo-700 p-2  text-2xl rounded-md bg-indigo-600 hover:bg-indigo-700  bg-opacity-10 hover:bg-opacity-20"
                    >
                        <RiSendPlaneFill />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Chat