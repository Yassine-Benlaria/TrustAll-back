var msg = {}

msg.firstName = "يوجد خطأ في الاسم!"
msg.lastName = "يوجد خطأ في اللقب!"
msg.email = "!أدخل بريدا الكترونيا صحيحا"
msg.emailNotExist = "!أدخل بريد الكتروني صحيح"
msg.phone = "!أدخل رقم هاتف صحيح"
msg.date = "خطأ في التاريخ: AAAA-MM-JJ"
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
        car_color: "لون السيارة"
    },
    interior: {
        internal_order: "الديكورات",
        seats: "المقاعد",
        airBags: "الوسائد الهوائية (الايرباق)",
        floorMats: "سجاد الأرضية",
        windows: "النوافذ",
        AC: "التكييف",
        Radio: "الراديو",
        Screen: "الشاشة"
    },
    exterior: {
        external_structure: "الهيكل الخارجي",
        exterior_lights: "الأضواء الخارجية",
        Tires: "الاطارات",
        Wiper_Blades: "شفرات المسّاحات",
        Dents: "الخدوش"
    },
    mechanical: {
        engine_transmission: "المحرك / ناقل الحركة",
        differential: "الدفرنس / الدبل",
        engine_cooling_system: "نظام تبريد المحرك",
        fluid_leaks: "تسرب السائل",
        Brake_Arms_Shock_absorbs: "الفرامل / الاذرعه / المساعدات",
        AC_system: "نظام المكيف",
        electricity_system: "نظام الكهرباء",
        computer_system_scanned: "نتيجة فحص نظام الكمبيوتر"
    }

}


module.exports = msg