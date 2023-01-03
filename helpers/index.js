var nodemailer = require('nodemailer');

exports.generateConfirmationCode = () => {
    let code = ""
    for (var ii = 0; ii < 6; ii++) {
        code += Math.floor(Math.random() * 10);
    }
    return code
}
const logo_url = "https://prickly-beanie-fox.cyclic.app/api/logo"


//sending emails
var transporter = nodemailer.createTransport({
    // host: 'smtp.mail.yahoo.com',
    host: 'smtp.gmail.com',
    // port: 465,
    // service: 'yahoo',
    service: 'gmail',
    secure: false,
    auth: {
        // user: 'ehealth.company@yahoo.com',
        // pass: 'gvsvivhhitrnipzz',
        user: 'd0t1g3r01@gmail.com',
        pass: 'chnejqlzamwntzpd',
        // pass: 'xuffgztyealbmeri'
    },
    logger: true
});

//confirmation email
exports.sendConfirmationMail = (receiver, code, lang) => {

    let msg = this.requireMessages(lang).confirmEmail

    var mailOptions = {
        from: 'd0t1g3r01@gmail.com',
        to: receiver,
        subject: "Code de confirmation",
        html: `<!DOCTYPE html>
        <html>
        
        <head>
            <title></title>
            <meta http-equiv="Content-Type" content="text/html" charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <meta http-equiv="X-UA-Compatible" content="IE=edge" />
            <style type="text/css">
                @import url(http://fonts.googleapis.com/earlyaccess/droidarabickufi.css);
                @import url('https://fonts.googleapis.com/css2?family=Saira:wght@700&display=swap');
                @media screen {
                    @font-face {
                        font-family: 'Saira', 'Lato';
                        font-style: normal;
                        font-weight: 400;
                        src: local('Lato Regular'), local('Lato-Regular'), url(https://fonts.gstatic.com/s/lato/v11/qIIYRU-oROkIk8vfvxw6QvesZW2xOQ-xsNqO47m55DA.woff) format('woff');
                    }
                    @font-face {
                        font-family: 'Saira', 'Lato';
                        font-style: normal;
                        font-weight: 700;
                        src: local('Lato Bold'), local('Lato-Bold'), url(https://fonts.gstatic.com/s/lato/v11/qdgUG4U09HnJwhYI-uK18wLUuEpTyoUstqEm5AMlJo4.woff) format('woff');
                    }
                    @font-face {
                        font-family: 'Saira', 'Lato';
                        font-style: italic;
                        font-weight: 400;
                        src: local('Lato Italic'), local('Lato-Italic'), url(https://fonts.gstatic.com/s/lato/v11/RYyZNoeFgb0l7W3Vu1aSWOvvDin1pK8aKteLpeZ5c0A.woff) format('woff');
                    }
                    @font-face {
                        font-family: 'Saira', 'Lato';
                        font-style: italic;
                        font-weight: 700;
                        src: local('Lato Bold Italic'), local('Lato-BoldItalic'), url(https://fonts.gstatic.com/s/lato/v11/HkF_qI1x_noxlxhrhMQYELO3LdcAZYWl9Si6vvxL-qU.woff) format('woff');
                    }
                }
                /* CLIENT-SPECIFIC STYLES */
                
                body,
                table,
                td,
                a {
                    -webkit-text-size-adjust: 100%;
                    -ms-text-size-adjust: 100%;
                }
                
                table,
                td {
                    mso-table-lspace: 0pt;
                    mso-table-rspace: 0pt;
                }
                
                img {
                    -ms-interpolation-mode: bicubic;
                }
                /* RESET STYLES */
                
                img {
                    border: 0;
                    height: auto;
                    line-height: 100%;
                    outline: none;
                    text-decoration: none;
                }
                
                table {
                    border-collapse: collapse !important;
                }
                
                body {
                    height: 100% !important;
                    margin: 0 !important;
                    padding: 0 !important;
                    width: 100% !important;
                }
                /* iOS BLUE LINKS */
                
                a[x-apple-data-detectors] {
                    color: inherit !important;
                    text-decoration: none !important;
                    font-size: inherit !important;
                    font-family: inherit !important;
                    font-weight: inherit !important;
                    line-height: inherit !important;
                }
                /* MOBILE STYLES */
                
                @media screen and (max-width:600px) {
                    h1 {
                        font-size: 32px !important;
                        line-height: 32px !important;
                    }
                }
                /* ANDROID CENTER FIX */
                
                div[style*="margin: 16px 0;"] {
                    margin: 0 !important;
                }
            </style>
        </head>
        
        <body style="background-color: #4D4D4D; margin: 0 !important; padding: 0 !important;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <!-- LOGO -->
                <tr>
                    <td bgcolor="#FFD000" align="center">
                        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                            <tr>
                                <td align="center" valign="top" style="padding: 40px 10px 40px 10px;"> </td>
                            </tr>
                        </table>
                    </td>
                </tr>
                <tr>
                    <td bgcolor="#FFD000" align="center" style="padding: 0px 10px 0px 10px;">
                        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                            <tr>
                                <td bgcolor="#ffffff" align="center" valign="top" style="padding: 40px 20px 20px 20px; border-radius: 4px 4px 0px 0px; color: #111111; font-family: 'Saira',  'Droid Arabic Kufi','Lato', Helvetica, Arial, sans-serif; font-size: 48px; font-weight: 400; line-height: 48px;">
                                    <h1 style="font-size: 48px; font-weight: 400; margin: 2;">${msg.welcome}</h1> <img src="${logo_url}" width="125" height="120" style="display: block; border: 0px;" />
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
                <tr>
                    <td bgcolor="#4D4D4D" align="center" style="padding: 0px 10px 0px 10px;">
                        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                            <tr>
                                <td bgcolor="#ffffff" align="center" style="padding: 20px 30px 40px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                                    <h1 style="margin: 0;">${code}</h1>
                                </td>
                            </tr>
                            <tr>
                                <td bgcolor="#ffffff" align="center" style="padding: 20px 30px 40px 30px; color: #666666; font-family: 'Saira',  'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                                    <p style="margin: 0;">${msg.message}</p>
                                </td>
                            </tr>
                            <tr>
                                <td bgcolor="#ffffff" align="left">
                                    <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                        <tr>
                                            <td bgcolor="#ffffff" align="center" style="padding: 20px 30px 60px 30px;">
                                                <table border="0" cellspacing="0" cellpadding="0">
                                                    <tr>
        
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            <!-- COPY -->
        
        
                            <tr>
                                <td bgcolor="#ffffff" align="left" style="padding: 0px 30px 40px 30px; border-radius: 0px 0px 4px 4px; color: #666666; font-family: 'Saira',  'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                                    <p style="margin: 0;"><br>TrustAll</p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
                <tr>
                    <td bgcolor="#4D4D4D" align="center" style="padding: 30px 10px 0px 10px;">
                        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
        
                        </table>
                    </td>
                </tr>
                <tr>
                    <td bgcolor="#4D4D4D" align="center" style="padding: 0px 10px 0px 10px;">
                        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                            <tr>
                                <td bgcolor="#4D4D4D" align="left" style="padding: 0px 30px 30px 30px; color: #666666; font-family: 'Saira',  'Lato', Helvetica, Arial, sans-serif; font-size: 14px; font-weight: 400; line-height: 18px;"> <br>
        
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </body>
        
        </html>
        `
    };

    let response = false
    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log("error:---------" + error);
        } else {
            response = true
            console.log('Email sent: ' + info.response);
        }
    });
    return response
}

//confirmation email
exports.sendResetPasswordEmail = (receiver, token) => {


        var mailOptions = {
            from: 'ehealth.company@yahoo.com',
            to: receiver,
            subject: "Password Reset",
            html: `
            <p>Here's the link to reset your password</p>
            <p>Click <a href="https://trust-all.vercel.app/newpassword/${token}">here</a></p>
        `
        };

        let response = false
        transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
                console.log("error:---------" + error);
            } else {
                response = true
                console.log('Email sent: ' + info.response);
            }
        });
        return response
    }
    //object projection
exports.projectObject = (o, p) => {
    return Object.keys(p).reduce((r, k) => {
        r[k] = o[k] || '';
        return r;
    }, {});
}

//random password generator
exports.generateRandomPassword = () => {
    const letter = "0123456789ABCDEFGHIJabcdef*/#ghijklmnopqrstuvwxyzKLMNOP*/#QRSTUVWXYZ0123456789abcd*/#efghiABCDEFGHIJKLMNOPQ*/#RST0123456789jklmnopqrstuvwxyz*/#";
    let randomString = "";
    for (let i = 0; i < 10; i++) {
        const randomStringNumber = Math.floor(1 + Math.random() * (letter.length - 1));
        randomString += letter.substring(randomStringNumber, randomStringNumber + 1);
    }
    return randomString
}

//require messages
exports.requireMessages = (lang) => {
    var msg;
    //importing messages file
    if (lang == "en") {
        msg = require("../validators/messages/en")
    } else if (lang == "fr") {
        msg = require("../validators/messages/fr")
    } else {
        msg = require("../validators/messages/ar")
    }
    return msg
}