'use strict';

// 引入相关库
const AWS = require('aws-sdk');
const S3 = new AWS.S3({
  signatureVersion: 'v4',
});
const Sharp = require('sharp');

// 缩略图的长和宽
const width = 20;
const height = 20; 

exports.handler = function(event, context, callback) {
  // 从event中拿到上传文件的bucket和key
  const bucket = event.Records[0].s3.bucket.name; 
  const key = event.Records[0].s3.object.key; 
  const dest_key = "small/" + key.split("/").pop();

  S3.getObject({Bucket: bucket, Key: key}).promise()
    // 制作缩略图
    .then(data => Sharp(data.Body)
      .resize(width, height)
      .toFormat('png')
      .toBuffer()
    )
    // 存储缩略图到s3 
    .then(buffer => S3.putObject({
        Body: buffer,
        Bucket: bucket,
        ContentType: 'image/png',
        Key: dest_key,
      }).promise()
    )
}