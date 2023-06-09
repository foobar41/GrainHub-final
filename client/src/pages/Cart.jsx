import { Add, Remove } from "@material-ui/icons";
import DeleteIcon from "@material-ui/icons/Delete";
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
import { updateQuantity } from "../redux/cartRedux";
import { removeProduct } from "../redux/cartRedux";
import { Link } from "react-router-dom";
import axios from "axios";

// import { useLocation } from "react-router-dom";
// import { useEffect, useState } from "react";
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

const EmptyCart = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
`;

const EmptyCartText = styled.h2`
  font-size: 24px;
  font-weight: 500;
  text-align: center;
`;

const EmptyCartButton = styled.button`
  padding: 10px;
  margin: 10px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  background-color: black;
  color: white;
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

const PriceDetail = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const ProductAmountContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 10px;
`;

const HandleQuantity = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  cursor: pointer;
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

const RemoveProduct = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 20px 60px 20px 20px;
  cursor: pointer;
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
  cursor: pointer;
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

  const updateProductsQuantity = async () => {
    console.log("Updating product quantities started")
    try {
      for (let i = 0; i < cart.products.length; i++) {
        const product = cart.products[i];
        const updatedStock = product.in_stock - product.quantity;

        await axios.put(
          `http://localhost:5000/api/products/update/${product._id}`,
          {
            in_stock: updatedStock
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("userToken")}`
            }
          }
        );
      }
      console.log("Product quantities updated successfully");
    } catch (error) {
      console.log("Error updating product quantities: ", error);
    }
  };

  // const processOrder = async () => {
  //   console.log("order started")
  //   try {
  //     const res = await userRequest.post("http://localhost:5000/api/orders", {
  //       products: cart.products,
  //       userId: currentUser._id,
  //       // tokenId: stripeToken.id,
  //       address: stripeToken.card.address_line1 + " " + stripeToken.card.address_city + " " + stripeToken.card.address_zip,
  //       amount: (cart.total - discount),
  //     }, {
  //       headers: {
  //         Authorization: `Bearer ${currentUser.accessToken}`
  //       }
  //     });
  //     history.push("/success/" + res.data._id, {
  //       stripeData: res.data,
  //       products: cart,
  //     });
  //     console.log("order done")
  //     setOrderId(res);
  //     await updateProductsQuantity()
  //   } catch {
  //     console.log("error processing order");
  //   }
  // }

  // const makePayment = async () => {
  //   console.log("payment started")
  //   try {
  //     await userRequest.post("http://localhost:5000/api/checkout/payment", {
  //       tokenId: stripeToken.id,
  //       amount: (cart.total - discount),
  //     });
  //     console.log("payment done")
  //     await processOrder()
  //   } catch {
  //     console.log("error in payment");
  //   }
  // }

  const makeRequest = async () => {
    try {
      const res = await userRequest.post("http://localhost:5000/api/orders", {
        products: cart.products,
        userId: currentUser._id,
        // tokenId: stripeToken.id,
        address: stripeToken.card.address_line1 + " " + stripeToken.card.address_city + " " + stripeToken.card.address_zip,
        amount: (cart.total - discount),
      }, {
        headers: {
          Authorization: `Bearer ${currentUser.accessToken}`
        }
      });
      history.push("/success/" + res.data._id, {
        stripeData: res.data,
        products: cart,
      });
      setOrderId(res);
    } catch {
      console.log("error processing order");
    }
    try {
      await userRequest.post("http://localhost:5000/api/checkout/payment", {
        tokenId: stripeToken.id,
        amount: (cart.total - discount),
      });
    } catch {
      console.log("error in payment");
    }
    // clearCart(dispatch);
    dispatch(delCart());
    updateProductsQuantity();
  };

  useEffect(() => {
    stripeToken && makeRequest();
  }, [cart, stripeToken, cart.total, history]);

  const handleQuantity = (type, prod) => {
    if (type === "dec") {
      const newQuantity = prod.quantity - 1
      dispatch(updateQuantity({ name: prod.name, quantity: newQuantity }));
      return;
    }
    if (type === "inc" && prod.quantity + 1 <= prod.in_stock) {
      const newQuantity = prod.quantity + 1
      dispatch(updateQuantity({ name: prod.name, quantity: newQuantity }));
      return;
    } else {
      alert(`Product out of stock\nOnly ${prod.in_stock} left`)
      return;
    }
  }

  const handleDelProduct = (prod) => {
    dispatch(removeProduct({ name: prod.name }));
  }

  return (
    <Container>
      <Navbar />
      <Announcement />
      <Wrapper>
        <Title>YOUR BAG</Title>
        <Top>
          <Link to="/">
            <TopButton type="filled">CONTINUE SHOPPING</TopButton>
          </Link>
          <TopButton type="filled" onClick={delClick}>Delete Cart</TopButton>
        </Top>
        <Bottom>
          <Info>
            {cart.total == 0 && <EmptyCart>
              <EmptyCartText>YOUR SHOPPING BAG IS EMPTY</EmptyCartText>
              <Link to='/'>
                <EmptyCartButton>Go shop some items</EmptyCartButton>
              </Link>
            </EmptyCart>}
            {cart.products.map((product) => (
              <Product key={product}>
                <ProductDetail>
                  <Image src={product.image} />
                  <Details>
                    <ProductName>
                      <b>Product:</b> {product.name}
                    </ProductName>
                  </Details>
                </ProductDetail>
                <PriceDetail>
                  <ProductAmountContainer>
                    <ProductAmount>Quantity: {product.quantity}</ProductAmount>
                    <HandleQuantity>
                      <Add onClick={() => handleQuantity("inc", product)} />
                      {product.quantity > 1 && <Remove onClick={() => handleQuantity("dec", product)} />}
                    </HandleQuantity>
                  </ProductAmountContainer>
                  <ProductPrice>
                    ₹ {product.price * product.quantity}
                  </ProductPrice>
                </PriceDetail>
                <RemoveProduct>
                  <DeleteIcon onClick={() => handleDelProduct(product)} />
                </RemoveProduct>
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
            <SummaryItem>
              <SummaryItemText>Discount</SummaryItemText>
              <SummaryItemPrice>{cart.total > 0 && -discount}</SummaryItemPrice>
            </SummaryItem>
            <SummaryItem type="total">
              <SummaryItemText>Total</SummaryItemText>
              {cart.total > 0 && <SummaryItemPrice> ₹ {cart.total - discount} </SummaryItemPrice>}
            </SummaryItem>
            {cart.total > 0 && <StripeCheckout
              name="GrainHub"
              image="../favicon.ico"
              billingAddress
              shippingAddress
              description={"Your total is  ₹" + (cart.total - discount)}
              amount={(cart.total - discount) * 100}
              token={onToken}
              stripeKey={KEY}
              currency="INR"
            >
              <Button>CHECKOUT NOW</Button>
            </StripeCheckout>}
          </Summary>
        </Bottom>
      </Wrapper>
      <Footer />
    </Container>
  );
};

export default Cart;
