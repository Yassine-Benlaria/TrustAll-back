const fs = require("fs")
const path = require("path")

//importing json file
function readCitiesJson(f) {
    let file
    if (f == "wilayas") file = "./wilayas.json"
    else if (f == "dairas") file = "./dairas.json"
    else file = "./communes.json"

    let bufferData = fs.readFileSync(path.resolve(__dirname, file))
    let stData = bufferData.toString()
    let data = JSON.parse(stData)
        //console.log(data)
    return data
}

//get cities list
exports.getCitiesList = (language = "en") => {
    let cities = readCitiesJson("wilayas")
    let cities_list = []
    if (language == "ar")
        cities.map(o => {
            cities_list.push({ wilaya_code: o.wilaya_code, wilaya_name: o.wilaya_name_ar })
        })
    else cities.map(o => {
        cities_list.push({ wilaya_code: o.wilaya_code, wilaya_name: o.wilaya_name })
    })
    return cities_list
}

//get diras list by city
exports.getDirasList = (wilaya_code, language = "en") => {

    let dairas = readCitiesJson("dairas");
    let dairas_list = dairas.filter((o) =>
        o.wilaya_code == wilaya_code
    )
    let result = []
    if (language == "ar")
        dairas_list.map(o => {
            result.push({ wilaya_code: o.wilaya_code, daira_name: o.daira_name_ar, value: o.daira_name })
        })
    else dairas_list.map(o => {
        result.push({ wilaya_code: o.wilaya_code, daira_name: o.daira_name, value: o.daira_name })
    })



    return result
}

//get diras list by city
exports.getCommunesList = (daira, language = "en") => {

    let communes = readCitiesJson("communes");
    console.log(communes)
    let communes_list = communes.filter((o) =>
        o.daira_name_ascii == daira
    )

    let result = []
    if (language == "ar")
        communes_list.map(o => {
            result.push({ id: o.id, commune_name: o.commune_name })
        })
    else communes_list.map(o => {
        result.push({ id: o.id, commune_name: o.commune_name_ascii })
    })



    return result
}