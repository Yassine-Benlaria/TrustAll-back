const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan")
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const expressValidator = require("express-validator")
const cors = require("cors");


require("dotenv").config();

//import routes
const clientRoutes = require("./routes/client")
const adminRoutes = require("./routes/admin")
const agentRoutes = require("./routes/agent")
const authRoutes = require("./routes/auth")

//app
const app = express();


//db connection
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
}).then(() => console.log("DataBase Connected!!"));

//middlwares
app.use(cors());
app.use(morgan("dev"))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(expressValidator())


//routes middlware
app.use("/api/client", clientRoutes)
app.use("/api/admin", adminRoutes)
app.use("/api/agent", agentRoutes)
app.use("/api", authRoutes)






const port = process.env.PORT || 8000;

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
});