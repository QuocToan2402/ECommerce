import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { createReview, detailsProduct } from '../actions/productActions';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import Rating from '../components/Rating';
import { PRODUCT_REVIEW_CREATE_RESET } from '../constants/productConstants';

export default function ProductScreen(props) {
  const dispatch = useDispatch(); //define, use hook
  const productId = props.match.params.id; //define ID of product
  const productDetails = useSelector((state) => state.productDetails);
  const { loading, error, product } = productDetails; //define state of load detail product
  const [qty, setQty] = useState(1); //default value is 1
  //review product
  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;

  const productReviewCreate = useSelector((state) => state.productReviewCreate);
  const {
    loading: loadingReviewCreate,
    error: errorReviewCreate,
    success: successReviewCreate,
  } = productReviewCreate;

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  useEffect(() => {
    if (successReviewCreate) {//create success
      window.alert('Review Submitted Successfully');
      setRating('');//set data in input 
      setComment('');
      dispatch({ type: PRODUCT_REVIEW_CREATE_RESET });//reset data
    }
    dispatch(detailsProduct(productId));
  }, [dispatch, productId, successReviewCreate]);
  const addToCartHandler = () => {
    //redirect user to cart screen.
    props.history.push(`/cart/${productId}?qty=${qty}`);//dynamic urls
  };
  const submitHandler = (e) => {
    e.preventDefault();
    if (comment && rating) {
      dispatch(
        createReview(productId, { rating, comment, name: userInfo.name })
      );
    } else {
      alert('Please enter comment and rating');
    }
  };
  return (
    <div>
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <div>
          <Link to="/" className='lablepad'>Tr??? v???</Link>
          <div className="row top">
            <div className="col-2">
              <img
                className="large"
                src={product.image}
                alt={product.name}
              ></img>
            </div>
            <div className="col-1">
              <ul>
                <li>
                  <h1>{product.name}</h1>
                </li>
                <li>
                  <Rating
                    rating={product.rating}
                    numReviews={product.numReviews}
                  ></Rating>
                </li>
                <li>Gi?? : ${product.price}</li>
                <li>
                  M?? t??? s???n ph???m:
                  <p>{product.description}</p>
                </li>
              </ul>
            </div>
            <div className="col-1">
              <div className="card card-body">
                <ul>
                  <li>
                    Ng?????i b??n{' '}
                    <h2>
                      <Link to={`/seller/${product.seller._id}`}>
                        {product.seller.seller.name}
                      </Link>
                    </h2>
                    <Rating
                      rating={product.seller.seller.rating}
                      numReviews={product.seller.seller.numReviews}
                    ></Rating>
                  </li>
                  <li>
                    <div className="row">
                      <div>Gi??</div>
                      <div className="price">${product.price}</div>
                    </div>
                  </li>
                  <li>
                    <div className="row">
                      <div>T??nh tr???ng</div>
                      <div>
                        {product.countInStock > 0 ? (
                          <span className="success">C??n h??ng</span>
                        ) : (
                          <span className="danger">H???t h??ng</span>
                        )}
                      </div>
                    </div>
                  </li>

                  {product.countInStock > 0 && (
                    <>
                      <li>
                        <div className="row">
                          <div>S??? l?????ng </div>
                          <div>
                            <select
                              value={qty}
                              onChange={(e) => setQty(e.target.value)}
                            >
                              {[...Array(product.countInStock).keys()].map(
                                (x) => (
                                  <option key={x + 1} value={x + 1}>
                                    {x + 1}
                                  </option>
                                )
                              )}
                            </select>
                          </div>
                        </div>
                      </li>
                      <li>
                        <button
                          onClick={addToCartHandler}
                          className="primary block"
                        >
                          Th??m v??o gi??? h??ng
                        </button>
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>
          <div>
            <h2 id="reviews" className='margin4'>Reviews</h2>
            {product.reviews.length === 0 && (
              <MessageBox>Hi???n t???i kh??ng c?? nh???n x??t n??o</MessageBox>
            )}
            <ul>
              {product.reviews.map((review) => (
                <li key={review._id} className='margin5'>
                  <strong>{review.name}</strong>
                  <Rating rating={review.rating} caption=" "></Rating>
                  <p>{review.createdAt.substring(0, 10)}</p>
                  <p>{review.comment}</p>
                </li>
              ))}
              <li>
                {userInfo ? (
                  <form className="form" onSubmit={submitHandler}>
                    <div>
                      <h2 className='custom-title'>Vi???t nh???n x??t</h2>
                    </div>
                    <div>
                      <label htmlFor="rating">????nh gi??</label>
                      <select
                        id="rating"
                        value={rating}
                        onChange={(e) => setRating(e.target.value)}
                      >
                        <option value="">Ch???n...</option>
                        <option value="1">1 - T???</option>
                        <option value="2">2 - B??nh th?????ng</option>
                        <option value="3">3 - T???t</option>
                        <option value="4">4 - R???t t???t</option>
                        <option value="5">5 - Tuy???t v???i</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="comment">Nh???n x??t</label>
                      <textarea
                        id="comment"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        rows="4" cols="50"
                      ></textarea>
                    </div>
                    <div>
                      <label />
                      <button className="primary" type="submit">
                        G???i
                      </button>
                    </div>
                    <div>
                      {loadingReviewCreate && <LoadingBox></LoadingBox>}
                      {errorReviewCreate && (
                        <MessageBox variant="danger">
                          {errorReviewCreate}
                        </MessageBox>
                      )}
                    </div>
                  </form>
                ) : (
                  <MessageBox>
                    Vui l??ng <Link to="/signin">????ng nh???p</Link> ????? vi???t nh???n x??t
                  </MessageBox>
                )}
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}