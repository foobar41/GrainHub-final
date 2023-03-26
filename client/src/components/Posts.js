import React from 'react';
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

const Posts = ({ posts, loading }) => {
  if (loading) {
    return <h2>Loading...</h2>;
  }

  return (
    // <ul className='list-group mb-4'>
    //   {posts.map(post => (
    //     <li key={post.id} className='list-group-item'>
    //       {post.title}
    //     </li>
    //   ))}
    // </ul>
    <Container>
      {posts
            .slice(0)
            .map((item) => <ProductTile item={item} key={item.id} />)}
    </Container>

  );
};

export default Posts;
