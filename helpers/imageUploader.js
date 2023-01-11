var ImageKit = require("imagekit");

var imagekit = new ImageKit({
    publicKey: "public_051lKBIDHvP92nS3tPmHG1c06to=",
    privateKey: "private_W37wnJIZ62bdCk9AHeyPW/9XLIY=",
    urlEndpoint: "https://ik.imagekit.io/6jmfzel6y"
});



exports.uploadFilesToImageKit = async(files, command_id) => {
    let urls = [];
    let count = 0;

    // console.log(files)
    await files.forEach(async(file) => {

        console.log("file:", file)
        await imagekit.upload({
            file: file.buffer.toString("base64"), //required
            fileName: `${file.originalname}_${command_id}.${file.mimetype.split("/")[1]}`, //required
            extensions: [{
                name: "google-auto-tagging",
                maxTags: 5,
                minConfidence: 95
            }]
        }, async function(error, result) {
            if (error) console.log("error: ", error);
            else {
                console.log("result: ", result.url);
                urls.push([file.originalname, result.url])
            }
            count++;
        });
    });

    while (count < files.length) await sleep(1000);
    return urls;
}

exports.uploadPassportID = async(files, id) => {
    let urls = [];
    let count = 0;

    // console.log(files)
    await files.forEach(async(file) => {

        console.log("file:", file)
        await imagekit.upload({
            file: file.buffer.toString("base64"), //required
            fileName: `${file.originalname}_${id}.${file.mimetype.split("/")[1]}`, //required
            extensions: [{
                name: "google-auto-tagging",
                maxTags: 5,
                minConfidence: 95
            }]
        }, async function(error, result) {
            if (error) console.log("error: ", error);
            else {
                console.log("result: ", result.url);
                urls.push([file.originalname + '_url', result.url])
            }
            count++;
        });
    });

    while (count < files.length) await sleep(1000);
    return urls;
}

const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}