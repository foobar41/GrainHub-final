import { useEffect, useState } from "react";
import styled from "styled-components";
import ProductTile from "./ProductTile";
import axios from "axios";

const Container = styled.div`
  padding: 20px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
`;

const Products = ({ cat, filters, sort }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => getProducts(), [cat]);

  const getProducts = async () => {
    try {
      const res = await axios.get(
        cat
          ? `http://localhost:5000/api/products/findCat/${cat}`
          : "http://localhost:5000/api/products"
      );
      setProducts(res.data);
    } catch (err) {}
  };
  
  useEffect(() => {
    cat &&
      setFilteredProducts(
        products.filter((item) =>
          Object.entries(filters).every(([key, value]) =>
            item[key].includes(value)
          )
        )
      );
  }, [products, cat, filters]);

  useEffect(() => {
    if (sort === "newest") {
      setFilteredProducts((prev) =>
        [...prev].sort((a, b) => b.title - a.title)
      );
    } else if (sort === "asc") {
      setFilteredProducts((prev) =>
        [...prev].sort((a, b) => a.price - b.price)
      );
    } else {
      setFilteredProducts((prev) =>
        [...prev].sort((a, b) => b.price - a.price)
      );
    }
  }, [sort]);

  return (
    <Container>
      {cat
        ? filteredProducts.map((item) => <ProductTile item={item} key={item.id} />)
        : products
            .slice(0)
            .map((item) => <ProductTile item={item} key={item.id} />)}
    </Container>
  );
};

export default Products;
