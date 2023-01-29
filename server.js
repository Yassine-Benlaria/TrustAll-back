const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan")
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const expressValidator = require("express-validator")
const cors = require("cors");
const limiter = require("./middleware/rate-limiter")


require("dotenv").config();

//import routes
const clientRoutes = require("./routes/client"),
    adminRoutes = require("./routes/admin"),
    agentRoutes = require("./routes/agent"),
    authAgentRoutes = require("./routes/auth-agent"),
    authRoutes = require("./routes/auth"),
    commandRoutes = require("./routes/command"),
    planRoutes = require("./routes/plan"),
    bloggerRoutes = require("./routes/blogger");

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
app.use(limiter)


//routes middlware
app.use("/api/client", clientRoutes)
app.use("/api/admin", adminRoutes)
app.use("/api/auth-agent", authAgentRoutes)
app.use("/api/agent", agentRoutes)
app.use("/api", authRoutes)
app.use("/api/command", commandRoutes)
app.use("/api/plan", planRoutes)
app.use("/api/blogger", bloggerRoutes)

const port = process.env.PORT || 8000;



app.listen(port, () => {
    console.log(`Server running on port ${port}`)
});

//testing deploy to vercel
module.exports = app;