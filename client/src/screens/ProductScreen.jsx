// client/src/screens/ProductScreen.jsx
import { useState } from "react";
import React from "react";
import { FiEdit } from "react-icons/fi";
import { FaTimes } from "react-icons/fa";
import { CiShare1 } from "react-icons/ci";
import { FaRegTrashAlt } from "react-icons/fa";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Row,
  Col,
  Image,
  ListGroup,
  Card,
  Button,
  Form,
  FormGroup, // Corrected import statement
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { FaShoppingCart } from "react-icons/fa";
import Rating from "../components/Rating";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Meta from "../components/Meta";
import Share from "../components/SharePopup";
import {
  useGetProductDetailsQuery,
  useCreateReviewMutation,
  useEditReviewMutation,
  useDeleteReviewMutation,
} from "../slices/productsApiSlice";
import { addToCart } from "../slices/cartSlice";

const ProductScreen = () => {
  const { id: productId } = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // qty = quantity
  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [editingReview, setEditingReview] = useState(null);
  const [editedRating, setEditedRating] = useState(0);
  const [editedComment, setEditedComment] = useState("");
  const [share, setShare] = useState(false);

  const {
    data: product,
    isLoading,
    refetch,
    error,
  } = useGetProductDetailsQuery(productId);

  const [createReview, { isLoading: loadingProductReview }] =
    useCreateReviewMutation();
  const [editReview] = useEditReviewMutation();
  const [deleteReview] = useDeleteReviewMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty }));
    navigate("/cart");
  };

  const handleEditReview = (review) => {
    setEditingReview(review);
    setEditedRating(review.rating);
    setEditedComment(review.comment);
  };

  const deleteReviewHandler = async (review) => {
    if (window.confirm("Are you sure you want to delete your review?")) {
      try {
        const res = await deleteReview({
          productId,
          reviewId: review._id, // Pass the reviewId to the server
        }).unwrap();

        console.log(res);
        toast.success("Review Deleted");
      } catch (error) {
        console.error(error);
        toast.error(error?.data?.message || error.error);
      }
    } else {
      console.log("Deletion canceled");
    }
  };

  const handleShare = () => {
    setShare(!share);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      if (editingReview) {
        // Edit existing review
        const res = await editReview({
          productId,
          rating: editedRating,
          comment: editedComment,
        }).unwrap();

        console.log(res);
        toast.success("Review edited successfully");
      } else {
        // Create new review
        await createReview({
          productId,
          rating,
          comment,
        }).unwrap();
        toast.success("Review submitted");
      }

      refetch();
      setEditingReview(null);
      setEditedRating(0);
      setEditedComment("");
      setComment("");
      setRating(0);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <>
      <Link className="btn btn-light my-3" to="/">
        Go Back
      </Link>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <>
          <Meta title={product.name} />
          <Row>
            <Col md={5}>
              <Image src={product.image} alt={product.name} fluid />
            </Col>
            <Col md={4}>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h3>{product.name}</h3>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Rating
                    value={product.rating}
                    text={`${product.numReviews} reviews`}
                  />
                </ListGroup.Item>
                <ListGroup.Item>Price: ${product.price}</ListGroup.Item>
                <ListGroup.Item>
                  Description: {product.description}
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col md={5}>
                      <Button
                        className="btn btn-sm my-3"
                        style={{ cursor: "pointer" }}
                        onClick={() => setShare(true)}
                      >
                        Share <CiShare1 />
                      </Button>
                    </Col>

                    <Col className="my-3 mx-4">
                      {share && <FaTimes onClick={() => setShare(false)} />}
                    </Col>

                    {share && <Share product />}
                  </Row>
                </ListGroup.Item>
              </ListGroup>
            </Col>
            <Col md={3}>
              <Card>
                <ListGroup>
                  <ListGroup.Item>
                    <Row>
                      <Col>Price:</Col>
                      <Col>
                        <strong>${product.price}</strong>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Status:</Col>
                      <Col>
                        <strong>
                          {product.countInStock > 0
                            ? "In Stock"
                            : "Out Of Stock"}{" "}
                          {/* Corrected typo */}
                        </strong>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  {product.countInStock > 0 && (
                    <ListGroup.Item>
                      <Row>
                        <Col>Qty:</Col>
                        <Col>
                          <Form.Control
                            as="select"
                            value={qty}
                            onChange={(event) =>
                              setQty(Number(event.target.value))
                            }
                          >
                            {[...Array(product.countInStock).keys()].map(
                              (x) => (
                                // create array from this number: product.countInStock and add to all indexes 1
                                <option key={x + 1} value={x + 1}>
                                  {x + 1}
                                </option>
                              )
                            )}
                          </Form.Control>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  )}

                  <ListGroup.Item>
                    <Button
                      className="btn-block"
                      type="button"
                      disabled={product.countInStock === 0}
                      onClick={addToCartHandler}
                    >
                      Add To Cart <FaShoppingCart />
                    </Button>
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>
          </Row>

          <Row className="review">
            <Col md={6}>
              <h2>Reviews</h2>
              {product.reviews.length === 0 && <Message>No Reviews</Message>}

              <ListGroup variant="flush">
                {product.reviews.map((review) => (
                  <ListGroup.Item key={review._id}>
                    <Row>
                      <Col md={7}>
                        <strong>{review.name}</strong>
                        <Rating value={review.rating} />
                        <p>{review.createdAt.substring(0, 10)}</p>{" "}
                        <p>{review.comment}</p>
                      </Col>
                      {userInfo && userInfo._id === review.user && (
                        <>
                          <Col md={1}>
                            <Button
                              className="btn btn-sm d-flex"
                              onClick={() => handleEditReview(review)}
                            >
                              <FiEdit />
                            </Button>
                          </Col>
                          <Col md={1}>
                            <Button
                              className="btn btn-sm d-flex"
                              onClick={() => deleteReviewHandler(review)}
                            >
                              <FaRegTrashAlt />
                            </Button>
                          </Col>
                        </>
                      )}
                    </Row>
                  </ListGroup.Item>
                ))}
                <ListGroup.Item>
                  <h2>Write a Review</h2>

                  {loadingProductReview && <Loader />}

                  {/* check if user is logged in */}
                  {userInfo ? (
                    <Form onSubmit={submitHandler}>
                      <FormGroup controlId="rating" className="my-2">
                        <Form.Label>Rating</Form.Label>
                        <Form.Control
                          as="select"
                          value={editingReview ? editedRating : rating}
                          onChange={(e) =>
                            editingReview
                              ? setEditedRating(Number(e.target.value))
                              : setRating(Number(e.target.value))
                          }
                        >
                          <option value="">Select...</option>
                          <option value="1">1 - Poor</option>
                          <option value="2">2 - Fair</option>
                          <option value="3">3 - Good</option>
                          <option value="4">4 - Very Good</option>
                          <option value="5">5 - Excellent</option>{" "}
                          {/* Corrected typo */}
                        </Form.Control>
                      </FormGroup>

                      <FormGroup controlId="comment" className="my-2">
                        <Form.Label>Comment</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          value={editingReview ? editedComment : comment}
                          onChange={(e) =>
                            editingReview
                              ? setEditedComment(e.target.value)
                              : setComment(e.target.value)
                          }
                        />
                      </FormGroup>
                      <Button
                        type="submit"
                        disabled={loadingProductReview}
                        variant="primary"
                      >
                        {editingReview ? "Edit Review" : "Submit"}
                      </Button>
                    </Form>
                  ) : (
                    <Message>
                      Please <Link to="/login">sing in</Link> to write a review
                    </Message>
                  )}
                </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default ProductScreen;
