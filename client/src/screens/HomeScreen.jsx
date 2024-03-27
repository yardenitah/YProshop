// client/src/screens/HomeScreen.jsx
import React from "react";
import { Row, Col } from "react-bootstrap";
import { useParams } from "react-router-dom";
import Product from "../components/Product";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Paginate from "../components/Paginate";
import { useGetProductsQuery } from "../slices/productsApiSlice";
import { Link } from "react-router-dom";
import ProductCarousel from "../components/ProductCarousel";

const HomeScreen = () => {
  const { pageNumber, keyword } = useParams();
  const { data, isLoading, error } = useGetProductsQuery({
    keyword,
    pageNumber,
  });

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <>
          {!keyword && <ProductCarousel />}
          <h1 key={0}>Latest Products</h1>
          <Row>
            {data.products.map((product) => (
              <Col key={product._id} xs={6} sm={6} md={6} lg={4} xl={3}>
                <Product product={product} />
              </Col>
            ))}
          </Row>
          <Paginate pages={data.pages} keyword={keyword ? keyword : ""} />
        </>
      )}
      {keyword && (
        <Link to="/" className="btn btn-light my-3">
          Go Back
        </Link>
      )}
    </>
  );
};

export default HomeScreen;
