var msg = {}

msg.firstName = "First name must be between 3 and 32 characters!"
msg.lastName = "Last name must be between 3 and 32 characters!"
msg.email = "Email is not valid!"
msg.emailNotExist = "Email is not valid!"
msg.phone = "Phone number is not valid!"
msg.date = "Invalid date! valid format: YYYY-MM-DD"
msg.city = "Invalid city!"
msg.commune = "Invalid commune!"
msg.daira = "Invalid daira!"
msg.password = "Password must contain at least 8 characters!"
msg.registerSuccess = "Your account have been created successfully, check your email!"
msg.emailAlreadyExist = "This email is already used!"
msg.loginFailed = "Your email/phone or password is not correct!"
msg.confirmCodeUncorrect = "Confirmation code is not correct!"
msg.confirmEmail = {
    welcome: "Welcome!",
    message: "Enter this code to confirm your email"
}
msg.resetEmailSent = "Cliquez sur le lien dans votre e-mail pour réinitialiser votre mot de passe!"
msg.noAccountFound = "No account found with this email!"

module.exports = msg