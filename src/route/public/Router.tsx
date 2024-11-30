import React, { FC, useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import routes from "./routes";
import Layout from "../../main/app/layout/Layout";
import Login from "../../workspace/modules/users/Login";
import Register from "../../workspace/modules/users/Register";
import RoundComponent from "../../workspace/modules/round/RoundComponent";
import Setting from "../../workspace/modules/Setting/Setting";
import Home from "../../workspace/modules/home/Home";
import About from "../../workspace/modules/about/About";
// import WebSocketService from "../../shared/service/WebSocketService";
import GameComponent from "../../workspace/modules/game/GameComponent";
import Historique from "../../workspace/modules/Historique/Historique";
import Replay from "../../workspace/modules/Replay/Replay";
import Logout from "../../workspace/modules/users/LogOut";
import { ForgotPassword } from "../../workspace/modules/ForgotPassword/ForgotPassword";

const Router: FC = () => {
  const currentUserId = 1; // Remplacez ceci par la logique pour récupérer l'ID de l'utilisateur connecté

  // useEffect(() => {
  //   // Créez une instance de socket et connectez-le
  //   WebSocketService.createInstanceSocket("ws://localhost:3002"); 

  //   return () => {
  //     // Fermez la connexion au socket lors du démontage du composant
  //     WebSocketService.closeSocket(); 
  //   };
  // }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* Routes sans Layout */}
        <Route path={routes.LOGIN} element={<Login />} />
        <Route path={routes.REGISTER} element={<Register />} />
        <Route path={routes.GAME} element={<GameComponent />} />
        <Route path={routes.FORGOTPASSWORD} element={<ForgotPassword />} />

        {/* Routes avec Layout */}
        <Route element={<Layout />}>
          <Route path={routes.HOME} element={<Home />} />
          <Route
            path={routes.ROUND}
            element={<RoundComponent currentUserId={currentUserId} />}
          />
           <Route path={routes.SETTINGS} element={<Setting />} />
          <Route path={routes.HISTORIQUE} element={<Historique />} />
          <Route path={routes.REPLAY} element={<Replay />} />
          <Route path={routes.ABOUT} element={<About />} />
          <Route path={routes.LOGOUT} element={<Logout />} />
        </Route>

        {/* Redirection par défaut */}
        <Route path="*" element={<Navigate to={routes.LOGIN} />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
