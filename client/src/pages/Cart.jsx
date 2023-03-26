import { Add, Remove } from "@material-ui/icons";
import { useSelector } from "react-redux";
import styled from "styled-components";
import Announcement from "../components/Announcement";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
// import { mobile } from "../responsive";
import StripeCheckout from "react-stripe-checkout";
import { useEffect, useState } from "react";
import { publicRequest, userRequest } from "../requestMethods";
import { useHistory } from "react-router";
import { useDispatch } from "react-redux";
import { clearCart } from "../redux/apiCalls";
import { delCart } from "../redux/cartRedux";

import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { current } from "@reduxjs/toolkit";

// import { useLocation } from "react-router-dom";
// // import { useEffect, useState } from "react";
// import { userRequest } from "../requestMethods";
// import { addProduct } from "../redux/cartRedux";
// import { useDispatch } from "react-redux";

const KEY = process.env.REACT_APP_STRIPE;

const Container = styled.div``;

const Wrapper = styled.div`
  padding: 20px;
   ₹{mobile({ padding: "10px" })}
`;

const Title = styled.h1`
  font-weight: 300;
  text-align: center;
`;

const Top = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
`;

const TopButton = styled.button`
  padding: 10px;
  font-weight: 600;
  cursor: pointer;
  border: ${(props) => props.type === "filled" && "none"};
  background-color: ${(props) =>
    props.type === "filled" ? "black" : "transparent"};
  color: ${(props) => props.type === "filled" && "white"};
`;

// const TopTexts = styled.div`
//    ₹{mobile({ display: "none" })}
// `;
// const TopText = styled.span`
//   text-decoration: underline;
//   cursor: pointer;
//   margin: 0px 10px;
// `;

const Bottom = styled.div`
  display: flex;
  justify-content: space-between;
   ₹{mobile({ flexDirection: "column" })}
`;

const Info = styled.div`
  flex: 3;
`;

const Product = styled.div`
  margin: 20px;
  display: flex;
  justify-content: space-between;
   ₹{mobile({ flexDirection: "column" })}
`;

const ProductDetail = styled.div`
  flex: 2;
  display: flex;
`;

const Image = styled.img`
  width: 200px;
  height: 150px;
`;

const Details = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
`;

const ProductName = styled.span`
font-size: 24px;
`;

// const ProductId = styled.span`
// font-size: 24px;
// `;

// const ProductColor = styled.div`
//   width: 20px;
//   height: 20px;
//   border-radius: 50%;
//   background-color:  ₹{(props) => props.color};
// `;

// const ProductSize = styled.span``;

const PriceDetail = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const ProductAmountContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const ProductAmount = styled.div`
  font-size: 24px;
  margin: 5px;
   ₹{mobile({ margin: "5px 15px" })}
`;

const ProductPrice = styled.div`
  font-size: 30px;
  font-weight: 200;
   ₹{mobile({ marginBottom: "20px" })}
`;

const Hr = styled.hr`
  background-color: #eee;
  border: none;
  height: 1px;
`;

const Summary = styled.div`
  flex: 1;
  border: 0.5px solid lightgray;
  border-radius: 10px;
  padding: 20px;
  height: 50vh;
`;

const SummaryTitle = styled.h1`
  font-weight: 200;
`;

const SummaryItem = styled.div`
  margin: 30px 0px;
  display: flex;
  justify-content: space-between;
  font-weight:  ₹{(props) => props.type === "total" && "500"};
  font-size:  ₹{(props) => props.type === "total" && "24px"};
`;

const SummaryItemText = styled.span``;

const SummaryItemPrice = styled.span``;

const Button = styled.button`
  width: 100%;
  padding: 10px;
  background-color: black;
  color: white;
  font-weight: 600;
`;

const Cart = () => {
  const discount = 5;
  const cart = useSelector((state) => state.cart);
  const [stripeToken, setStripeToken] = useState(null);
  const history = useHistory();
  const dispatch = useDispatch();

  // const location = useLocation();
  // const id = location.pathname.split("/")[2];
  const currentUser = useSelector((state) => state.user.currentUser);
  const [orderId, setOrderId] = useState(null);

  const onToken = (token) => {
    setStripeToken(token);
  };

  const delClick = () => {
    dispatch(
      delCart()
    );
  };

  useEffect(() => {
    const makeRequest2 = async () => {
      try {
        const res2 = await userRequest.post("/orders", {
          products: cart.products,
          userId: currentUser._id,
          // tokenId: stripeToken.id,
          address: stripeToken.card.address_line1 + " " + stripeToken.card.address_city + " " + stripeToken.card.address_zip,
          amount: (cart.total + 25),
        });
        history.push("/success/" + res2.data._id, {
          stripeData: res2.data,
          products: cart,
        });
        setOrderId(res2);
        console.log(res2.data._id);
        console.log(stripeToken.card);
        // 4242 4242 4242 4242
      } catch {
        console.log("error here");
      }
      try {
        const res = await userRequest.post("http://localhost:5000/api/checkout/payment", {
          tokenId: stripeToken.id,
          amount: (cart.total - 5) * 100,
        });
      } catch {
        console.log("error here 2");
      }
      clearCart(dispatch);
    };

    // const makeRequest = async () => {

    // };
    // const dCart = async () => {
    //   // const res = await makeRequest2();
    //   // const res2 = await makeRequest();
    //   clearCart(dispatch);

    // };
    stripeToken && makeRequest2();
    // makeRequest();
    console.log(cart);
    // dCart();
    // currentUser.cart.quantity = 0;
  }, [cart, stripeToken, cart.total, history]);

  const handleQuantity = (type, prod) => {
    const qty = prod.quantity
    if (type === "dec") {
      console.log(qty, '-', qty-1)
    } else {
      console.log(qty, '+', qty+1)
    }
  };

  return (
    <Container>
      <Navbar />
      <Announcement />
      <Wrapper>
        <Title>YOUR BAG</Title>
        <Top>
          <Link to="/">
            <TopButton type="filled">CONTINUE SHOPPING</TopButton>
            {/* <Button >Del TO CART</Button> */}
          </Link>
          <TopButton type="filled" onClick={delClick}>Delete Cart</TopButton>

          {/* <Button onClick={dCart}>CHECKOUT NOW</Button> */}
          {/* <TopTexts>
            <TopText>Shopping Bag(0)</TopText>
            <TopText>Your Wishlist (0)</TopText>
          </TopTexts> */}
          {/* <TopButton type="filled">CHECKOUT NOW</TopButton> */}
        </Top>
        <Bottom>
          <Info>
            {cart.products.map((product) => (
              <Product key={product}>
                <ProductDetail>
                  <Image src={product.image} />
                  <Details>
                    <ProductName>
                      <b>Product:</b> {product.name}
                    </ProductName>
                    {/* <ProductId>
                      <b>Color:</b> {}
                    </ProductId> */}
                    {/* <ProductColor color={product.color} /> */}
                    {/* <ProductSize>
                      <b>Size:</b> {product.size}
                    </ProductSize> */}
                  </Details>
                </ProductDetail>
                <PriceDetail>
                  <ProductAmountContainer>
                    <Add onClick={() => handleQuantity("inc", product)} />
                    <ProductAmount>Quantity: {product.quantity}</ProductAmount>
                    <Remove onClick={() => handleQuantity("dec", product)} />
                  </ProductAmountContainer>
                  <ProductPrice>
                    ₹ {product.price * product.quantity}
                  </ProductPrice>
                </PriceDetail>
              </Product>
            ))}
            <Hr />
          </Info>
          <Summary>
            <SummaryTitle>ORDER SUMMARY</SummaryTitle>
            <SummaryItem>
              <SummaryItemText>Subtotal</SummaryItemText>
              <SummaryItemPrice> ₹ {cart.total}</SummaryItemPrice>
            </SummaryItem>
            {/* <SummaryItem>
              <SummaryItemText>Estimated Shipping</SummaryItemText>
              <SummaryItemPrice> ₹ 10.90</SummaryItemPrice>
            </SummaryItem> */}
            <SummaryItem>
              <SummaryItemText>Discount</SummaryItemText>
              <SummaryItemPrice>{cart.total > 0 && -discount}</SummaryItemPrice>
            </SummaryItem>
            <SummaryItem type="total">
              <SummaryItemText>Total</SummaryItemText>
              <SummaryItemPrice> ₹ {cart.total - discount} </SummaryItemPrice>
            </SummaryItem>
            <StripeCheckout
              name="Green Grocery"
              image="../favicon.ico"
              billingAddress
              shippingAddress
              description={"Your total is  ₹" + (cart.total - discount)}
              amount={(cart.total - discount) * 100}
              token={onToken}
              stripeKey={KEY}
            >
              <Button>CHECKOUT NOW</Button>
            </StripeCheckout>
          </Summary>
        </Bottom>
      </Wrapper>
      <Footer />
    </Container>
  );
};

export default Cart;
