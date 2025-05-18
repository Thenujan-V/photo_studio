const express = require('express')
const cors = require('cors')
const clientRoutes = require('./routes/clientRoute')
const serviceRoutes = require('./routes/serviceRouter')
const cartRoutes = require('./routes/cartRouter')
const feedbackRoutes = require('./routes/feedBackRouter')
const ordersRoutes = require('./routes/orderRouter')
const inquiryRoutes = require('./routes/inquiryRoute')
const paymentRoutes = require('./routes/paymentRouter')
const emailRoutes = require('./routes/emailRoute')
const invoiceRoutes = require('./routes/invoiceRouter')
const path = require('path')


const app = express()
const PORT = process.env.PORT

app.use(express.json())
app.use(cors())

app.use('/api/client', clientRoutes)
app.use('/api/services', serviceRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/feedback', feedbackRoutes)
app.use('/api/orders', ordersRoutes)
app.use('/api/inquiry', inquiryRoutes)
app.use('/api/payment', paymentRoutes)
app.use('/api/email', emailRoutes);
app.use('/api/invoice', invoiceRoutes);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')))





app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});