import { Link, useLocation } from "react-router-dom";
import "./product.css";
import Chart from "../../components/chart/Chart";
import { productData } from "../../dummyData";
import { Publish } from "@material-ui/icons";
import { useSelector } from "react-redux";
import { useEffect, useMemo, useState } from "react";
import { userRequest } from "../../requestMethods";

export default function Product() {
  const location = useLocation();
  const productId = location.pathname.split("/")[2];
  const [pStats, setPStats] = useState([]);

  const product = useSelector((state) =>
    state.product.products.find((product) => product._id === productId)
  );

  const MONTHS = useMemo(
    () => [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Agu", "Sep", "Oct", "Nov", "Dec"],
    []
  );

  useEffect(() => {
    const getStats = async () => {
      try {
        const res = await userRequest.get("orders/income?pid=" + productId);
        const list = res.data.sort((a,b)=>{
            return a._id - b._id
        })
        list.map((item) =>
          setPStats((prev) => [
            ...prev,
            { name: MONTHS[item._id - 1], Sales: item.total },
          ])
        );
      } catch (err) {
        console.log(err);
      }
    };
    getStats();
  }, [productId, MONTHS]);

  const handleUpdate = (e) => {
    e.preventDefault();
  };

  return (
    <div className="product">
      <div className="productTitleContainer">
        <h1 className="productTitle">Product</h1>
        <Link to="/newproduct">
          <button className="productAddButton">Create</button>
        </Link>
      </div>
      <div className="productTop">
        <div className="productTopLeft">
          <Chart data={pStats} dataKey="Sales" title="Sales Performance" />
        </div>
        <div className="productTopRight">
          <div className="productInfoTop">
            <img src={product.image} alt="" className="productInfoImg" />
            <span className="productName">{product.name}</span>
          </div>
          <div className="productInfoBottom">
            <div className="productInfoItem">
              <span className="productInfoKey">id: </span>
              <span className="productInfoValue">{product._id}</span>
            </div>
            {/* <div className="productInfoItem">
              <span className="productInfoKey">Sales:</span>
              <span className="productInfoValue">0</span>
            </div> */}
            <div className="productInfoItem">
              <span className="productInfoKey">In stock:</span>
              <span className="productInfoValue">{product.in_stock ? "Yes" : "No"}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="productBottom">
        <form className="productForm">
          <div className="productFormLeft">
            <label>Product Name</label>
            <input type="text" placeholder={product.name} />
            <label>Product Price</label>
            <input type="text" placeholder={product.price} />
            <label>Add Stock</label>
            <input type="number" placeholder={product.in_stock} />
          </div>
          <div className="productFormRight">
            <div className="productUpload">
              <img src={product.image} alt="" className="productUploadImg"/>
              <label for="file">
                <Publish />
              </label>
              <input type="file" id="file" style={{ display: "none", cursor:'pointer'}}/>
            </div>
            <button onClick={handleUpdate} className="productButton">Update</button>
          </div>
        </form>
      </div>
    </div>
  );
}
