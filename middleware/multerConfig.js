const multer = require('multer')  

const storage = multer.diskStorage({
      destination: function (req, file, cb) { 
        cb(null, './storage') 
      }
    })
    
module.exports = {multer,storage} 
