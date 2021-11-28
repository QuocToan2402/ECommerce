import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Order from '../models/orderModel.js';
import { isAuth } from '../utils.js';

const orderRouter = express.Router();

orderRouter.post('/', isAuth, expressAsyncHandler(async (req, res) => {//use middleware to check author user
    if (req.body.orderItems.length === 0) {
        res.status(400).send({ message: 'Cart is empty' });
    } else {
        const order = new Order({//create new order
            orderItems: req.body.orderItems,
            shippingAddress: req.body.shippingAddress,
            paymentMethod: req.body.paymentMethod,
            itemsPrice: req.body.itemsPrice,
            shippingPrice: req.body.shippingPrice,
            taxPrice: req.body.taxPrice,
            totalPrice: req.body.totalPrice,
            user: req.user._id,//get user id from middleware to save in new obj
        });
        const createdOrder = await order.save();
        res
            .status(201)
            .send({ message: 'New Order Created', order: createdOrder });//response message, create new order
    }
})
);
//only author user can access to detail order
orderRouter.get('/:id', isAuth, expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);//order id
    if (order) {
        res.send(order);
    } else {
        res.status(404).send({ message: 'Order Not Found' });
    }
})
);

//update status of order, only access user can add payment
orderRouter.put('/:id/pay', isAuth, expressAsyncHandler(async (req, res) => {
        const order = await Order.findById(req.params.id);//find by id get from url
        if (order) {//if have order
            //set info of order
            order.isPaid = true;
            order.paidAt = Date.now();
            order.paymentResult = {
                //info from paypal
                id: req.body.id,
                status: req.body.status,
                update_time: req.body.update_time,
                email_address: req.body.email_address,
            };
            const updatedOrder = await order.save();//update info
            res.send({ message: 'Order Paid', order: updatedOrder });
        } else {
            //send error
            res.status(404).send({ message: 'Order Not Found' });
        }
    })
);

export default orderRouter;