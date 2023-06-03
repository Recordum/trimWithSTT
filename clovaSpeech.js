const axios = require('axios');
const fs = require('fs');

const invokeUrl = 'https://clovaspeech-gw.ncloud.com/external/v1/5287/d8c0a6dfcd87e93cde711c391c6ec9c248567ede0a345b86da370ec24df62e9f'; // Clova Speech invoke URL
const secretKey = '2d416d4af9d245e8807222ffefcc6de7'; // Clova Speech secret key
const segment[];
async function requestSpeechRecognition(file, completion) {
  const url = `${invokeUrl}/recognizer/upload`;

  const requestConfig = {
    headers: {
      'Accept': 'application/json;UTF-8',
      'Content-Type': '	multipart/form-data',
      'X-CLOVASPEECH-API-KEY': secretKey,
    },
  };

  const requestBody = {
    language: 'ko-KR',
    completion: completion,
    callback: null,
    userdata: null,
    wordAlignment: true,
    fullText: true,
    forbiddens: null,
    boostings: null,
    diarization: null,
  };

  const formData = {
    media: fs.createReadStream(file),
    params: JSON.stringify(requestBody)
  };

  try {
    const response = await axios.post(url, formData, requestConfig);
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
}

requestSpeechRecognition('/home/mingyu/prototype/sample.mp3', 'sync');
