import React, { FC, useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import routes from "./routes";
import Layout from "../../main/app/layout/Layout";
import Login from "../../workspace/modules/users/Login";
import Register from "../../workspace/modules/users/Register";
import RoundComponent from "../../workspace/modules/round/RoundComponent";
import socket, { createInstanceSocket } from "../../socket/socket";
import Setting from "../../workspace/modules/Setting/Setting";
import Home from "../../workspace/modules/home/Home";
import About from "../../workspace/modules/about/About";

const Router: FC = () => {
  const currentUserId = 1; // Remplacez ceci par la logique pour récupérer l'ID de l'utilisateur connecté

  /**
   * LIFECYCLE
   */
  // Initialiser le socket lors de l'ouverture du composant
  useEffect(() => {
    if (!socket?.connected) {
      createInstanceSocket();
      if (!socket) return;
      socket.connect();
    } else {
      socket.connect();
    }
  }, [socket]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Routes sans Layout */}
        <Route path={routes.LOGIN} element={<Login />} />
        <Route path={routes.REGISTER} element={<Register />} />
        {/* <Route path={routes.FORGOTPASSWORD} element={<ForgotPassword />} /> */}

        {/* Routes avec Layout */}
        <Route element={<Layout />}>
          <Route path={routes.HOME} element={<Home />} />
          <Route
            path={routes.ROUND}
            element={<RoundComponent currentUserId={currentUserId} />}
          />
          <Route path={routes.SETTINGS} element={<Setting />} />
          <Route path={routes.ABOUT} element={<About />} />
          {/* <Route path={routes.LOGOUT} element={<Logout />} /> */}
        </Route>

        {/* Redirection par défaut */}
        <Route path="*" element={<Navigate to={routes.LOGIN} />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
