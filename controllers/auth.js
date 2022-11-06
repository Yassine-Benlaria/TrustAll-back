const jwt = require("jsonwebtoken")
const Client = require("../models/client")
const Agent = require("../models/agent")
const AuthAgent = require("../models/auth-agent")
const Admin = require("../models/admin")
const { expressjwt: express_jwt } = require("express-jwt");

exports.signIn = (req, res) => {
    let { email, password } = req.body

    //!admin
    Admin.findOne({ email }, (err, admin) => {
        if (err || !admin) {

            //!client
            let { email, password } = req.body;
            Client.findOne({ email }, (err, client) => {
                if (err || !client) {
                    //!agent
                    let { email, password } = req.body
                    Agent.findOne({ email }, (err, agent) => {
                        if (err || !agent) {
                            //! authorized agent
                            let { email, password } = req.body
                            AuthAgent.findOne({ email }, (err, authAgent) => {
                                if (err || !authAgent) {
                                    res.status(400).json({ err: "can't find any account with this email!" })
                                }
                                //: if authorized-agent exists
                                if (!authAgent.authenticate(password)) {
                                    return res.status(401).json({ err: "email and password doesn't match!" })
                                }
                                //generate signin token
                                const token = jwt.sign({ _id: authAgent._id }, process.env.JWT_SECRET);

                                //token in cookie with expiry date
                                res.cookie("token", token, { expire: new Date() + 9999 });

                                //return response
                                const { _id, first_name, last_name, email } = authAgent;
                                return res.json({ token, user: { _id, first_name, last_name, email, type: "auth_agent" } })
                            })
                        }

                        //: if agent exists
                        if (!agent.authenticate(password)) {
                            return res.status(401).json({ err: "email and password doesn't match!" })
                        }
                        //generate signin token
                        const token = jwt.sign({ _id: agent._id }, process.env.JWT_SECRET);

                        //token in cookie with expiry date
                        res.cookie("token", token, { expire: new Date() + 9999 });

                        //return response
                        const { _id, first_name, last_name, email } = agent;
                        return res.json({ token, user: { _id, first_name, last_name, email, type: "agent" } })

                    })

                }

                //: if client exists
                if (!client.authenticate(password)) {
                    return res.status(401).json({ err: "email and password doesn't match!" })
                }
                //generate signin token
                const token = jwt.sign({ _id: client._id }, process.env.JWT_SECRET);

                //token in cookie with expiry date
                res.cookie("token", token, { expire: new Date() + 9999 });

                //return response
                const { _id, first_name, last_name, email } = client;
                return res.json({ token, user: { _id, first_name, last_name, email, type: "client" } })

            })

        }

        //: if admin exists
        if (!admin.authenticate(password)) {
            return res.status(401).json({ err: "email and password doesn't match!" })
        }
        //generate signin token
        const token = jwt.sign({ _id: admin._id }, process.env.JWT_SECRET);

        //token in cookie with expiry date
        res.cookie("token", token, { expire: new Date() + 9999 });

        //return response
        const { _id, first_name, last_name, email } = admin;
        return res.json({ token, user: { _id, first_name, last_name, email, type: "admin" } })
    })
}


//signout
exports.signout = (req, res) => {
    res.clearCookie("token");
    res.json({ message: "Signed out" });
}

//requireSignin
exports.requireSignin = express_jwt({
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"]
})

//Authentication check
exports.isAuth = (req, res, next) => {
    let user = req.profile && req.auth && (req.auth._id == req.auth._id)

    if (!user) {
        return res.status(403).json({
            error: "Access denied!!"
        })
    }
    next();
};

//Admin check
exports.isAdmin = (req, res) => {
    if (req.profile.type != "admin") {
        return res.status(403).json({
            error: "Access denied!! you are not an admin!!"
        })
    }
}

//Admin check
exports.isAgent = (req, res) => {
        if (req.profile.type != "agent") {
            return res.status(403).json({
                error: "Access denied!! you are not an agent!!"
            })
        }
    }
    //Admin check
exports.isAuthAgent = (req, res) => {
        if (req.profile.type != "auth-agent") {
            return res.status(403).json({
                error: "Access denied!! you are not an autorized agent!!"
            })
        }
    }
    //Admin check
exports.isClient = (req, res) => {
    if (req.profile.type != "client") {
        return res.status(403).json({
            error: "Access denied!! you are not a client!!"
        })
    }
}