var msg = {}

msg.firstName = "يوجد خطأ في الاسم!"
msg.lastName = "يوجد خطأ في اللقب!"
msg.email = "!أدخل بريدا الكترونيا صحيحا"
msg.emailNotExist = "!أدخل بريد الكتروني صحيح"
msg.phone = "!أدخل رقم هاتف صحيح"
msg.date = "خطأ في تاريخ الميلاد"
msg.city = "!هذه الولاية غير موجودة"
msg.commune = "!هذه البلدية غير موجودة"
msg.daira = "!هذه الدائرة غير موجودة"
msg.password = "يجب أن تتكون كلمة السر من 8 أحرف أو أكثر"
msg.registerSuccess = "لقد تم إنشاء حسابك بنجاح، تفحص بريدك الإلكتروني!"
msg.emailAlreadyExist = "البريد الإلكتروني مستعمل سابقا!"
msg.emailModified = "!تم تغيير بريدك اﻹلكتروني"
msg.loginFailed = "خطأ في البريد/الهاتف أو كلمة السر!"
msg.confirmCodeUncorrect = "رمز التأكيد غير صحيح!"
msg.confirmEmail = {
    welcome: "مرحبا",
    message: "أدخل هذا الرمز لتأكيد حسابك"
}
msg.resetEmailSent = "انقر على الرابط المرسل في بريدك الإلكتروني لإعادة تعيين كلمة المرور الخاصة بك!"
msg.noAccountFound = "لا يوجد حساب بهذا البريد الإلكتروني!"
msg.updatedSuccess = "تم تحديث معلوماتك بنجاح!"
msg.nothingToChange = "لم تقم بتغيير معلوماتك!"
msg.passwordNotCorrect = "كلمة السر القديمة غير صحيحة!"
msg.emailSent = "تفقد حسابك، لقد تم إرسال رمز التأكيد!"
msg.carName = "خطأ في اسم السيارة!"

msg.title = "يجب أن لا يكون العنوان فارغا"
msg.content = "يجب أن لا يكون المحتوى فارغا"
msg.options = {
    car_information: {
        car_brand: "ماركة السيارة",
        car_model: "موديل السيارة",
        manufacture_year: "سنة التصنيع",
        kilometer_number: "عدد الكيلومترات",
        car_plate: "لوحة السيارة",
        vin: "رقم الشاسيه",
        gazoline_type: "نوع الوقود",
        car_color: "لون السيارة",
        ////////////////////
        gearbox: "علبة السرعة",
        documents: "الوثائق",
        chassis_matching: "تطابق الشاسيه مع الوثائق",
        nbr_seats: "عدد المقاعد",
        drive_type: "نوع الدفع",
        km_after_inspection: "عدد الكيلومترات بعد الفحص"
    },
    interior: {
        internal_order: "الديكورات",
        airBags: "الوسائد الهوائية (الايرباق)",
        floorMats: "سجاد الأرضية",
        windows: "النوافذ",
        AC: "التكييف",
        Radio: "الراديو",
        Screen: "الشاشة",
        /////////////////////
        control_buttons: "حالة ك ازرار التحكم ( اضواء - مكيف - ماء الزجاج )",
        warning_signs: "علامات التحذير في طابلو السيارة",
        window_buttons: "ازرار او مقابض النوافد",
        door_handles: "مقابض الابواب من الداخل",
        surface: "سطح الداخلي",
        seats: "حالة الكراسي"
    },
    exterior: {
        external_structure: "الهيكل الخارجي",
        exterior_lights: "الأضواء الخارجية",
        Tires: "الاطارات",
        Wiper_Blades: "شفرات المسّاحات",
        Dents: "الخدوش",
        /////////////////////
        insode_trunk: "داخل صندوق السيارة",
        sill: "اسفل الصندوق (bas de caisse)",
        window_glasses: "زجاج النوافد",
        upper_window_glass: "زجاج النافدة العلوية",
        front_rear_glass: "حالة زجاج الامامي و الخلفي",
        side_mirror: "المرآة الجانبية",
        door_handle: "مقبض الأبواب من الخارج"
    },
    mechanical: {
        engine_transmission: "المحرك / ناقل الحركة",
        differential: "الدفرنس / الدبل",
        engine_cooling_system: "نظام تبريد المحرك",
        fluid_leaks: "تسرب السائل",
        AC_system: "نظام المكيف",
        electricity_system: "نظام الكهرباء",
        computer_system_scanned: "نتيجة فحص نظام الكمبيوتر",
        ////////////////////////
        Brake_Arms_Shock_absorbs: "مكابح  / الاذرعه/ المساعدات = مكابح / مضاذ الصدمات ( amortisseur ) / ذراع تعليق السيارة (bras de suspension)"
    }
}
msg.command = {
    not_available_in_region: "الخدمة غير متاحة في هذا المنطقة",
    not_available_in_your_city: "الخدمة غير متاحة في مدينتك!",
    created_successfully: "تم إنشاء طلبيتك بنجاح"
}



module.exports = msg