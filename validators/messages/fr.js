var msg = {}

msg.firstName = "Le prénom n'est pas valide!"
msg.lastName = "Le nom n'est pas valide!"
msg.email = "L'email n'est pas valide!"
msg.emailNotExist = "L'email n'est pas valide!"
msg.phone = "Le numéro de téléphone n'est pas valide!"
msg.date = "Entrez votre date de naissance svp!"
msg.city = "La wilaya n'est pas valide"
msg.commune = "La commune n'est pas valide!"
msg.daira = "La daira n'est pas valide!"
msg.password = "Le mot de passe doit contenir au moins 8 caractères!"
msg.registerSuccess = "Votre compte a été créé avec succés, vérifier votre email!"
msg.emailAlreadyExist = "Cet addresse email est déja utilisé!"
msg.emailModified = "Votre email a été modifié avec succés!"
msg.loginFailed = "Votre email/telephone ou mot de passe n'est pas correct!"
msg.confirmCodeUncorrect = "Le code de confirmation n'est pas correct!"
msg.confirmEmail = {
    welcome: "Bienvenue!",
    message: "Enter ce code pour confirmer votre adresse email"
}
msg.noAccountFound = "Aucun compte trouvé avec cet e-mail!"
msg.resetEmailSent = "Cliquez sur le lien dans votre e-mail pour réinitialiser votre mot de passe!"
msg.updatedSuccess = "Vos informations ont été modifiés avec succès!"
msg.nothingToChange = "Rien à modifier!"
msg.passwordNotCorrect = "L'ancien mot de passe n'est pass correct!"
msg.emailSent = "Code envoyé, vérifiez votre email!"
msg.carName = "Le nom du voiture n'est pas valid!"
msg.title = "le titre ne doit pas être vide"
msg.content = "le contenue ne doit pas être vide"
msg.options = {
    car_information: {
        car_brand: "Marque de véhicule",
        car_model: "Modèle de véhicule",
        manufacture_year: "Année de fabrication",
        kilometer_number: "kilométrage",
        car_plate: "plaque de véhicule",
        vin: "Numéro d'identification de véhicule",
        gazoline_type: "Type d'essence",
        car_color: "Couleur de véhicule",
        //////////////////////////////
        gearbox: "Boîte de vitesses",
        documents: "Documents",
        chassis_matching: "Correspondance du châssis avec les documents",
        nbr_seats: "Nombre de sièges",
        drive_type: "Type de transmission",
        km_after_inspection: "Kilomètres après inspection"
    },
    interior: {
        internal_order: "Décoration interne",
        airBags: "AirBags",
        floorMats: "Tapis de sol",
        windows: "Fenêtres",
        AC: "Climatiseur",
        Radio: "Radio",
        Screen: "Ecran",
        //////////////////////////
        control_buttons: "État des boutons de commande (lumières - climatisation - essuie-glace)",
        warning_signs: "Signaux d'avertissement sur le tableau de bord",
        window_buttons: "Poignées/boutons de fenêtre",
        door_handles: "Poignées de porte intérieures",
        surface: "Surface intérieure",
        seats: "État des sièges"
    },
    exterior: {
        external_structure: "Structure externe",
        exterior_lights: "Lumières extérieures",
        Tires: "Pneus",
        Wiper_Blades: "Balais d'essuie-glace",
        Dents: "Rayures",
        //////////////////////////
        insode_trunk: "À l'intérieur du coffre de la voiture",
        sill: "Sous la voiture (bas de caisse)",
        window_glasses: "Vitres",
        upper_window_glass: "Vitre supérieure",
        front_rear_glass: "État des vitres avant et arrière",
        side_mirror: "Rétroviseur latéral",
        door_handle: "Poignée de porte extérieure"
    },
    mechanical: {
        engine_transmission: "Moteur / Transmission",
        differential: "Différentiel / Boite-Vitesse",
        engine_cooling_system: "Système de refroidissement moteur",
        fluid_leaks: "Fuites de liquide",
        AC_system: "Système de Climatisation",
        electricity_system: "Système d'Elictricité",
        computer_system_scanned: "Résultat de l'Analyse de l'Ordinateur",
        //////////////////////
        Brake_Arms_Shock_absorbs: "Freins / Bras de suspension / Amortisseurs"
    }
}

msg.command = {
    not_available_in_region: "Le service n'est pas disponible dans cette région !",
    not_available_in_your_city: "Le service n'est pas disponible dans votre ville !",
    created_successfully: "Votre commande a été créée avec succès"
}


module.exports = msg