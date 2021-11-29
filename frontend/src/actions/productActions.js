import Axios from "axios";
import {
  PRODUCT_CREATE_FAIL,
  PRODUCT_CREATE_REQUEST,
  PRODUCT_CREATE_SUCCESS,
  PRODUCT_DELETE_FAIL,
  PRODUCT_DELETE_REQUEST,
  PRODUCT_DELETE_SUCCESS,
  PRODUCT_DETAILS_FAIL,
  PRODUCT_DETAILS_REQUEST,
  PRODUCT_DETAILS_SUCCESS,
  PRODUCT_LIST_FAIL,
  PRODUCT_LIST_REQUEST,
  PRODUCT_LIST_SUCCESS,
  PRODUCT_UPDATE_FAIL,
  PRODUCT_UPDATE_REQUEST,
  PRODUCT_UPDATE_SUCCESS,
} from "../constants/productConstants";

export const listProducts = () => async (dispatch) => {
  // return function
  dispatch({
    type: PRODUCT_LIST_REQUEST,
  });
  try {
    //fetch data from backend
    const { data } = await Axios.get("/api/products"); //sending ajax to get list products, dùng axios
    dispatch({ type: PRODUCT_LIST_SUCCESS, payload: data }); //success, return data, change state of redux, update screen
  } catch (error) {
    dispatch({ type: PRODUCT_LIST_FAIL, payload: error.message }); //false, return message.
  }
};
//get detail product by ID, same get list products
export const detailsProduct = (productId) => async (dispatch) => {
  dispatch({ type: PRODUCT_DETAILS_REQUEST, payload: productId });
  try {
    const { data } = await Axios.get(`/api/products/${productId}`); //axios return a promise, so must to use await
    dispatch({ type: PRODUCT_DETAILS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: PRODUCT_DETAILS_FAIL,
      payload:
        error.response && error.response.data.message //have error, render message
          ? error.response.data.message
          : error.message,
    });
  }
};

//create new product
export const createProduct = () => async (dispatch, getState) => {
  dispatch({ type: PRODUCT_CREATE_REQUEST });
  const { userSignin: { userInfo }, } = getState();
  try {
    const { data } = await Axios.post('/api/products', {}, {
      headers: { Authorization: `Bearer ${userInfo.token}` },
    }
    );
    dispatch({ type: PRODUCT_CREATE_SUCCESS, payload: data.product, });
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    dispatch({ type: PRODUCT_CREATE_FAIL, payload: message });
  }
};

//admin update product
export const updateProduct = (product) => async (dispatch, getState) => {
  dispatch({ type: PRODUCT_UPDATE_REQUEST, payload: product });
  const {
    userSignin: { userInfo },//get user info from signin
  } = getState();
  try {
    //data delete by id
    const { data } = await Axios.put(`/api/products/${product._id}`, product, {
      //get author from token
      headers: { Authorization: `Bearer ${userInfo.token}` },//get user info response
    });
    dispatch({ type: PRODUCT_UPDATE_SUCCESS, payload: data });
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    dispatch({ type: PRODUCT_UPDATE_FAIL, error: message });
  }
};
//admin delete product
export const deleteProduct = (productId) => async (dispatch, getState) => {
  dispatch({ type: PRODUCT_DELETE_REQUEST, payload: productId });
  const {
    userSignin: { userInfo },
  } = getState();
  try {
    const { data } = Axios.delete(`/api/products/${productId}`, {
      headers: { Authorization: `Bearer ${userInfo.token}` },
    });
    dispatch({ type: PRODUCT_DELETE_SUCCESS });
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    dispatch({ type: PRODUCT_DELETE_FAIL, payload: message });
  }
};