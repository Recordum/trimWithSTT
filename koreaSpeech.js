const fs = require('fs');
const axios = require('axios');

const openApiURL = 'http://aiopen.etri.re.kr:8000/WiseASR/Recognition';
const access_key = '2eed18e9-9ec3-4334-bd3c-cef29335a15c';
const languageCode = 'korean';
const audioFilePath = '/home/mingyu/prototype/output.pcm';

const audioData = fs.readFileSync(audioFilePath);

var requestJson = {
    'argument': {
        'language_code': languageCode,
        'audio': audioData.toString('base64')
    }
};
 
var request = require('request');
var options = {
    url: openApiURL,
    body: JSON.stringify(requestJson),
    headers: {'Content-Type':'application/json','Authorization':access_key}
};
request.post(options, function (error, response, body) {
    console.log('responseCode = ' + response.statusCode);
    console.log('responseBody = ' + body);
});
