'use strict';

const aws = require('aws-sdk');
const s3 = new aws.S3();

const io = require('../utils/ioUtils');

const TEST_BUCKET = 'dev-stackline';

async function putObject(key, data) {
  const params = {
    Bucket: TEST_BUCKET,
    Body: data,
    Key: key
  };
  return await s3.putObject(params).promise();
}

async function copyObjectEncrypted(key, newKey) {
  const params = {
    CopySource: `${TEST_BUCKET}/${key}`,
    Bucket: TEST_BUCKET,    
    Key: newKey,
    ServerSideEncryption: "AES256"
  };
  return await s3.copyObject(params).promise();
}

async function getObjectEncrypted(key) {
  const params = {
    Bucket: TEST_BUCKET,
    Key: key
  }
  return await s3.getObject(params).promise();
}

(async () => {
  const testKey = 'vietdd/testExistingObjEncryption.txt';
  const putObjectResult = await putObject(testKey, 'This is test data');
  console.log(JSON.stringify(putObjectResult));
  // {"ETag":"\"701bbd4bde1ee04e3b0596f63994ebae\""}
  const copyObjectResult = await copyObjectEncrypted(testKey, testKey);
  console.log(JSON.stringify(copyObjectResult)); 
  // {"ServerSideEncryption":"AES256","CopyObjectResult":{"ETag":"\"701bbd4bde1ee04e3b0596f63994ebae\"","LastModified":"2020-04-10T03:44:14.000Z"}}
  const getObjectResult = await getObjectEncrypted(testKey);
  console.log(JSON.stringify(getObjectResult));
  // {"AcceptRanges":"bytes","LastModified":"2020-04-10T03:44:14.000Z","ContentLength":17,"ETag":"\"701bbd4bde1ee04e3b0596f63994ebae\"","ContentType":"application/octet-stream","ServerSideEncryption":"AES256","Metadata":{},"Body":{"type":"Buffer","data":[84,104,105,115,32,105,115,32,116,101,115,116,32,100,97,116,97]}}
  console.log(io.ab2str(getObjectResult.Body.buffer));
})();