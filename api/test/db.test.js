const { expect } = require('chai');
const axios = require('axios');

const id = "642565b5511d371f6ef9120b"
const data = {
  "_id": "642565b5511d371f6ef9120b",
  "key": 1,
  "name": "Paddy",
  "price": 12,
  "category": "Grain",
  "image": "https://cdn.shopify.com/s/files/1/0251/6942/8589/products/image_0bef0c27-a579-49da-90f2-b1fe09ac2ba0_1024x1024@2x.jpg?v=1658638294",
  "in_stock": 30,
  "__v": 0
};

describe('GET /', () => {
  it('should return products from database if present', async () => {

    // Make request to route
    const res = await axios.get(`http://localhost:5000/api/products`)

    // Check that cached data was returned
    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('array').that.is.not.empty;
  });

  it('should return product with given id', async () => {

    // Make request to route
    const res = await axios.get(`http://localhost:5000/api/products/find/${id}`)

    // Check that cached data was returned
    expect(res.status).to.equal(200);
    expect(res.data).to.deep.equal(data);
  });
});
