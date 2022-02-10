import { Container, makeStyles, Typography, Theme } from "@material-ui/core";
import { Link } from "react-router-dom";
import {
  ExitToApp,
  Work,
  Home,
  Person,
  Face,
  ArrowUpward
} from "@material-ui/icons";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { startLogout } from "../../../actions/auth";
// Estilos
import navStyles from '../Styles/newNav.module.css';
import { useEffect } from "react";
import { ImList } from "react-icons/im";

const useStyles = makeStyles((theme) => ({
  container: {
    position: "fixed",
    top: "65px",
    left: "0",
    zIndex: 3,
    height: "100vh",
    width: "12em",
    color: "white",
    paddingTop: theme.spacing(10),
    backgroundColor: theme.palette.primary.main,
    [theme.breakpoints.up("sm")]: {
      backgroundColor: "white",
      color: "#555",
      border: "1px solid #ece7e7",
    },
  },
  item: {
    display: "flex",
    alignItems: "center",
    marginBottom: theme.spacing(4),
    [theme.breakpoints.up("sm")]: {
      marginBottom: theme.spacing(3),
      cursor: "pointer",
    },
  },
  icon: {
    marginRight: theme.spacing(1),
    [theme.breakpoints.up("sm")]: {
      fontSize: "18px",
    },
  },
  parr: {
    fontWeight: 500,
    marginLeft: "29px",
    marginTop: "-23px",
  },
  text: {
    fontWeight: 500,
  },
  link: {
    width: "100%",
    textDecoration: "none",
  },
  showleft: {
    cursor: "pointer",
    width: "100%",
    height: "100%",
    "&:hover": {
      color: "#555",
    },
  },
}));

const Leftbar = () => {
  const { uid } = useSelector((state) => state.auth)
  const [open, setOpen] = useState(false);

  const classes = useStyles();

  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(startLogout());
  };

  const handleOpen = (e) => {
    e.preventDefault();
    setOpen(!open);
  }

  return (
    <div>
      <div className={classes.showleft} onClick={handleOpen}>
        <ImList />
      </div>
      <Container style={{ padding: '0', paddingTop: '1vw', backgroundColor: '#fff', display: open ? "block" : "none" }} className={classes.container}>
        <div className={navStyles.item} onClick={handleOpen}>
          <Link to="/home" style={{textDecoration: "none"}}  className={classes.link}>
              <Home className={classes.icon} />
              <Typography className={classes.text}><p className={classes.parr}>Home</p>
              </Typography>
          </Link>
        </div>
        <div className={navStyles.item} onClick={handleOpen}>
          <Link style={{textDecoration: "none"}} className={classes.link} to="/jobs">
            <Work className={classes.icon} />
            <Typography className={classes.text}><p className={classes.parr}>Buscar Trabajador</p>
            </Typography>
          </Link>
        </div>
        <div className={navStyles.item} onClick={handleOpen}>
          <Link style={{textDecoration: "none"}} className={classes.link} to={`/profile/${uid}`}>
            <Person className={classes.icon} />
            <Typography className={classes.text}><p className={classes.parr}>Perfil</p>
            </Typography>
          </Link>
        </div>
        <div className={navStyles.item} onClick={handleOpen}>
          <Link style={{textDecoration: "none"}} className={classes.link} to="/about">
            <Face className={classes.icon} />
            <Typography className={classes.text}><p className={classes.parr}>Nosotros</p>
            </Typography>
          </Link>
        </div>
        <div className={navStyles.item} onClick={handleOpen}>
          <Link style={{textDecoration: "none"}} className={classes.link} to={`/upgradePlan`}>
            <ArrowUpward className={classes.icon} />
            <Typography className={classes.text}><p className={classes.parr}>Mejorar Plan</p>
            </Typography>
          </Link>
        </div>
        <div className={navStyles.item}>
          <ExitToApp className={classes.icon} />
          <Typography className={classes.text} onClick={handleLogout}>Cerrar sesión</Typography>
        </div>
      </Container>
    </div>
  );
};

export default Leftbar;