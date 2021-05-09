const AWS = require('aws-sdk')
var rekognition = new AWS.Rekognition()
var s3Bucket = new AWS.S3( { params: {Bucket: "grupo1-s3"} } );
var fs = require('fs');
exports.handler = (event, context, callback) => {
    let parsedData = JSON.parse(event)
    let encodedImage = parsedData.Image;
    var filePath = "registered/" +parsedData.name + ".jpg";
    let decodedImage = new Buffer(encodedImage.replace(/^data:image\/\w+;base64,/, ""),'base64')
    
    var data = {
        Key: filePath, 
        Body: decodedImage,
        ContentEncoding: 'base64',
        ContentType: 'image/jpeg'
    };
    s3Bucket.putObject(data, function(err, data){
        if (err) { 
            callback(err,null);
        } else {
            //callback(null, 'Succesfully uploaded the image!');
        }
    });
    
    var params ={
        Image: {
            S3Object: {
                Bucket: "grupo1-s3", 
                Name: filePath
            }
        },
        MaxLabels: 4,
        MinConfidence: 90
    }
    setTimeout(function () {
        rekognition.detectLabels(decodedImage, function(err, data) {
            if (err){
                console.log(err, err.stack); // an error occurred
                callback(err)
            }
            else{
                console.log(data);           // successful response
                callback(null,data);
            }
        });
    }, 3000);
};