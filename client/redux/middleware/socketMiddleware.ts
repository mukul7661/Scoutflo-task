// redux/middleware/socketMiddleware.ts
import { Middleware } from "@reduxjs/toolkit";
import io from "socket.io-client";
import { updateDeployment } from "../slices/deploymentSlice";

const socket = io("http://localhost:5000");

const socketMiddleware: Middleware = (storeAPI) => {
  socket.on("deploymentStatus", (deployment) => {
    console.log("Deployment status updated:", deployment);
    storeAPI.dispatch(updateDeployment(deployment));
  });

  return (next) => (action) => {
    return next(action);
  };
};

export default socketMiddleware;
