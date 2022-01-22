import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../components/Home/Home";
import { ProfileDetails } from "../components/ProfileDetails/ProfileDetails";
import PostDetail from "../components/PostDetail/PostDetail";
import FormEmpleador from "../components/FormEmpleador/FormEmpleador";
// import Sidebar from "../components/nav/Sidebar";
import Checkout from "../components/mercadopago/Mercadopago";
import { EditProfile } from "../components/ProfileDetails/EditProfile/EditProfile";

import AlertaEmpleo from "../components/AlertasEmpleo/AlertaEmpleo.jsx";
import { CardsProfileUser } from "../components/cardsProfileUser/CardsProfileUser";
import { About } from "../components/About/About";

import Messenger from "../components/Messenger/Messenger";
import NewNav from "../components/NewNav/NewNav"

import { FormReview } from "../components/formReview/FormReview";


export const LoginRouter = () => {
  return (
    <div>
      <div>
        <NewNav />
        <Routes>
          <Route path="home" element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="jobs" element={<Home />} />
          <Route path="email" element={<AlertaEmpleo />} />
          <Route path="profile/:userId" element={<ProfileDetails />} />
          <Route path="editprofile/:userId" element={<EditProfile />} />
          <Route path="post/:id" element={<PostDetail />} />
          <Route path="createpost" element={<FormEmpleador />} />
          <Route path="job/:jobId" element={<CardsProfileUser />} />
          <Route path="messenger" element={<Messenger />} />

          <Route path="prueba" element={<Checkout />} />
          <Route path="test" element={<FormReview />} />
          <Route path="messenger" element={<Messenger />} />

          {/* {Todas las rutas privadas deben ir aquí} */}
        </Routes>
      </div>
    </div>
  );
};
