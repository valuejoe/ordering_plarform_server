const router = require("express").Router();
const { Order, CompletedOrder } = require("../model/Order");
const { orderValidation } = require("../validation");
const verify = require("./verifyToken");

router.get("/", verify, async (req, res) => {
    try {
        const getOrder = await Order.find().sort({ expired: 1 });
        res.send(getOrder);
    } catch (err) {
        res.status(400).send(err);
    }
});

router.get("/completed", verify, async (req, res) => {
    try {
        const getCompleted = await CompletedOrder.find().sort({
            completedAt: -1
        });
        res.send(getCompleted);
    } catch (err) {
        res.status(400).send(err);
    }
});

//add order
router.post("/", async (req, res) => {
    const { error } = orderValidation(req.body);
    if (error)
        return res
            .status(400)
            .send({ [error.details[0].context.key]: error.details[0].message });

    let costSum = 0;
    let countSum = 0;
    req.body.order.map(doc => {
        costSum = doc.cost + costSum;
        countSum = doc.count + countSum;
    });
    const order = new Order({
        order: req.body.order,
        costSum: costSum,
        countSum: countSum
    });
    try {
        const addOrder = await order.save();
        res.status(200).send(addOrder);
    } catch (err) {
        res.status(400).send(err);
    }
});

//complete order
router.post("/completed", verify, async (req, res) => {
    try {
        const orderData = await Order.findOne({ _id: req.body._id });
        if (!orderData)
            return res
                .status(400)
                .send({ message: `order ${req.body._id} not found` });
        const completedOrder = await new CompletedOrder({
            _id: orderData._id,
            order: orderData.order,
            countSum: orderData.countSum,
            costSum: orderData.costSum,
            orderAt: orderData.expired
        }).save();

        const removeOrder = await Order.remove({ _id: req.body._id });

        res.send(completedOrder);
    } catch (err) {
        res.status(400).send(err);
    }
});

module.exports = router;
