var msg = {}

msg.firstName = "Please enter a valid first-name!"
msg.lastName = "Please enter a valid last-name!"
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
msg.emailModified = "Your email has been modified successfully!"
msg.loginFailed = "Your email/phone or password is not correct!"
msg.confirmCodeUncorrect = "Confirmation code is not correct!"
msg.confirmEmail = {
    welcome: "Welcome!",
    message: "Enter this code to confirm your email"
}
msg.noAccountFound = "No account found!"
msg.resetEmailSent = "Click the link in your email to reset your password!"
msg.updatedSuccess = "Your information have been updated successfully!"
msg.nothingToChange = "Nothing to change!"
msg.passwordNotCorrect = "Old password is not correct!"
msg.emailSent = "Code sent, check your email!"
msg.carName = "car name should not be empty!"
msg.title = "title should not be empty!"
msg.content = "content should not be empty!"
msg.options = {
    car_information: {
        car_brand: "Car Brand",
        car_model: "Car Model",
        manufacture_year: "Manufacture Year",
        kilometer_number: "Kilometer Number",
        car_plate: "Car Plate",
        vin: "Vehicule Identification Number",
        gazoline_type: "Gazoline Type",
        car_color: "Car Color"
    },
    interior: {
        internal_order: "Internal Order",
        seats: "Seats",
        airBags: "AirBags",
        floorMats: "FloorMats",
        windows: "Windows",
        AC: "AC",
        Radio: "Radio",
        Screen: "Screen"
    },
    exterior: {
        external_structure: "External Structure",
        exterior_lights: "Exterior Lights",
        Tires: "Tires",
        Wiper_Blades: "Wiper Blades",
        Dents: "Dents"
    },
    mechanical: {
        engine_transmission: "Engine / Transmission",
        differential: "Differential / Gearbox",
        engine_cooling_system: "Engine Cooling-System",
        fluid_leaks: "Fluid Leaks",
        Brake_Arms_Shock_absorbs: "Brake / Arms / Shock-absorbs",
        AC_system: "AC system",
        electricity_system: "electricity system",
        computer_system_scanned: "Computer Scan Result"
    }
}
msg.command = {
    not_available_in_region: "Service is not available in this region!",
    not_available_in_your_city: "Service is not available in your city!",
    created_successfully: "Your Command have been created successfully"
}
module.exports = msg