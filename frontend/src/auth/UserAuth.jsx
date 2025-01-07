import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/user.context";
import { useNavigate } from "react-router-dom";

const UserAuth = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if(user){
        setLoading(false);
    }
    if (!token || !user) {
      navigate("/login");
    }
  }, []);

  if (loading) {
    return <>Loading ... </>;
  }

  return <> {children} </>;
};

export default UserAuth;
