const Redis = require('ioredis');
const redis = new Redis();

// Middleware for caching
const cache = async (req, res, next) => {
  const cacheKey = req.originalUrl;

  try {
    if (!redis.status === 'ready') {
      await redis.connect();
    }

    const data = await redis.get(cacheKey);

    if (data !== null) {
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
  cache,
};
