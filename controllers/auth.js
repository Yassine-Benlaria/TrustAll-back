const jwt = require("jsonwebtoken")
const Client = require("../models/client")
const Agent = require("../models/agent")
const AuthAgent = require("../models/auth-agent")
const Admin = require("../models/admin")
const { v1: uuidv1 } = require("uuid");
const { expressjwt: express_jwt } = require("express-jwt");
const crypto = require("crypto")
const { requireMessages, sendResetPasswordEmail } = require("../helpers")
const { getCommunesListByCity } = require("../validators/cities")


//signin
exports.signIn = (req, res) => {

    const msg = requireMessages(req.body.lang);
    let { email, password } = req.body;

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
                                    return res.status(400).json({ err: msg.loginFailed })
                                }
                                //: if authorized-agent exists
                                if (!authAgent.authenticate(password)) {
                                    return res.status(401).json({ err: msg.loginFailed })
                                }
                                //generate signin token
                                const token = jwt.sign({ _id: authAgent._id }, process.env.JWT_SECRET);

                                //token in cookie with expiry date
                                res.cookie("token", token, { expire: new Date() + 9999 });

                                //return response
                                const { _id, first_name, last_name, status, id_uploaded, email } = authAgent;
                                return res.json({ token, user: { _id, first_name, last_name, status, id_uploaded, email, type: "auth-agent" } })
                            })
                        }

                        //: if agent exists
                        else {
                            if (!agent.authenticate(password)) {
                                return res.status(401).json({ err: msg.loginFailed })
                            }
                            //generate signin token
                            const token = jwt.sign({ _id: agent._id }, process.env.JWT_SECRET);

                            //token in cookie with expiry date
                            res.cookie("token", token, { expire: new Date() + 9999 });

                            //return response
                            const { _id, first_name, last_name, status, email } = agent;
                            return res.json({ token, user: { _id, first_name, last_name, status, email, type: "agent" } })

                        }
                    })

                }

                //: if client exists
                else {
                    if (!client.authenticate(password)) {
                        return res.status(401).json({ err: msg.loginFailed })
                    }
                    //generate signin token
                    const token = jwt.sign({ _id: client._id }, process.env.JWT_SECRET);

                    //token in cookie with expiry date
                    res.cookie("token", token, { expire: new Date() + 9999 });

                    //return response
                    const { _id, first_name, last_name, status, email } = client;
                    if (client.status.active == true)
                        return res.json({ token, user: { _id, first_name, last_name, status, email, type: "client" } })
                    return res.status(400).json({ err: "your account is deactivated, please contact support!" })

                }
            })

        }

        //: if admin exists
        else {
            if (!admin.authenticate(password)) {
                return res.status(401).json({ err: msg.loginFailed })
            }
            //generate signin token
            const token = jwt.sign({ _id: admin._id }, process.env.JWT_SECRET);

            //token in cookie with expiry date
            res.cookie("token", token, { expire: new Date() + 9999 });

            //return response
            const { _id, first_name, last_name, email, role } = admin;
            return res.json({ token, user: { _id, first_name, status: { verified: true }, last_name, email, type: "admin", role } })
        }
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
    algorithms: ["HS256"],
    // userProperty: "auth",
})

//Authentication check
exports.isAuth = (req, res, next) => {
    let user = req.profile && req.auth && (req.profile._id == req.auth._id)
    if (!user) {
        return res.status(403).json({
            error: "Access denied, authentication required!!"
        })
    }
    next();
};

//Admin check
exports.isAdmin = (req, res, next) => {
    if (req.profile.type != "admin") {
        return res.status(403).json({
            error: "Access denied!! you are not an admin!!"
        })
    }
    next();
}

//if user is a main-admin
exports.isMainAdmin = (req, res, next) => {
    if (req.profile.role != "main_admin") return res.status(403).json({ error: "Access denied!!" })
    next();
}

//if user is Admin or Auth-agent
exports.isAdminOrAgent = (req, res, next) => {
    if (req.profile.type != "admin" && req.profile.type != "auth-agent") {
        return res.status(403).json({
            error: "Access denied!! You are not authorized to access this route!!"
        })
    }
    next();
}

//Check if account is verified
exports.isVerified = (req, res, next) => {
    if (req.profile.status.verified == false) {
        return res.status(400).json({ err: "Access denied!! this account is not verified!" })
    }

    next();
}

//check if account is active
exports.isActive = (req, res, next) => {
    if (req.profile.status.active == false)
        return res.status(400).json({ err: "Access denied!! this account is deactivated by admin!" })

    next();
}


//Agent check
exports.isAgent = (req, res, next) => {
    if (req.profile.type != "agent") {
        return res.status(403).json({
            error: "Access denied!! you are not an agent!!"
        })
    }
    next();
}

//AuthAgent check
exports.isAuthAgent = (req, res, next) => {
    if (req.profile.type != "auth-agent") {
        return res.status(403).json({
            error: "Access denied!! you are not an autorized agent!!"
        })
    }
    next();
}

//Client check
exports.isClient = (req, res, next) => {

    if (req.profile.type != "client") {
        return res.status(403).json({
            error: "Access denied!! you are not a client!!"
        })
    }
    next();
}

//requesting to reset password
exports.postReset = (req, res) => {
    let messages = requireMessages(req.body.lang);
    crypto.randomBytes(32, (err, buffer) => {
        if (err) res.status(400).json({ err });
        let token = buffer.toString("hex");
        Client.findOne({ email: req.body.email }, (err, user) => {
            if (err || !user) {
                Agent.findOne({ email: req.body.email }, (err, user) => {
                    if (err || !user) {
                        AuthAgent.findOne({ email: req.body.email }, (err, user) => {
                            if (err || !user) {
                                Admin.findOne({ email: req.body.email }, (err, user) => {
                                    if (err || !user) {
                                        return res.status(400).json({ err: messages.noAccountFound });
                                    } else {
                                        user.resetToken = token;
                                        user.resetTokenExpiration = Date.now() + 3600000;
                                        user.save();
                                        //sending email to the user
                                        sendResetPasswordEmail(req.body.email, token);
                                        return res.json({ msg: messages.resetEmailSent })
                                    }
                                })
                            } else {
                                user.resetToken = token;
                                user.resetTokenExpiration = Date.now() + 3600000;
                                user.save();
                                //sending email to the user
                                sendResetPasswordEmail(req.body.email, token);
                                return res.json({ msg: messages.resetEmailSent })
                            }
                        })
                    } else {
                        user.resetToken = token;
                        user.resetTokenExpiration = Date.now() + 3600000;
                        user.save();
                        //sending email to the user
                        sendResetPasswordEmail(req.body.email, token);
                        return res.json({ msg: messages.resetEmailSent })
                    }
                })

            } else {
                user.resetToken = token;
                user.resetTokenExpiration = Date.now() + 3600000;
                user.save();
                //sending email to the user
                sendResetPasswordEmail(req.body.email, token);
                return res.json({ msg: messages.resetEmailSent })
            }
        })
    })
}

//checking password token
exports.checkPasswordToken = (req, res) => {
    let token = req.params.token;
    Client.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } },
        (err, user) => {
            if (err || !user) {
                Agent.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } },
                    (err, user) => {
                        if (err || !user) {
                            AuthAgent.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } },
                                (err, user) => {
                                    if (err || !user) {
                                        Admin.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } },
                                            (err, user) => {
                                                if (err || !user) {
                                                    return res.json({ msg: "false" })
                                                } else return res.json({ msg: "true" })
                                            });
                                    } else return res.json({ msg: "true" })
                                });
                        } else return res.json({ msg: "true" })
                    });
            } else return res.json({ msg: "true" })
        });

}

//reset password
exports.resetPassword = (req, res) => {
    let token = req.body.token,
        salt = uuidv1(),
        hashed_password = crypto
        .createHmac('sha1', salt)
        .update(req.body.password)
        .digest("hex");
    Client.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } }, (err, user) => {
        if (err || !user) {
            Agent.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } }, (err, user) => {
                if (err || !user) {
                    AuthAgent.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } }, (err, user) => {
                        if (err || !user) {
                            Admin.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } }, (err, user) => {
                                if (err || !user) {
                                    res.status(400).json({ err: "error occured while updating password!" })
                                } else {
                                    user.salt = salt;
                                    user.hashed_password = hashed_password;
                                    user.resetToken = undefined;
                                    user.resetTokenExpiration = undefined;
                                    user.save();
                                    return res.json({ msg: "user password have been updated successfully!" })
                                }
                            });
                        } else {
                            user.salt = salt;
                            user.hashed_password = hashed_password;
                            user.resetToken = undefined;
                            user.resetTokenExpiration = undefined;
                            user.save();
                            return res.json({ msg: "user password have been updated successfully!" })
                        }
                    });
                } else {
                    user.salt = salt;
                    user.hashed_password = hashed_password;
                    user.resetToken = undefined;
                    user.resetTokenExpiration = undefined;
                    user.save();
                    return res.json({ msg: "user password have been updated successfully!" })
                }
            });
        } else {
            user.salt = salt;
            user.hashed_password = hashed_password;
            user.resetToken = undefined;
            user.resetTokenExpiration = undefined;
            user.save();
            return res.json({ msg: "user password have been updated successfully!" })
        }
    });
}

//communes by city
exports.communesByCity = (req, res) => {
    let communes = getCommunesListByCity(req.params.city, req.params.lang)

    AuthAgent.find({ city: req.params.city }, { communes: true }, async(err, authAgents) => {
        let occupiedCommunes = []
        authAgents.map(authAgent => {
            authAgent.communes.map(id => occupiedCommunes.push(id))
        })
        console.table(occupiedCommunes)
            // console.log(communes.length)
        communes = await communes.filter(commune => {
                if (!occupiedCommunes.includes(commune.id))
                    return true
            })
            // console.log(communes.length)
        return res.json({
            communes
        })
    })

}