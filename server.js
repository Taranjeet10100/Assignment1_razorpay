const express = require("express");
const app = express();
const Razorpay = require("razorpay");
const bodyParser = require('body-parser')
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

var options = {
    explorer: true
  };

let instance = new Razorpay({
    key_id: 'rzp_test_d3fIdfEXIFhpGY', // your `KEY_ID`
    key_secret: 'gd2JEZV6IywEDS4acns57Vpv' // your `KEY_SECRET`
})

// app.use(express.static(pathToSwaggerUi));
app.use('/web', express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, options));


app.post("/api/payment/order", async (req, res) => {
    console.log("instance : ", instance);
    params = req.body;
    console.log("params :", params);
    await instance.orders.create(params).then((data) => {
        console.log("data", data);
        res.send({ "sub": data, "status": "success" });
    }).catch((error) => {
        console.log(error);
        res.send({ "sub": error, "status": "failed" });
    })
});


app.post("/api/payment/verify", (req, res) => {
    body = req.body.razorpay_order_id + "|" + req.body.razorpay_payment_id;
    const crypto = require("crypto");
    var expectedSignature = crypto.createHmac('sha256', 'gd2JEZV6IywEDS4acns57Vpv')
        .update(body.toString())
        .digest('hex');
    console.log("sig" + req.body.razorpay_signature);
    console.log("sig" + expectedSignature);
    var response = { "status": "failure" }
    if (expectedSignature === req.body.razorpay_signature)
        response = { "status": "success" }
    res.send(response);
});


app.listen("3000", () => {
    console.log("server running at port 3000");
})