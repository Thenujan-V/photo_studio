const express = require('express')
const cors = require('cors')
const clientRoutes = require('./routes/clientRoute')
const serviceRoutes = require('./routes/serviceRouter')
const cartRoutes = require('./routes/cartRouter')
const feedbackRoutes = require('./routes/feedBackRouter')

const path = require('path')


const app = express()
const PORT = 3000

app.use(express.json())
app.use(cors({
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}))

app.use('/api/client', clientRoutes)
app.use('/api/services', serviceRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/feedback', feedbackRoutes)

app.use('/uploads', express.static(path.join(__dirname, '../uploads')))













app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});