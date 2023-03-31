 const rateLimit = require('express-rate-limit');

 const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit eache IP to 20 requests per windowMs
    message : "vous avez envoyé trop de requêtes, essayez ultérieurement !",
 });

 module.exports = limiter;