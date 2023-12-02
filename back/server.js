import express from "express";
import { connectDB } from "./config/database.js";
import cors from "cors";
import booksRouter from "./routes/BooksRouter.js";
import usersRouter from "./routes/UserRouter.js";
import dotenv from "dotenv";

dotenv.config();
const app = express();

connectDB;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cors({
}));

// Mon router
app.use(booksRouter);
app.use(usersRouter);

app.listen(process.env.PORT, () => {
  console.log(process.env.BASE_URL);
});


// origin:"http://edouardgooda.ide.3wa.io:3000",
// Credentials: true
