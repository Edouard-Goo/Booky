import multer from "multer";
import path from "path";

const maxSize = 5242800000000; //   2g max de limite

const storageEngine = multer.diskStorage({
  destination: "./public/img",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname.split(" ").join("_")}`);
  },
});

const upload = multer({
  storage: storageEngine,
  limits: {
    fileSize: maxSize,
  },
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  },
});

/**
 * to verify the files extensions
 */

const checkFileType = (file, cb) => {
  // Autorisation des extensions de fichiers
  const fileTypes = /jpeg|jpg|png|pdf|ppt/;

  // Vérifie les  nom des extensions
  const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimeType = fileTypes.test(file.mimetype);
  if (mimeType && extName) {
    return cb(null, true);
  } else {
    cb("Format de fichier non supporté");
  }
};

// Vérification les extensions des fichiers

export default upload;
