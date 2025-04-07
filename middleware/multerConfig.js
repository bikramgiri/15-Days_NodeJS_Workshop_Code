const multer = require('multer') // format: ecma script module

const storage = multer.diskStorage({
      destination: function (req, file, cb) { // cb is a callback function that takes an error and a destination path 
        cb(null, './storage') // the first parameter is an error, the second is the destination path
      },
      filename: function (req, file, cb) { // cb is a callback function that takes an error and a filename 
        // cb(null, file.originalname)
        // or
        // cb(null, file.fieldname + '-' + file.originalname)
        // or
        cb(null, Date.now() + '-' + file.originalname) // the first parameter is an error, the second is the filename
        // or
        // cb(null, file.fieldname + '-' + Date.now() + '-' + file.originalname) // the first parameter is an error, the second is the filename
        // or
        // cb(null, req.userId + '-' + file.originalname)
      }
    })
    
module.exports = {multer,storage}  // format: common js module

