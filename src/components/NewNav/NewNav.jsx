import {
  alpha,
  AppBar,
  Avatar,
  Badge,
  InputBase,
  makeStyles,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { Cancel, Mail, Notifications, Search } from "@material-ui/icons";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getJobs } from "../../actions/formJobs";
import { profileUser } from "../../actions/profileActions";
import { Link, useNavigate } from "react-router-dom";
// Estilos
import newNavStyles from './Styles/newNav.module.css';
import { IMG } from '../../enviroment'
import { SearchBar } from "../SearchBar/SearchBar";
import ChatWindowv2 from "../ChatWindow/ChatWindowv2";
import socket from "../socket";
import Notification from "../Messenger/Notification/Notification";
import Leftbar from "./Leftbar/Leftbar";
import { ImList } from "react-icons/im";



const NewNav = () => {
  const [open, setOpen] = useState(false);
  const [displayNotifications, setDisplayNotifications] = useState(false);
  const dispatch = useDispatch();
  const myId = useSelector((state) => state.auth.uid);
  const [notifications, setNotifications] = useState([]);
  const [unreadMessages, setUnreadMessages] = useState([]);
  const [unreadNotifications, setUnreadNotifications] = useState([]);
  const naviagte = useNavigate();
  const [mess, setMess] = useState({
    badgeContent: unreadMessages.length ? "!" : "",
    badgeColor: "transparent",
  });
  const [not, setNot] = useState({
    badgeContent: notifications.length ? "!" : "",
    badgeColor: notifications.length ? "secondary" : "transparent",
  });

  const [showLeftBar, setShowLeftBar] = useState(false);


  useEffect(() => {
    const getData = async () => {
      await dispatch(profileUser(myId, "own"));
      await dispatch(getJobs());
    };
    getData();
  }, [myId, dispatch]);

  useEffect(() => {
    socket.emit("register", myId);
    socket.on("unread-messages", (data) => {
      if (data?.length) {
        setUnreadMessages([...unreadMessages, data]);
        setMess({
          badgeContent: "!",
          badgeColor: "secondary",
        });
      }
    })
    socket.on("unread-notifications", (data) => {
      setNotifications(data);
      setNot({
        badgeContent: data.length ? "!" : "",
        badgeColor: data.length ? "secondary" : "transparent",
      });
    })
    socket.on("new-post", async (data) => {
      const res = await data;
      setNotifications([...notifications, res]);
      setNot({
        badgeContent: "!",
        badgeColor: "secondary",
      });
    });
    socket.on("response", (data) => {
      setUnreadMessages([
        ...unreadMessages,
        data.sender
      ])
      setMess({
        badgeContent: "!",
        badgeColor: "secondary",
      });
    })
    return () => {
      socket.emit("unregister", myId);
    };
  }, [myId]);


  const profile = useSelector((state) => state.profile.ownProfile)

  const profileAvatar = () => {
    //window.location.href= `/profile/${profile?.usr_id}` ? `/profile/${profile.usr_id}` : null 
    naviagte(`/profile/${profile?.usr_id}`)
  }

  const handleDisplayNotifications = (e) => {
    e.preventDefault();
    setDisplayNotifications(!displayNotifications);
    setUnreadNotifications([]);
    setNot({
      badgeContent: "",
      badgeColor: "transparent",
    });
    socket.emit("read-notifications", { myId, postId: e.target.value });
    socket.emit("unregister", myId);
    socket.emit("register", myId);
  }

  const handleUnreadMessages = (e) => {
    e.preventDefault();
    console.log("unreadmessages", unreadMessages);
    setMess({
      badgeContent: "",
      badgeColor: "transparent",
    });
  }


  const handleReadNotifications = (e) => {
    e.preventDefault();
    setUnreadNotifications([]);
    setNot({
      badgeContent: "",
      badgeColor: "transparent",
    });
    socket.emit("read-notifications", { myId, postId: e.target.value });
    socket.emit("unregister", myId);
    socket.emit("register", myId);
    setDisplayNotifications(false);
  }

  const handleLeftBar = (e) => {
    e.preventDefault();
    setShowLeftBar(!showLeftBar);
  }

  return (
    <div className={newNavStyles.divnav}>
      <AppBar className={newNavStyles.appbar}>
        <Toolbar className={newNavStyles.toolbar}>
          <div className={newNavStyles.divtitle}>
            <div className={newNavStyles.leftbaricon}>
              <Leftbar isOpen={showLeftBar} />
            </div>
            <Link className={newNavStyles.workapplogo} to="/">
              <Typography variant="h6" className={newNavStyles.logoLg}>
                Work-App
              </Typography>
            </Link>
          </div>
          <SearchBar />
          <div className={newNavStyles.rigthicons}>
            <button onClick={handleUnreadMessages}>
              <Badge badgeContent={mess.badgeContent} color={mess.badgeColor} className={newNavStyles.badge}>
                <ChatWindowv2 unreadMessages={unreadMessages} iconColor={unreadMessages.length ? "white" : "#001845"} />
              </Badge>
            </button>
            <button onClick={handleDisplayNotifications}>
              <Badge badgeContent={not.badgeContent} color={not.badgeColor} className={newNavStyles.badge}>
                <Notifications style={{ color: notifications.length ? "white" : "#001845" }} />
              </Badge>
            </button>
            <button className={newNavStyles.avatar} onClick={profileAvatar}>
              <Avatar
                alt="Full stack"
                src={profile?.usr_photo ? profile.usr_photo : IMG}
              />
            </button>
          </div>
        </Toolbar>
      </AppBar>
      {
        displayNotifications && (
          notifications?.length > 0 ? notifications.map(notif => {
            return (
              <div className={newNavStyles.notbox}>
                <Notification
                  key={notif?.id}
                  post={notif?.post}
                  jobs={notif?.jobs}
                />
                <button value={notif?.post.post_id} onClick={handleReadNotifications}>Leída</button>
              </div>
            )
          }) : <div className={newNavStyles.notbox}>Aún no tienes notificaciones</div>
        )
      }
    </div>
  );
};

export default NewNav;