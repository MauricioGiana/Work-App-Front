import {
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  makeStyles,
  Typography,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPostDetail, getProfile } from "../../controllers";
import "./detalle.css"
import Chat from "../chat/chat";
// React-Redux
import { useSelector, useDispatch } from 'react-redux';
// Components
import { LoadingScreen } from '../loadingScreen/LoadingScreen';
// Actions
import { finishLoading, startLoading } from '../../actions/ui'; // ui.loading
import ChatMessages from "../ChatWindow/ChatMessages";
import { IMG } from "../../enviroment";
import ChatWindowv2 from "../ChatWindow/ChatWindowv2";
import Leftbar from "../NewNav/Leftbar/Leftbar"

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "100vw",
    height: "100vh",
  },
  card: {
    width: "45vw",
    height: "80vh",
    boxShadow: "0 1rem 1rem rgba(0, 0, 0, 0.2)",
  },
  font: {
    fontFamily: "'Poppins', sans-serif",
    fontWeight: "600",
    padding: "15px",
    color: "gray",
  },
  fontTitle: {
    fontFamily: "'Poppins', sans-serif",
    fontWeight: "600",
    padding: "15px",
    color: "#d74949",
  },
  fontDesc: {
    fontFamily: "'Poppins', sans-serif",
    fontWeight: "400",
    color: "gray",
    marginBottom: "15px",
  },
  fontStatus: {
    fontFamily: "'Poppins', sans-serif",
    fontWeight: "600",
    color: "#d74949",
  },
  media: {
    maxHeight: "100%",
    maxWidth: "24%",
    border: "1.5px solid #d74949",
    borderRadius: "0.5vw",
    [theme.breakpoints.down("sm")]: {
      height: 150,
    },
  },
  chatbtn: {
    position: "absolute",
    bottom: "0.5vh",
    right: "34vw",
  },
  boximages: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "43vw",
    height: "20vh",
    gap: "0.5vw",
    marginBottom: "2vh",
  }
}));

export default function PostDetail() {
  const classes = useStyles();
  const myId = useSelector(state => state.auth.uid);
  const [post, setPost] = useState([]);
  const [authorId, setAuthorId] = useState([]);
  const [author, setAuthor] = useState({});
  const [viewChat, setViewChat] = useState(false);

  let photo = author?.usr_photo ? author?.usr_photo : IMG;

  // Dispatch
  const dispatch = useDispatch();

  // Estado de loading
  const loader = useSelector(state => state.ui.loading);

  // Id desde params
  const { id } = useParams();

  useEffect(() => {
    dispatch(startLoading())
    const getPostData = async () => {
      try {
        const postData = await getPostDetail(id);
        console.log("post:", postData)
        setPost(postData);
        setAuthorId(postData.usr_id);
        dispatch(finishLoading());
      } catch (error) {
        console.log(error);
      }
    };
    getPostData();
    const getAuthorData = async () => {
      try {
        const authorData = await getProfile(authorId);
        console.log("author:", authorData)
        setAuthor(authorData);
      } catch (error) {
        console.log(error);
      }
    }
    getAuthorData();
  }, [id, authorId]);

  return (loader ? <LoadingScreen /> :
    <div className={classes.container}>
      {post?.post_id ?
        <Card className={classes.card}>
          <CardActionArea>
            <Typography className={classes.font} gutterBottom variant="h5">
              <img className='conversationImg'
                src={photo}
                alt=""
              />
              {author?.usr_username}
            </Typography>
            <Typography className={classes.fontTitle} gutterBottom variant="h5">
              {post?.post_title}
            </Typography>
            <Typography style={{marginLeft: "15px"}} variant="body2">
              Oficio requerido: {post?.jobs?.map(job => job.job_name).join(', ')}
            </Typography>
            <CardContent>
              <dic className={classes.boximages}>
                {post.post_photo.length > 0 ? post.post_photo.map(foto => {
                  return (
                    <img className={classes.media} src={foto} />
                  )
                }) : <span>No hay fotos en esta publicación</span>}
              </dic>
              <Typography className={classes.fontDesc} variant="body2">
                {post.post_shortdescription}
              </Typography>
              <Typography className={classes.fontDesc} variant="body2">
                {post.post_description}
              </Typography>
            </CardContent>
            <CardContent>
              <Typography className={classes.fontStatus} variant="body2">
                {post.post_priority ? post.post_priority : <span>Poco urgente</span>}
              </Typography>
            </CardContent>
            <CardContent>
              <Typography className={classes.fontDesc} variant="body2">
                Fecha de publicación: {convertDate(post.createdAt)}
              </Typography>
            </CardContent>
            <CardContent>
              <Typography className={classes.fontDesc} variant="body2">
                Pago:
                {post.post_fee ? post.post_fee : <span> Por acordar</span>}
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card> : <h1>No se encontraron datos de este usuario</h1>}
      {/* <button className="btn-detalle" onClick={() => setViewChat(!viewChat)}>
        <div class="svg-wrapper-1">
          <div class="svg-wrapper">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
              <path fill="none" d="M0 0h24v24H0z"></path>
              <path fill="currentColor" d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z"></path>
            </svg>
          </div>
        </div>
        <span>Abrir Chat</span>
      </button> */}
      {
        myId !== authorId && <div className={classes.chatbtn}>
          <ChatWindowv2 receiverData={author} />
        </div>
      }

    </div>
  );
};

function convertDate(date) {
  let data = date.slice(0, 10);
  let newDate = data.split('-');
  let newDate2 = newDate[2] + '/' + newDate[1] + '/' + newDate[0];
  return newDate2;
}
