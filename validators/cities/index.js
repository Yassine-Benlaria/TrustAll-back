const fs = require("fs")
const path = require("path")

//importing json file
function readCitiesJson(language = "en") {
    let file
    if (language == "ar") file = "./cities_ar.json"
    else file = "./cities_fr.json"

    let bufferData = fs.readFileSync(path.resolve(__dirname, file))
    let stData = bufferData.toString()
    let data = JSON.parse(stData)
        //console.log(data)
    return data
}

//get cities list
exports.getCitiesList = (language = "en") => {
    let cities = readCitiesJson(language)
    let cities_list = []
    Object.keys(cities).forEach(function(key) {
        cities_list.push(cities[key].wilaya_name)
    });
    return cities_list
}

//get diras list by city
exports.getDirasList = (wilaya, language = "en") => {
    let cities = readCitiesJson(language)
    if (cities[wilaya] != undefined)
        return cities[wilaya].dairas
    return []
}