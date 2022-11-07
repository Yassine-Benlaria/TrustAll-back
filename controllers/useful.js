const { getCitiesList, getDirasList } = require("../validators/cities");

exports.getWilayas = (req, res) => {
    let cities = getCitiesList(req.params.lang);
    return res.json({ cities });
}