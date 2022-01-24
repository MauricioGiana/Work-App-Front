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
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Messenger from "../Messenger/Messenger";
import socket from "../socket";

const useStyles = makeStyles((theme) => ({
  toolbar: {
    display: "flex",
    justifyContent: "space-between",
  },
  logoLg: {
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "block",
    },
  },
  logoSm: {
    display: "block",
    [theme.breakpoints.up("sm")]: {
      display: "none",
    },
  },
  search: {
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    borderRadius: theme.shape.borderRadius,
    width: "50%",
    [theme.breakpoints.down("sm")]: {
      display: (props) => (props.open ? "flex" : "none"),
      width: "70%",
    },
  },
  input: {
    color: "white",
    marginLeft: theme.spacing(1),
  },
  cancel: {
    [theme.breakpoints.up("sm")]: {
      display: "none",
    },
  },
  searchButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up("sm")]: {
      display: "none",
    },
  },
  icons: {
    cursor: "pointer",
    alignItems: "center",
    display: (props) => (props.open ? "none" : "flex"),
  },
  badge: {
    marginRight: theme.spacing(4),
  },
}));

const NewNav = () => {
  const myId = useSelector((state) => state.auth.uid);
  const [open, setOpen] = useState(false);
  const classes = useStyles({ open });
  const [displayInBox, setDisplayInBox] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    socket.emit("data", myId);
    socket.on("data", async (data) => {
      const newData = await data;
      setData(newData);
    })
    socket.on("message", (data) => {
      socket.emit("data", myId);
    });
  }, [myId]);

  const handleDisplayInBox = (e) => {
    e.preventDefault();
    setDisplayInBox(!displayInBox);
  };

  return (
    <div >
      <AppBar style={{ position: "sticky", top: 0 }}>
        <Toolbar className={classes.toolbar}>
          <Link to="/">
            <Typography variant="h6" className={classes.logoLg}>
              Working App
            </Typography>
          </Link>
          <Typography variant="h6" className={classes.logoSm}>
            WORKING
          </Typography>
          <div className={classes.search}>
            <Search />
            <InputBase placeholder="Search..." className={classes.input} />
            <Cancel className={classes.cancel} onClick={() => setOpen(false)} />
          </div>
          <div className={classes.icons}>
            <Search
              className={classes.searchButton}
              onClick={() => setOpen(true)}
            />
            <Badge badgeContent={4} color="secondary" className={classes.badge}>
              <button onClick={handleDisplayInBox}>
                <Mail />
              </button>
            </Badge>
            <Badge badgeContent={2} color="secondary" className={classes.badge}>
              <Notifications />
            </Badge>
            <Avatar
              alt="Full stack"
              src="https://firebasestorage.googleapis.com/v0/b/react-eccomerce-979a7.appspot.com/o/Categorias%2FDragonBall.jpg?alt=media&token=8b489b89-0177-4a73-bd52-8b1afb4ba6b3"
            />
          </div>
        </Toolbar>
      </AppBar>
      {
        displayInBox && (
          <div>
            <Messenger data={data} />
          </div>
        )
      }
    </div>
  );
};

export default NewNav;