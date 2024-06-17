import User from "../models/UserModel.js";
import Book from "../models/BookModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";


/////////////////////////////////////////////USERS////////////////////////////////////////////
// get all user controller
export const GetAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    if (!users || users.length === 0) {  // Check if users array is empty
      return res.status(404).json({ message: "No users found" });
    }
    console.log(users);
    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "Internal server error getting users" });
  }
};

// get user by id controller
export const GetUsersById = async (req, res) => {
  console.log(req.params.id)
  try {
    const { id } = req.params;
    const convertId = new mongoose.Types.ObjectId(id)
    let user = await User.findById(convertId);

    if (!user) {
      return res.json({ message: "user not found" });
    }
    
    console.log(user);
    res.json(user);
  } catch (err) {
    console.log(err)
    res.json( {message: "can't get the id"} );
  }
};

// delete user controller
export const DeleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if the provided ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.json({ message: "Invalid user ID" });
    }

    // Use findByIdAndDelete to find and delete the user by ID
    const deletedUser = await User.findByIdAndDelete({_id: id});

    // Check if the user was found and deleted
    if (!deletedUser) {
      return res.json({ message: "User not found" });
    }
    
    return res.json({ message: "User deleted successfully" });
  } catch (err) {
    
    console.error("Error deleting user:", err);
    return res.json({ message: "Internal server error" });
  }
};

// update user controller
export const UpdateUser = async (req, res) => {
  
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { username, email, oldPassword, newPassword } = req.body;

    // Check if the provided ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    // Check if the user exists
    const existingUser = await User.findOne({ _id:id });
    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the old password matches the stored hashed password
    const isPasswordMatch = await bcrypt.compare(oldPassword, existingUser.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: 'Old password does not match' });
    }

    // Hash the new password if provided
    const hashedNewPassword = newPassword ? await bcrypt.hash(newPassword, 10) : undefined;

    // Update user
    const updateUser = {
      username,
      email,
      password: hashedNewPassword,
    };

    await User.updateOne({ _id: id }, updateUser);
    res.json({ message: 'User updated' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};


// sign up controller
export const SignUp = async (req, res) => {
  
  try {
    const checkPwd =
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,30}$/;
    let verifMail = await User.findOne({ email: req.body.email });

    if (verifMail) {
      return res.json({ message: " this EMAIL already exist in our DB" });
    }
    if (!checkPwd.test(req.body.password)) {
      return res.json({
        message: "the password is not respecting our security rules",
      });
    }

    let newUser;

    if (req.file.img) {
      newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        age: req.body.age,
        image: req.file.img[0].filename,
      });
    } else {
      newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        age: req.body.age,
      });
    }

    await newUser.save();

    res.json({ message: "You're in our data base NOW! Congrats!" });
  } catch (err) {
    console.log(err);
    res.json({ message: "impossible to sign up now , TRY AGAIN LATER" });
  }
};

// sign in controller
export const SignIn = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (user) {
      let checkPwd = bcrypt.compareSync(req.body.password, user.password);

      if (!checkPwd) {
        return res.json({ message: "Email or password is Incorrect" });
      }
      // Création de notre token à la connexion
      const token = jwt.sign({ id: user.id }, process.env.SECRET, {
        expiresIn: "24h",
      });
      res.json({
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        token: token,
      });
    } else {
      res.json({
        message: "you need to Sign Up first ",
      });
    }
  } catch (err) {
    res.json(err);
  }
};

// log out controller
export const LogOut = (req, res) => {
  req.session.destroy((err) => {
    res.json("/");
  });
};

///////////////////////////////////  comments /////////////////////////////////////////////////////

//////////////////COMMENTS/////////////////

//add comment
export const AddComment = async (req, res) => {
  try {
    const {id} = req.params;
    let newComment = {
      pseudo: req.body.pseudo,
      comment: req.body.comment,
      date: new Date(),
    };

    await Book.updateOne({ _id: id }, { $push: { "comments": newComment } });

    res.json({ message: "bien modifié" });
  } catch (err) {
    res.json({ message: "error to add a comment here" });
  }
};

//GET COMMENTS
export const GetComments = async (req,res) => {
  try{
    const {id} = req.params.id;
    const comments = await Book.findById({_id:id}, {comments: comments}).limit(10).sort({date: -1});
    res.json(comments)
  }catch(err){
    res.json({message: "error to get comments"});
  }
}

//delete comment
export const DeleteComment = async (req, res) => {
  try {
    // assuming the comment id is in the request params
    const { id, commentId } = req.params;

    const book = await Book.findById(id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    // Remove the comment by its id
    const updatedComments = book.comments.filter(comment => comment._id.toString() !== commentId);

    // Update the Book model with the new comments array
    await Book.findByIdAndUpdate(id, { comments: updatedComments });

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ message: "Error deleting comment" });
  }
};


//////////////////////////////////////   NOTES  /////////////////////


// add notes
export const AddNote = async (req, res) => {
  // a verifier avec Bocar
  try {
    const {id }= req.params;
    const {notes} = req.body

    await Book.updateOne({ _id: id }, { $push: { "notes": notes } });

    res.json({ message: "bien modifié" });
  } catch (err) {
    res.json({ message: "error to add a comment here" });
  }
};


////  delete notes //////
export const DeleteNote = async (req, res) => {
  try {
    // assuming the comment and note ids are in the request params
    const { id, commentId, noteId } = req.params;

    const book = await Book.findById(id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    // Find the comment and its associated note
    const commentIndex = book.comments.findIndex(
      (comment) => comment._id.toString() === commentId
    );

    if (commentIndex === -1) {
      return res.status(404).json({ message: "Comment not found" });
    }

    const deletedComment = book.comments[commentIndex];

    // Remove the comment and its associated note by their ids
    const updatedComments = book.comments.filter(
      (comment) => comment._id.toString() !== commentId
    );
    const updatedNotes = book.notes.filter(
      (note) => note.commentId !== commentId && note._id.toString() !== noteId
    );

    // Update the Book model with the new comments and notes arrays
    await Book.findByIdAndUpdate(id, {
      comments: updatedComments,
      notes: updatedNotes,
    });

    res
      .status(200)
      .json({ message: "Comment and associated note deleted successfully", deletedComment });
  } catch (error) {
    console.error("Error deleting comment and note:", error);
    res.status(500).json({ message: "Error deleting comment and note" });
  }
};












