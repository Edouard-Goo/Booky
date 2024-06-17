import Book from "../models/BookModel.js";
import jwt from 'jsonwebtoken';
import mongoose from "mongoose";
import { promisify } from 'util';
const asyncSign = promisify(jwt.sign);
const asyncVerify = promisify(jwt.verify);

/////// Get books controller //////////////
export const GetBook = async (req, res) => {
  try {
    let allBooks = await Book.find({}).sort({date: -1}).limit(30);
    res.json(allBooks);
  } catch (err) {
    res.json("category ne marche pas");
  }
};

/////////// To add the books with its images and pdf to the Data Base  /////////////////
export const AddBookSubmit = async (req, res) => {
  console.log(req.body);

  try {
    
    const userId = req.userId; 
console.log(req.userId)
  

    // Create a new book with user ID
    let newBook;
    if (req.files.img && req.files.pdf) {
      newBook = new Book({
        title: req.body.title,
        author: req.body.author,
        mini_description: req.body.description,
        category: req.body.category,
        publish_year: req.body.publish_year,
        pages: parseInt(req.body.pages),
        date: new Date(),
        image: req.files.img[0].filename,
        pdfFile: req.files.pdf[0].filename,
        userId: userId, // Save the user's ID
      });
    } else {
      newBook = new Book({
        title: req.body.title,
        author: req.body.author,
        pages: parseInt(req.body.pages),
        mini_description: req.body.description,
        category: req.body.category,
        publish_year: req.body.publish_year,
        date: new Date(),
        userId: userId, // Save the user's ID
      });
    }

    // Save the new book
    await newBook.save();

    res.json({ message: "Nouveau livre bien ajouté" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Impossible d'ajouter le livre" });
  }
};

/////////////////////////// to show the names of category     /////////////////////////
export const BookCategories = async (req, res) => {
  try {
    const bookCategs = await Book.distinct("category");
    res.json(bookCategs);
  } catch (err) {
    console.log(err);
    console.log("errrrr category");
  }
};

//////////////   to enter to the complete version of each book   //////////////////////
export const BookDetails = async (req, res) => {
  console.log(req.params.id);
  try {
    const  id  = req.params.id;
    if (!id) {
      return res.status(400).json({ message: 'Book ID is required' });
    }

    let oneBook = await Book.findOne({_id: id});

    if (!oneBook) {
      // Book not found
      return res.status(200).json({ message: 'Book not found' });
    }
console.log(oneBook)
    // Book found, send it in the response
    res.json(oneBook);
  } catch (err) {
    console.error("Error fetching book details:", err);
    // Internal Server Error
    res.status(500).json({ message: 'Internal Server Error book details' });
  }
};

//////////////////////////           update a book             /////////////////////////
export const UpdateBook = async (req, res) => {
  try {
    const { id } = req.params;
    let updateBook;

    if (req.files.img && req.files.pdf) {
      updateBook = {
        title: req.body.title,
        author: req.body.author,
        mini_description: req.body.description,
        category: req.body.category,
        publish_year: req.body.publish_year,
        pages: parseInt(req.body.pages),
        date: new Date(),
        image: req.files.img[0].filename,
        pdfFile: req.files.pdf[0].filename,
      };
    } else {
      updateBook = {
        title: req.body.title,
        author: req.body.author,
        mini_description: req.body.description,
        pages: parseInt(req.body.pages),
        category: req.body.category,
        publish_year: req.body.publish_year,
        date: new Date(),
      };
    }

    await Book.updateOne({ _id: id }, updateBook);

    res.json({ message: "book updated" });
  } catch (err) {
    console.log(err);
  }
};

///////////////////////////             delete a book             /////////////////////////
export const DeleteBook = async (req, res) => {
  try {
    const {id} = req.params;
    console.log('Received request to delete book with ID:', id);
    if (!id) {
      return res.status(400).json({ message: 'Book ID is required' });
    }

    const deletedBook = await Book.findByIdAndRemove(id);

    if (!deletedBook) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.json({ message: 'Book deleted successfully', deletedBook });
  } catch (err) {
    console.error("Error deleting book:", err);
    res.status(500).json({ message: 'Internal Server Error deleting book' });
  }
};


////////////////////////////           / book by user             /////////////////////////

export const BookByUser = async (req, res) => {
  try {
    const { id } = req.params; 
    console.log(id, "user by id");

    // Check if the id parameter is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    // Use the find method to find books by userId
    const books = await Book.find({ userId: id });

    // Check if any books were found
    if (books.length === 0) {
      return res.status(200).json({ message: "No books found for this user" });
    }

    console.log("books", books);
    res.json(books);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//////////////////////// SEARCH BOOKS  //////////////
export const SearchBooks = async (req,res) => {
  try {
    const searchTerm = req.query.term;

    // Use a regular expression to perform a case-insensitive search
    const regex = new RegExp(searchTerm, "i");

    // Query the database for books matching the search term
    const searchResults = await Book.find({
      $or: [
        { title: { $regex: regex } },
        { author: { $regex: regex } },
        {category: { $regex: regex} },
        
      ],
    });

    res.json(searchResults);
  } catch (error) {
    console.error("Error searching books:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}



