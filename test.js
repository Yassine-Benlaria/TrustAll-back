const chargily = require('chargily-epay-gateway')
const dotenv = require('dotenv')
const { Invoice, Mode } = require("chargily-epay-gateway/lib/configuration");

dotenv.config()

const order = new Invoice()
order.invoiceNumber = "100" // must be integer or string
order.mode = Mode.EDAHABIA // or Mode.CIB
order.backUrl = "https://www.exemple.org/" // must be a valid and active URL
order.amount = 5000 // must be integer , and more or equal 75
order.webhookUrl = "https://www.exemple.org/webhook-validator" // this URL where receive the response 
order.client = "chawki mahdi"
order.discount = 10 // by percentage between [0, 100]
order.clientEmail = "client@example.com" // email of customer where he will receive the Bill
order.appKey = process.env.CHARGILY_APP_KEY

// createPayment is promise function (async, await ), so you will need to use then to receive the checkoutURL

const checkoutUrl = chargily.createPayment(order).then(res => {
    console.log(checkout_url)
    return res.checkout_url // redirect to this url to proccess the checkout 
})