const fs = require("fs")
const path = require("path")

function readCitiesJson() {
    let file
    file = "./algeria_cities.json"

    let bufferData = fs.readFileSync(path.resolve(__dirname, file))
    let stData = bufferData.toString()
    let data = JSON.parse(stData)
        //console.log(data)
    return data
}

const cities = readCitiesJson()

var dairas = []

cities.map((o => {
    if (dairas.findIndex(item => (item.wilaya_code == o.wilaya_code) && (item.daira_name == o.daira_name_ascii)) == -1) {
        dairas.push({
            wilaya_code: o.wilaya_code,
            daira_name: o.daira_name_ascii,
            daira_name_ar: o.daira_name
        })
    }
}))
console.log(dairas.length)

const data = JSON.stringify(dairas)
fs.writeFile('dairas.json', data, err => {
    if (err) {
        throw err
    }
    console.log('JSON data is saved.')
})