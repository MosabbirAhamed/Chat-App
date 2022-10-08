import React, { useEffect, useState, useRef } from 'react'
import { db, timestamp } from '../utils/firebase'
import useStorage from "../hooks/useStorage"
import Avatar from '@mui/material/Avatar';
import { RiSendPlaneFill } from 'react-icons/ri';
import { MdOutlineAddPhotoAlternate, MdCancel } from 'react-icons/md';
import Picker from 'emoji-picker-react';
import { TailSpin } from 'react-loader-spinner'

const Chat = ({ user }) => {

    const { upload, loading, url, getPreview } = useStorage('images/')
    const [message, setMessage] = useState('')
    const [messages, setMessages] = useState([])
    const [pickEmoji, setPickEmoji] = useState(false);
    const [image, setImage] = useState(null)
    const endOfMessage = useRef(null)
    const searchInput = useRef(null);

    const scrollToBottom = () => {
        if (!endOfMessage.current) return
        endOfMessage.current.scrollIntoView({ behavior: 'smooth' })
    }

    const onEmojiClick = (e, emojiObject) => {
        setMessage(message + emojiObject.emoji)
    };

    useEffect(() => {
        const listener = document.body.addEventListener("click", (e) => {
            setPickEmoji(false)
        })
        return () => {
            document.body.removeEventListener("click", listener)
        }
    }, []);


    function handleFocus() {
        searchInput.current.focus()
    }


    useEffect(() => {
        const unsub = db.collection("chats")
            .orderBy("timestamp", "desc")
            .limit(30)
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
                {chat?.attachment && <img className="w-full rounded-md" src={chat?.attachment} alt={chat?.name} />}
                <p className="text-right pt-1 text-[#292929]">{chat?.text}</p>

            </div>
        )

        return (
            <div key={chat?.id} className={`flex bg-indigo-200 text-gray-900 max-w-[80%] w-fit rounded px-2 py-1 mb-2`}>
                <Avatar className=" !w-10 !h-10" alt={chat?.name} src={chat?.image} />
                <div className="flex-1 pl-2">
                    {chat?.attachment ? (
                        <div className="text-indigo-600 font-semibold text-sm text-left pb-3 mt-1">{chat.name}</div>
                    ) : (
                        <div className="text-indigo-600 font-semibold text-sm text-left mt-1">{chat.name}</div>
                    )}

                    {chat?.attachment && <img className="w-full rounded-md" src={chat?.attachment} alt={chat?.name} />}
                    <p className="text-right text-[#292929] pt-1">{chat?.text}</p>

                </div>
            </div>
        )
    }


    const sendMessage = (e) => {
        e.preventDefault();
        if (image) return sendPicture()
        if (message) saveOnFirebase()
        handleFocus()
    }

    const saveOnFirebase = (attachment = null) => {
        const data = {
            text: message?.trim(),
            image: user?.photoURL,
            name: user?.displayName,
            email: user?.email,
            attachment,
            timestamp: timestamp,
        }
        db.collection("chats").add(data)
        setMessage("")

    }

    const sendPicture = () => {
        if (!image) return
        upload(image)
    }

    useEffect(() => {
        if (url) {
            setImage(null)
            saveOnFirebase(url)
        }
    }, [url])

    const handleChange = (e) => {
        setImage(e.target.files[0])
    }

    return (
        <div className="md:h-[85vh] relative h-[80vh] bg-gray-100 flex-grow rounded-md flex flex-col">
            <div className="flex-grow flex flex-col-reverse overflow-y-auto max-h-full p-2">
                <div ref={endOfMessage}></div>
                {messages?.map(chat => recderChat(chat))}
            </div>

            {image && (
                <div className="bg-white rounded-md shadow-xl absolute left-0 bottom-14 overflow-hidden h-72 z-40 w-full">

                    {loading && <div className=" flex items-center justify-center bg-opacity-60 absolute z-50 self-center w-full h-full bg-slate-500">
                        <TailSpin
                            height="80"
                            width="80"
                            color="white"
                        />
                    </div>}
                    <span onClick={() => setImage(null)} className="absolute top-2 right-2 cursor-pointer  text-indigo-700 text-2xl rounded-md"> <MdCancel /></span>
                    <img className="h-full w-full object-cover" src={getPreview(image)} alt="Preview" />
                </div>
            )}


            <div className="h-16 bg-fuchsia-300 relative bg-opacity-20 pt-3">
                {loading && loading}
                {pickEmoji && (
                    <div
                        onClick={e => { e.preventDefault(); e.stopPropagation() }}
                        className="absolute w-fit bottom-20 z-50">
                        <Picker onEmojiClick={onEmojiClick} />
                    </div>
                )}

                <div className="flex items-center justify-between gap-2">
                    <label htmlFor="image" className="cursor-pointer ml-1 flex items-center justify-between text-indigo-700 p-2  text-2xl rounded-md bg-indigo-600 hover:bg-indigo-700  bg-opacity-10 hover:bg-opacity-20">
                        <input
                            id='image'
                            accept='image/*'
                            type="file"
                            className="w-0 h-0"
                            onChange={handleChange}
                        />
                        <MdOutlineAddPhotoAlternate />
                    </label>

                    <button
                        title="Send Emoji"
                        onClick={e => { setPickEmoji(true); e.preventDefault(); e.stopPropagation() }}
                        className="flex items-center justify-center text-indigo-700 font-semibold p-2 border border-transparent text-sm  rounded-md  bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 bg-opacity-10 hover:bg-opacity-20">
                        🙂
                    </button>

                    <form onSubmit={sendMessage} className="flex justify-between items-center flex-1">



                        <input
                            readOnly={loading}
                            type="text"
                            className=" bg-gray-50 appearance-none border border-gray-400 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                            value={message}
                            onChange={e => setMessage(e.target.value)}
                            placeholder="Type a Message"
                            ref={searchInput}
                        />
                        <button
                            disabled={loading}
                            type="submit"
                            className="ml-3 flex items-center justify-between text-indigo-700 p-2  text-2xl rounded-md bg-indigo-600 hover:bg-indigo-700  bg-opacity-10 hover:bg-opacity-20"
                        >
                            <RiSendPlaneFill />
                        </button>
                    </form>
                </div>


            </div>
        </div>
    )
}

export default Chat