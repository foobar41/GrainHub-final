const Redis = require('ioredis');
const redis = new Redis();

// Middleware for caching
const cache = async (req, res, next) => {
    const cacheKey = req.originalUrl;
    const data = await redis.get(cacheKey);
  
    try {
      if (data !== null) {
        // console.log('Data found in cache!');
        res.status(200).json(JSON.parse(data));
      } else {
        next();
      }
    } catch (err) {
      console.error(err);
      next();
    }
  };

module.exports = {
  redis,
  cache,
};
