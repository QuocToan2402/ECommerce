import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Axios from 'axios';
import { detailsProduct, updateProduct } from '../actions/productActions';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { PRODUCT_UPDATE_RESET } from '../constants/productConstants';

export default function ProductEditScreen(props) {
    const productId = props.match.params.id;//get id from urls
    const [name, setName] = useState('');//hook for product info
    const [price, setPrice] = useState('');
    const [image, setImage] = useState('');
    const [category, setCategory] = useState('');
    const [countInStock, setCountInStock] = useState('');
    const [brand, setBrand] = useState('');
    const [description, setDescription] = useState('');
    const userSignin = useSelector((state) => state.userSignin);
    const { userInfo } = userSignin;

    const productDetails = useSelector((state) => state.productDetails);//get info from react-redux
    const { loading, error, product } = productDetails;//get state of action

    const productUpdate = useSelector((state) => state.productUpdate);
    const {
        loading: loadingUpdate,
        error: errorUpdate,
        success: successUpdate,
    } = productUpdate;

    const dispatch = useDispatch();
    useEffect(() => {
        if (successUpdate) {//update success reset info
            if(userInfo.isAdmin === true){
                props.history.push('/productlist');//push new info to list product
            }
            else if(userInfo.isSeller === true){
                props.history.push('/productlist/seller');//push new info to list product
            }
        }
        if (!product || product._id !== productId || successUpdate) {//
            dispatch({ type: PRODUCT_UPDATE_RESET });//if update success reset info
            dispatch(detailsProduct(productId));
        } else {
            setName(product.name);
            setPrice(product.price);
            setImage(product.image);
            setCategory(product.category);
            setCountInStock(product.countInStock);
            setBrand(product.brand);
            setDescription(product.description);
        }
    }, [product, dispatch, productId, successUpdate, props.history]);

    const submitHandler = (e) => {
        e.preventDefault();
        // TODO: dispatch update product
        dispatch(
            updateProduct({//redirect user after update
                _id: productId,
                name,
                price,
                image,
                category,
                brand,
                countInStock,
                description,
            })
        );
    };
    const [loadingUpload, setLoadingUpload] = useState(false);
    const [errorUpload, setErrorUpload] = useState('');
    const uploadFileHandler = async (e) => {
        const file = e.target.files[0];
        const bodyFormData = new FormData();
        bodyFormData.append('image', file);
        setLoadingUpload(true);
        try {
            const { data } = await Axios.post('/api/uploads', bodyFormData, {//data from upload api
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${userInfo.token}`,
                },
            });
            setImage(data);//set date
            setLoadingUpload(false);//set effect loading
        } catch (error) {
            setErrorUpload(error.message);
            setLoadingUpload(false);
        }
    };
    return (
        <div>
            <form className="form" onSubmit={submitHandler}>
                <div>
                    <h1>Ch???nh s???a th??ng tin s???n ph???m {productId}</h1>
                </div>
                {loadingUpdate && <LoadingBox></LoadingBox>}
                {errorUpdate && <MessageBox variant="danger">{errorUpdate}</MessageBox>}
                {loading ? (
                    <LoadingBox></LoadingBox>
                ) : error ? (
                    <MessageBox variant="danger">{error}</MessageBox>
                ) : (
                    <>
                        <div>
                            <label htmlFor="name">T??n</label>
                            <input
                                id="name"
                                type="text"
                                placeholder="t??n"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            ></input>
                        </div>
                        <div>
                            <label htmlFor="price">Gi??</label>
                            <input
                                id="price"
                                type="text"
                                placeholder="gi??"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                            ></input>
                        </div>
                        <div>
                            <label htmlFor="image">???nh minh h???a</label>
                            <input
                                id="image"
                                type="text"
                                placeholder="???nh"
                                value={image}
                                onChange={(e) => setImage(e.target.value)}
                            ></input>
                        </div>
                        <div>
                            <label htmlFor="imageFile">File ???nh</label>
                            <input
                                type="file"
                                id="imageFile"
                                label="Choose Image"
                                onChange={uploadFileHandler}
                            ></input>
                            {loadingUpload && <LoadingBox></LoadingBox>}
                            {errorUpload && (
                                <MessageBox variant="danger">{errorUpload}</MessageBox>
                            )}
                        </div>
                        <div>
                            <label htmlFor="category">Lo???i s???n ph???m</label>
                            <input
                                id="category"
                                type="text"
                                placeholder="lo???i"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            ></input>
                        </div>
                        <div>
                            <label htmlFor="brand">Ng?????i b??n</label>
                            <input
                                id="brand"
                                type="text"
                                placeholder="Ng?????i b??n"
                                value={product.seller.seller.name}
                                onChange={(e) => setBrand(e.target.value)}
                            ></input>
                        </div>
                        <div>
                            <label htmlFor="countInStock">S??? l?????ng</label>
                            <input
                                id="countInStock"
                                type="text"
                                placeholder="S??? l?????ng"
                                value={countInStock}
                                onChange={(e) => setCountInStock(e.target.value)}
                            ></input>
                        </div>
                        <div>
                            <label htmlFor="description">Mi??u t???</label>
                            <textarea
                                id="description"
                                rows="3"
                                type="text"
                                placeholder="mi??u t???"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            ></textarea>
                        </div>
                        <div>
                            <label></label>
                            <button className="primary" type="submit">
                                C???p nh???t
                            </button>
                        </div>
                    </>
                )}
            </form>
        </div>
    );
}
