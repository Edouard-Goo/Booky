import express from "express";
import {
  AddBookSubmit,
  BookByUser,
  BookCategories,
  BookDetails,
  DeleteBook,
  GetBook,
  SearchBooks,
  UpdateBook,
} from "../controllers/bookController.js";
import upload from "../middlewares/multer.js";
import { isLogged } from "../middlewares/auth.js";



const booksRouter = express.Router();

// Here to get the books by category

booksRouter.get("/all-books", GetBook);

// here to save the book with its image and pdf directly to the Data Base
booksRouter.post(
  "/add-book",
  isLogged,
  

  upload.fields([
    {
      name: "img",
    },
    {
      name: "pdf",
    },
  ]),
  AddBookSubmit
);

// get the books by user
booksRouter.get("/book-by-user/:id", isLogged, BookByUser);

//to show The details of each book
booksRouter.get("/details/:id", BookDetails);

// to update a book
booksRouter.post(
  "/update/:id",
  isLogged,

  upload.fields([
    {
      name: "img",
    },
    {
      name: "pdf",
    },
  ]),
  UpdateBook
);

// Delete Book
booksRouter.delete("/delete-book/:id", isLogged, DeleteBook);

//books by category
booksRouter.get("/categories", BookCategories);

//Search Books 
booksRouter.get("/search", SearchBooks);



export default booksRouter;
