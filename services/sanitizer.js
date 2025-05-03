const sanitizeHtml = require('sanitize-html') 

const sanitizer = (req, res, next) => {
  // Sanitize the request body to prevent XSS attacks
  // req.body = {title: "gwjd", description: "jsdf"}
  if (req.body) {
    for (const key in req.body) {
      // if (req.body.hasOwnProperty(key)) {
        req.body[key] = sanitizeHtml(req.body[key], {
          allowedTags: [], // No tags allowed
          allowedAttributes: {} // No attributes allowed
        });
      // }
    }
  }

  // Sanitize the request query parameters to prevent XSS attacks
  if (req.query) {
    for (const key in req.query) {
      // if (req.query.hasOwnProperty(key)) {
        req.query[key] = sanitizeHtml(req.query[key], {
          allowedTags: [], // No tags allowed
          allowedAttributes: {} // No attributes allowed
        });
      // }
    }
  }

  next(); // Call the next middleware or route handler
};

module.exports = sanitizer;