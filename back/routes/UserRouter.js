import express from "express";

import {
  AddComment,
  AddNote,
  DeleteComment,
  DeleteNote,
  DeleteUser,
  GetAllUsers,
  GetComments,
  GetUsersById,
  LogOut,
  SignIn,
  SignUp,
  UpdateUser,
  
} from "../controllers/userController.js";
import upload from "../middlewares/multer.js";
import {  isAdmin, isLogged } from "../middlewares/auth.js";

const usersRouter = express.Router();



//  to get all users
usersRouter.get("/users", isLogged , GetAllUsers);

//  To get only one user by id
usersRouter.get("/user/:id", GetUsersById);

//  To Delete One User     
usersRouter.delete("/del-user/:id", isLogged,  DeleteUser);

// to update the user
usersRouter.post('/update-user/:id', isLogged , UpdateUser);

// to Sign Up
usersRouter.post("/sign-up", upload.single("img"), SignUp);

//  Sign In
usersRouter.post("/sign-in", SignIn);

//  Log Out
usersRouter.post("/log-out", isLogged, LogOut);

//  Add comments
usersRouter.post("/add-comment/:id", isLogged, AddComment);

//  get comments
usersRouter.get("/comments/:id", GetComments)

//  Delete Comment
usersRouter.delete("/delete-comment/:id/:commentId", isLogged , isAdmin , DeleteComment);

//  Add Note
usersRouter.post("/add-note/:id", isLogged ,  AddNote);

//  Delete Note
usersRouter.delete("/delete-note/:id/:noteId" , isLogged , isAdmin , DeleteNote)


export default usersRouter;
