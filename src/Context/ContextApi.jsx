import { useEffect, useState } from "react";
import shopContext from "./ShopContext";
import io from "socket.io-client";
import useConversation from "../zustand/userConversation";

export default function ContextApi(props) {

  const HOST = "https://visual-vault-backend.onrender.com"
  // const HOST = "http://localhost:4000";

  const [isOpen, setIsOpen] = useState(false);
  const handle_toggle = () => setIsOpen(!isOpen);

  const [showModal,setShowModal] = useState(false)  // show/hide modal for images

  function formatDate(dateString) {
    const options = { day: '2-digit', month: 'short', year: 'numeric' };
    const formattedDate = new Date(dateString).toLocaleDateString('en-US', options);
    const [day, month, year] = formattedDate.split(' ');
    return `${day} ${month} ${year}`;
  }

  const [userInfo, setUserInfo] = useState([]);
  const getUser = async () => {
    try {
      setProgress(10)
      const response = await fetch(`${HOST}/api/auth/getuser`, {
        method: "GET",
        headers: { "auth-token": localStorage.getItem("auth-token") }
      });
      const data = await response.json();
      setUserInfo(data);
    } catch (error) {
      console.error("Internal server error");
    }finally{
      setProgress(100)
    }
  };

  useEffect(()=>{
    getUser()
  },[])

  const [allUsers, setAllUsers] = useState([]);
  const [userLoading, setUserLoading] = useState(false);
  const getAllUsers = async () => {
    setUserLoading(true);
    try {
      const response = await fetch(`${HOST}/api/auth/allusers`, {
        method: "GET",
        headers: { "auth-token": localStorage.getItem("auth-token") }
      });
      const data = await response.json();
      setAllUsers(data);
    } catch (error) {
      console.error("Internal server error");
    } finally {
      setUserLoading(false);
    }
  };

  const [imageLoading, setImageLoading] = useState(false);
  const [imageData, setImageData] = useState([]);
  const all_images = async () => {
    try {
      setProgress(10);
      setImageLoading(true);
      const response = await fetch(`${HOST}/api/image/getallimages`, {
        method: "GET",
        headers: { "auth-token": localStorage.getItem("auth-token") }
      });
      setProgress(50);
      const data = await response.json();
      setImageData(data);
    } catch (error) {
      console.error("Internal server error");
    } finally {
      setProgress(100);
      setImageLoading(false);
    }
  };

  const favorite_images = async () => {
    try {
      setProgress(10);
      setImageLoading(true);
      const response = await fetch(`${HOST}/api/image/getfavoriteimage`, {
        method: "GET",
        headers: { "auth-token": localStorage.getItem("auth-token") }
      });
      setProgress(50);
      const data = await response.json();
      setImageData(data);
    } catch (error) {
      console.error("Internal server error");
    } finally {
      setProgress(100);
      setImageLoading(false);
    }
  };

  const [progress, setProgress] = useState(0);

  

  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    if (userInfo && userInfo._id) {
      const newSocket = io(HOST, {
        query: { userId: userInfo._id },
        transports: ['websocket', 'polling'],
      });

      newSocket.on('connect', () => {
        console.log('WebSocket connected');
      });

      newSocket.on('error', (error) => {
        console.error('WebSocket Error:', error.message);
      });

      newSocket.on("connect_error", (error) => {
        console.error("Connection Error:", error);
        console.error("Connection error");
      });

      newSocket.on('disconnect', (reason) => {
        console.log('WebSocket disconnected:', reason);
        if (reason === 'io server disconnect') {
          newSocket.connect();
        }
      });

      newSocket.on("getOnlineUsers", (users) => {
        setOnlineUsers(users);
      });

      setSocket(newSocket);

      return () => {
        newSocket.close();
        setSocket(null);
      };
    }
  }, [userInfo]);

  const { setMessages, selectedConversation } = useConversation();
  const [msgLoading, setMsgLoading] = useState(false);
  const getMessages = async () => {
    setMsgLoading(true);
    try {
      const response = await fetch(`${HOST}/api/messages/${selectedConversation._id}`, {
        method: "GET",
        headers: { "auth-token": localStorage.getItem("auth-token") }
      });
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error("Internal server error");
    } finally {
      setMsgLoading(false);
    }
  };

  const markMessagesAsSeen = async (id) => {
    try {
      await fetch(`${HOST}/api/messages/markseen/${id}`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'auth-token': localStorage.getItem("auth-token")
        }
      });
    } catch (error) {
      console.error("Failed to mark messages as seen:", error);
    }
  };

  useEffect(() => {
    if (selectedConversation) {
      markMessagesAsSeen(selectedConversation._id);
    }
  }, [selectedConversation]);

  return (
    <shopContext.Provider value={{
      handle_toggle,
      isOpen,
      setIsOpen,
      getUser,
      userInfo,
      allUsers,
      imageData,
      all_images,
      setImageData,
      formatDate,
      favorite_images,
      progress,
      setProgress,
      HOST,
      getAllUsers,
      socket,
      onlineUsers,
      getMessages,
      userLoading,
      imageLoading,
      msgLoading,
      markMessagesAsSeen,
      showModal,
      setShowModal
    }}>
      {props.children}
    </shopContext.Provider>
  );
}
