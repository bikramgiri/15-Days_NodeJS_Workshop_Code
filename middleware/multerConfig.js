// *Useful in all project

const multer = require('multer') // format: ecma script module

const storage = multer.diskStorage({
      destination: function (req, file, cb) { // cb is a callback function that takes an error and a destination path 
        
        // logic to validate fileType(mimeType)
        const allowedFileTypes = ['image/jpeg', 'image/png', 'image/jpg']
        if (!allowedFileTypes.includes(file.mimetype)) {
          cb(new Error('Invalid file type. Only JPEG, JPG and PNG are allowed.'));
          return ; 
        }

        // logic to validate fileSize
        const maxSize = 2 * 1024 * 1024; // 2MB in bytes
        if (file.size > maxSize) {
          cb(new Error('File size exceeds the limit of 2MB.'));
          return ; 
        }

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

