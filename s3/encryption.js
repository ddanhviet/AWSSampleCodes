'use strict';

const aws = require('aws-sdk');
const s3 = new aws.S3();

const io = require('../utils/ioUtils');

const TEST_BUCKET = 'dev-stackline';

async function putObjectEncrypted(key, data) {
  const params = {
    Bucket: TEST_BUCKET,
    Body: data,
    Key: key,
    ServerSideEncryption: "AES256"
  };
  return await s3.putObject(params).promise();
}

async function getObjectEncrypted(key) {
  const params = {
    Bucket: TEST_BUCKET,
    Key: key
  }
  return await s3.getObject(params).promise();
}

(async () => {
  const testKey = 'vietdd/testEncryption.txt';
  const putObjectResult = await putObjectEncrypted(testKey, 'This is test data');
  console.log(JSON.stringify(putObjectResult));
  // {"ETag":"\"701bbd4bde1ee04e3b0596f63994ebae\"","ServerSideEncryption":"AES256"}
  const getObjectResult = await getObjectEncrypted(testKey);
  console.log(JSON.stringify(getObjectResult));
  // {"AcceptRanges":"bytes","LastModified":"2020-04-09T21:50:41.000Z","ContentLength":17,"ETag":"\"701bbd4bde1ee04e3b0596f63994ebae\"","ContentType":"application/octet-stream","ServerSideEncryption":"AES256","Metadata":{},"Body":{"type":"Buffer","data":[84,104,105,115,32,105,115,32,116,101,115,116,32,100,97,116,97]}}
  console.log(io.ab2str(getObjectResult.Body.buffer));
})();