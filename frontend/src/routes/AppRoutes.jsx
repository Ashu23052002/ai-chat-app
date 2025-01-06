import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "../screen/Login";
import Register from "../screen/Register";
import Home from "../screen/Home";
import { UserProvider } from "../context/user.context";
import Project from "../screen/Project";

const AppRoutes = () => {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/project" element={<Project />}/>
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
};

export default AppRoutes;
