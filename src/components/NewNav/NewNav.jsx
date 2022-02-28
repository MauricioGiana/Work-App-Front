import React, {useState, useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate} from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { makeStyles } from '@mui/styles';
import Badge from '@mui/material/Badge';
import MailIcon from '@mui/icons-material/Mail';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { profileUser} from '../../actions/profileActions';
import { getJobs } from '../../actions/formJobs';
import socket from '../socket';
import ChatWindowv2 from '../ChatWindow/ChatWindowv2';
import { startLogout } from "../../actions/auth";

const useStyles = makeStyles((theme) => ({

}));

const pages = ['Posteos', 'Buscar trabajador', 'WorkPremium', "Nosotros"];
const settings = ['Perfil', 'Cerrar sesión'];

const NewNav = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const [open, setOpen] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [displayNotifications, setDisplayNotifications] = useState(false);
  const myId = useSelector((state) => state.auth.uid);
  const [notifications, setNotifications] = useState([]);
  const [unreadMessages, setUnreadMessages] = useState([]);
  const [unreadNotifications, setUnreadNotifications] = useState([]);
  const naviagte = useNavigate();
  const [mess, setMess] = useState({
    badgeContent: unreadMessages?.length,
  });
  const [not, setNot] = useState({
    badgeContent: notifications.length ? "!" : 0,
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
          badgeContent: unreadMessages.length ? "!" : 0,
        });
      }
    })
    socket.on("unread-notifications", (data) => {
      setNotifications(data);
      setNot({
        badgeContent: data.length ? "!" : 0,
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

  const goProfile = () => {
    setAnchorElUser(null);
    naviagte(`/profile/${profile?.usr_id}`)
  }

  const handleNavigate = (e, page) => {
    setAnchorElNav(null);
    console.log("page", page);
    let pathName = "";
    if (page === "Posteos") {
      naviagte("/home");
    } else if (page === "Buscar trabajador") {
      naviagte("/jobs");
    } else if (page === "WorkPremium") {
      naviagte("/upgradePlan");
    } else if (page === "Nosotros") {
      naviagte("/about");
    } else naviagte("/");
  }

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

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

  const handleShowChat = (e) => {
    e.preventDefault();
    setShowChat(!showChat);
  }

  const handleLogout = () => {
    setAnchorElUser(null);
    dispatch(startLogout());
  };

  return (
    <AppBar position="sticky">
      <Container maxWidth="xl">
        <Toolbar >
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ mr: 2, display: { xs: 'none', md: 'flex' } }}
          >
            WorkApp
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={e => handleNavigate(e, page)}>
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}
          >
            LOGO
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button
                key={page}
                onClick={e => handleNavigate(e, page)}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                {page}
              </Button>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <IconButton size="large" aria-label="show messages" color="inherit" onClick={handleShowChat}>
              <Badge badgeContent={mess.badgeContent} color="error">
                <MailIcon />
              </Badge>
            </IconButton>
            <ChatWindowv2 show={showChat} handleShowChat={handleShowChat} unreadMessages={unreadMessages} />
            <IconButton
              size="large"
              aria-label="show 17 new notifications"
              color="inherit"
            >
              <Badge badgeContent={not.badgeContent} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }} style={{ marginLeft: "1rem" }}>
              <Avatar alt="avatar" src="/static/images/avatar/2.jpg" />
            </IconButton>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
                <MenuItem onClick={goProfile}>
                  <Typography textAlign="center">Perfil</Typography>
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <Typography textAlign="center">Cerrar sesión</Typography>
                </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default NewNav;
