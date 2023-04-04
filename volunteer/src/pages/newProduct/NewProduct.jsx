import { useState } from "react";
import "./newProduct.css";
import { useDispatch } from "react-redux";
import { addProduct } from "../../redux/apiCalls"; // assuming this is defined in another file
import { Link } from "react-router-dom";

export default function NewProduct() {
  const [inputs, setInputs] = useState({});
  const [file, setFile] = useState(null);
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    const product = {
      title: inputs.title,
      price: parseInt(inputs.price),
      category: inputs.category,
      inStock: parseInt(inputs.in_stock),
    };
    // console.log(product)
    await addProduct(product, file, dispatch); // assuming addProduct takes product and file as parameters
    alert("Product has been created successfully!");
  };

  return (
    <div className="newProduct">
      <h1 className="addProductTitle">New Product</h1>
      <form className="addProductForm">
        <div className="addProductItem">
          <label>Image</label>
          <input
            type="file"
            id="file"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </div>
        <div className="addProductItem">
          <label>Title</label>
          <input
            name="title"
            type="text"
            placeholder="Mango..."
            onChange={(e) => handleChange(e, "title")}
          />
        </div>
        <div className="addProductItem">
          <label>Price</label>
          <input
            name="price"
            type="number"
            placeholder="100"
            onChange={(e) => handleChange(e, "price")}
          />
        </div>
        <div className="addProductItem">
          <label>Category</label>
          <select name="category" onChange={(e) => handleChange(e, "category")}>
            <option value="">Select a category</option>
            <option value="Fruit">Fruit</option>
            <option value="Vegetable">Vegetable</option>
            <option value="Grains">Grains</option>
          </select>
        </div>
        <div className="addProductItem">
        <label>Stock</label>
          <input
            name="in_stock"
            type="number"
            placeholder="10"
            onChange={(e) => handleChange(e, "in_stock")}
          />
        </div>
        <button onClick={handleClick} className="addProductButton">
          Create
        </button>
      </form>
    </div>
  );
}
