import React, { useEffect, useState } from "react";
import { Grid } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useDispatch, useSelector } from "react-redux";
import { startLogout } from "../../actions/auth";
import Cards from "../Cards/Cards";
import styles from "./Home.module.css";
import { getJobs } from "../../actions/formJobs";
import { profileUser } from "../../actions/profileActions";
import { SearchBar } from "../SearchBar/SearchBar";
import Boton from '../Boton/Boton'
import FormEmpleador from "../FormEmpleador/FormEmpleador";
import Leftbar from "../NewNav/Leftbar/Leftbar";
import Feed from "../NewNav/Feed/Feed";
import Rightbar from "../NewNav/Rightbar/Rightbar";
import Add from "../NewNav/Add/Add";
import NewNav from "../NewNav/NewNav";
import Jobs from "../Jobs/Jobs";
// Components
import { LoadingScreen } from '../loadingScreen/LoadingScreen';
// import socket from "../socket";

// import { Link } from 'react-router-dom';
const useStyles = makeStyles((theme) => ({
  right: {
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },
  root: {
    display: "flex",
  }
}));




export default function Home() {
  const dispatch = useDispatch();
  const classes = useStyles();
  const [type, setType] = useState("");
  const myId = useSelector((state) => state.auth.uid);
  const loader = useSelector(state => state.ui.loading);
  const ownProfile = useSelector((state) => state.profile.ownProfile);
  const jobs = useSelector((state) => state.jobs.allJobs);
  let location = window.location.pathname;

  useEffect(() => {
    if (location === "/home") {
      setType("posts");
    } else if (location === "/jobs") {
      setType("jobs");
    }
  }, [location]);


  return (loader ? <LoadingScreen /> :
    <div className={classes.root}>
        <div>
          {
            type === "posts" && (
              <Feed />
            )
          }
          {
            type === "jobs" && (
              <div className={styles.divJobs}>
                <Jobs />
              </div>
            )
          }
        </div>
        <Grid item sm={3} className={classes.right}>
        </Grid>
      <Add />
    </div>
  );
};
