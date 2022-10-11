const fs = require("fs")
const path = require("path")

//importing json file
function readCitiesJson(language = "ar") {
    let file
    if (language == "ar") file = "./cities_ar.json"
    else file = "./cities_fr.json"

    let bufferData = fs.readFileSync(path.resolve(__dirname, file))
    let stData = bufferData.toString()
    let data = JSON.parse(stData)
        //console.log(data)
    return data
}

const cities = readCitiesJson("ar")
const cities_en = readCitiesJson("en")

var new_json = {}
for (var key of Object.keys(cities)) {
    new_json[cities_en[key].wilaya_name] = cities[key]
}
console.log(new_json)

const data = JSON.stringify(new_json)
fs.writeFile('cities_ar.json', data, err => {
    if (err) {
        throw err
    }
    console.log('JSON data is saved.')
})