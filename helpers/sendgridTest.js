const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)
const msg = {
    to: 'ay.benlaria@esi-sba.dz', // Change to your recipient
    from: 'benlariay@gmail.com', // Change to your verified sender
    subject: 'Sending with SendGrid is Fun',
    text: 'and easy to do anywhere, even with Node.js',
    html: '<strong>and easy to do anywhere, even with Node.js</strong>',
}
sgMail
    .send(msg)
    .then((response) => {
        console.log(response)
    })
    .catch((error) => {
        console.error(error.response.body)
    })