import multer from "multer";
import path from "path";

const destination = path.resolve("tmp");

const storage = multer.diskStorage({
  destination,
  filename: (req, file, cb) => {
    const { originalname } = file;
    const uniqueRrefix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const filename = `${uniqueRrefix}_${originalname}`;
    cb(null, filename);
  },
});

const upload = multer({
  storage,
});

export default upload;
