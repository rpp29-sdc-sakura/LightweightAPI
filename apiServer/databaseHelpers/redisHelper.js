const Promise = require('bluebird');
const { createClient } = require('redis');

const redisClient = createClient();
redisClient.getAsync = Promise.promisify(redisClient.get);
redisClient.setAsync = Promise.promisify(redisClient.set);

const cacheCheck = (req, res, next) => {
  redisClient.getAsync(String(req.body.productid))
    .then((result) => {
      console.log('cache query successful', );
      if (result === null) {
        next();
      } else {
        res.status(200).send(result.match(/\d+/g).map((x) => Number(x)));
      }
    })
    .catch((err) => {
      console.log('REDIS GET FAILED', err);
      next();
    })
};

module.exports = {
  redisClient,
  cacheCheck
}