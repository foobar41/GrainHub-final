import {
  FavoriteBorderOutlined,
  SearchOutlined,
  ShoppingCartOutlined,
} from "@material-ui/icons";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { publicRequest } from "../requestMethods";
import { addProduct } from "../redux/cartRedux";
import { useDispatch } from "react-redux";


const Info = styled.div`
  opacity: 0;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.2);
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.5s ease;
  cursor: pointer;
border-radius: 4.5%;

`;

const Container = styled.div`
  flex: 1;
  margin: 5px 30px 5px 30px;
  padding: 10px;
  min-width: 280px;
  max-width: 350px;
  // background-color: #D1EEEE;
  border-radius: 4.5%;
  height: 350px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  flex-direction: column;

  &:hover ${Info}{
    opacity: 1;
  }
`;

const TitleContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

const Title = styled.h3`
  margin: 10px;
`;

const Circle = styled.div`
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background-color: white;
  position: absolute;
`;

const Image = styled.img`
border-radius: 4.5%;
background-color: #d2f5fc;
  height: 100%;
  width: 100%;
  z-index: 2;
`;

const Icon = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #e1ebea;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 10px;
  transition: all 0.5s ease;
  &:hover {
    background-color: #e9f5f5;
    transform: scale(1.1);
  }
`;
const Button = styled.button`
  padding: 15px;
  border: 2px solid teal;
  background-color: white;
  cursor: pointer;
  font-weight: 500;

  &:hover {
    background-color: #f8f4f4;
  }
`;

const ProductTile = ({ item }) => {
  const location = useLocation();
  const id = location.pathname.split("/")[2];
  const [product, setProduct] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [color, setColor] = useState("");
  const [size] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    const getProduct = async () => {
      try {
        const res = await publicRequest.get("/products/find/" + item._id);
        setProduct(res.data);
      } catch {}
    };
    getProduct();
  }, [id]);

  // const handleQuantity = (type) => {
  //   if (type === "dec") {
  //     quantity > 1 && setQuantity(quantity - 1);
  //   } else {
  //     setQuantity(quantity + 1);
  //   }
  // };

  const handleClick = () => {
    alert('Product Added to Cart')
    dispatch(
      addProduct({ ...product, id, quantity, color, size })
    );
  };
  return (
    <Container>
      <Circle />
      <Image src={item.image} />
      <Info>
        <Icon>
          <ShoppingCartOutlined onClick={handleClick} />
        </Icon>
        <Icon>
          <Link to={`/product/${item._id}`}>
            <SearchOutlined />
          </Link>
        </Icon>
      </Info>
      <TitleContainer>
        <Title>{item.name}</Title>
        <Title>{item.price}/-</Title>
      </TitleContainer>
    </Container>
  );
};

export default ProductTile;