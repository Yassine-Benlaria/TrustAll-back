var ImageKit = require("imagekit");

var imagekit = new ImageKit({
    publicKey: "public_051lKBIDHvP92nS3tPmHG1c06to=",
    privateKey: "private_W37wnJIZ62bdCk9AHeyPW/9XLIY=",
    urlEndpoint: "https://ik.imagekit.io/6jmfzel6y"
});



exports.uploadFilesToImageKit = (files) => {
    // console.log(files)
    files.forEach(file => {
        console.log("file:", file)
        imagekit.upload({
            file: file.buffer.toString("base64"), //required
            fileName: file.originalname, //required
            extensions: [{
                name: "google-auto-tagging",
                maxTags: 5,
                minConfidence: 95
            }]
        }, function(error, result) {
            if (error) console.log("error: ", error);
            else console.log("result: ", result);
        });
    });
}