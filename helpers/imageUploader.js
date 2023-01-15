var ImageKit = require("imagekit");
const crypto = require('crypto');
const config = require("../config").ImageKit

var imagekit = new ImageKit(config);

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

exports.uploadID = async(files, id) => {
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

// const encryptImage = (imageBuffer) => {
//     // Generate a random encryption key
//     const encryptionKey = crypto.randomBytes(32);

//     // Encrypt the image data using the encryption key
//     const cipher = crypto.createCipher('aes-256-cbc', encryptionKey);
//     let encryptedImage = cipher.update(imageBuffer);
//     encryptedImage = Buffer.concat([encryptedImage, cipher.final()]);
//     return { encryptedImage, encryptionKey };
// };

// const decryptImage = (encryptedImage, encryptionKey) => {
//     const decipher = crypto.createDecipher('aes-256-cbc', encryptionKey);
//     let decryptedImage = decipher.update(encryptedImage);
//     decryptedImage = Buffer.concat([decryptedImage, decipher.final()]);
//     return decryptedImage;
// }

// exports.uploadFilesToImageKit = async(files, command_id) => {
//     let urls = [];
//     let count = 0;

//     // console.log(files)
//     await files.forEach(async(file) => {
//         const { encryptedImage, encryptionKey } = encryptImage(file);
//         console.log("file:", file)

//         const response = await imagekit.upload({
//             file: encryptedImage,
//             fileName: fileName,
//             useUniqueFileName: false,
//             tags: ['encrypted']
//         });

//         await imagekit.upload({
//             file: encryptedImage, //required
//             fileName: `${file.originalname}_${command_id}.${file.mimetype.split("/")[1]}`, //required
//             useUniqueFileName: false,
//             tags: ['encrypted'],
//             extensions: [{
//                 name: "google-auto-tagging",
//                 maxTags: 5,
//                 minConfidence: 95
//             }]
//         }, async function(error, result) {
//             if (error) console.log("error: ", error);
//             else {
//                 console.log("result: ", result.url);
//                 urls.push([file.originalname, result.url, encryptionKey])
//             }
//             count++;
//         });
//     });

//     while (count < files.length) await sleep(1000);
//     return urls;
// }

// exports.uploadID = async(files, id) => {
//     let urls = [];
//     let count = 0;

//     // console.log(files)
//     await files.forEach(async(file) => {
//         const { encryptedImage, encryptionKey } = encryptImage(file.buffer);
//         console.log("file:", file)

//         await imagekit.upload({
//             file: encryptedImage, //required
//             fileName: `${file.originalname}_${id}.${file.mimetype.split("/")[1]}`, //required
//             useUniqueFileName: false,
//             tags: ['encrypted'],
//             extensions: [{
//                 name: "google-auto-tagging",
//                 maxTags: 5,
//                 minConfidence: 95
//             }]
//         }, async function(error, result) {
//             if (error) console.log("error: ", error);
//             else {
//                 console.log("result: ", result.url);
//                 urls.push([file.originalname + '_url', result.fileId, encryptionKey])
//             }
//             count++;
//         });
//     });

//     while (count < files.length) await sleep(1000);
//     return urls;
// }

// exports.downloadAndDecryptFromImageKit = async(fileId, encryptionKey) => {

//     // Download the encrypted image from ImageKit
//     const encryptedImage = await imagekit.download({ fileId: fileId });

//     // Decrypt the image
//     const decryptedImage = decryptImage(encryptedImage, encryptionKey);

//     return decryptedImage;
// }


exports.uploadProfilePic = async(file, id) => {
    let urls = [];
    let count = 0;

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

    while (count == 0) await sleep(1000);
    return urls;
}