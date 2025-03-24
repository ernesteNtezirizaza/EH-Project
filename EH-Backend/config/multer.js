const multer = require("multer");
const path = require("path");

//set storage engine
const storage = multer.diskStorage({
    destination: './uploads/',
         filename: function (req, file, cb) {
      cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname))},
  })


// checking file type
const fileFilter = (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png/
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = fileTypes.test(file.mimetype)
  if (mimetype && extname) {
    return cb(null, true)
  } else {
    cb('Error: Please upload images only!!!!!!')
  }
}

exports.upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 10
    },
    fileFilter: fileFilter
})