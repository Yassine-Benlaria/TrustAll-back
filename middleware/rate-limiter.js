// rate-limiter.js
const rateLimiter = require("express-rate-limit"); 
const limiter = rateLimiter({    
    max: 10,
        windowMS: 1000, // 1 second
        message: "You can't make any more requests at the moment. Try again later",
}); 
module.exports = limiter