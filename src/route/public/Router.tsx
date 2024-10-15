import React, { FC } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import routes from './routes';
import Layout from '../../app/layout/Layout';
import HomePage from '../../app/layout/HomePage';
import { Login } from '../../main/modules/users/Login';
import { Register } from '../../main/modules/users/Register';

const Router: FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Routes sans Layout */}
        <Route path={routes.HOME} element={<HomePage />} />
        <Route path={routes.LOGIN} element={<Login />} />
        <Route path={routes.REGISTER} element={<Register />} />
        {/* <Route path={routes.FORGOTPASSWORD} element={<ForgotPassword />} /> */}

        {/* Routes avec Layout */}
        <Route element={<Layout children={undefined} />}>
          {/* <Route path={routes.DASHBOARD} element={<Dashboard />} />
          <Route path={routes.PROFILE} element={<Profile />} />
          <Route path={routes.SETTINGS} element={<Settings />} />
          <Route path={routes.LOGOUT} element={<Logout />} /> */}
        </Route>

        {/* Redirection par défaut */}
        <Route path="*" element={<Navigate to={routes.LOGIN} />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;

