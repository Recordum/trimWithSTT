// import {trimSelectedTime} from './trimAudio.js';
const axios = require('axios');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');

const invokeUrl = 'https://clovaspeech-gw.ncloud.com/external/v1/5288/a9ddffe832944acecef2385c2c909825bec963f62d07eca8cfb4bf323d60fb6a'; // Clova Speech invoke URL
const secretKey = 'fb2ce79b96064ba3a7d985c3160d3a51'; // Clova Speech secret key
const timeList = [];
const inputFilePath = '/home/mingyu/prototype/sample.mp3';

async function trimSelectedTime(startTime, endTime, count) {
  return new Promise((resolve, reject) => {
    ffmpeg(inputFilePath)
      .outputOptions([
        '-af',
        `atrim=start=${startTime}:end=${endTime},asetpts=PTS-STARTPTS`,
      ])
      .save(`/home/mingyu/prototype/trim_${count}.mp3`)
      .on('end', () => {
        resolve();
      })
      .on('error', (err) => {
        reject(err);
      });
  });
}

async function concatFile(count) {
  return new Promise((resolve, reject) => {
    const outputFilePath = `/home/mingyu/prototype/result${count}.mp3`;
    const inputFilePath1 = count > 1 ? `/home/mingyu/prototype/result${count - 1}.mp3` : '/home/mingyu/prototype/trim_0.mp3';
    const inputFilePath2 = `/home/mingyu/prototype/trim_${count}.mp3`;

    ffmpeg()
      .input(inputFilePath1)
      .input(inputFilePath2)
      .concat(outputFilePath)
      .on('end', () => {
        console.log(`${count}합치기 완료.`);
        resolve();
      })
      .on('error', (err) => {
        reject(err);
      })
      .output(outputFilePath)
  });
}

async function requestSpeechRecognition(file, completion) {
  const url = `${invokeUrl}/recognizer/upload`;

  const requestConfig = {
    headers: {
      'Accept': 'application/json;UTF-8',
      'Content-Type': 'multipart/form-data',
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
    params: JSON.stringify(requestBody),
  };

  try {
    const response = await axios.post(url, formData, requestConfig);
    // console.log(response.data);
    for (let i = 0; i < response.data.segments.length; i++) {
      timeList.push({ 'startTime': response.data.segments[i].start, 'endTime': response.data.segments[i].end });
    }

    for (let i = 0; i < timeList.length; i++) {
      console.log(timeList[i].startTime / 1000);
      console.log(timeList[i].endTime / 1000);
      await trimSelectedTime(timeList[i].startTime / 1000, timeList[i].endTime / 1000, i);
    }

    for (let i = 1; i < timeList.length; i++) {
      await concatFile(i);
    }

  } catch (error) {
    console.error(error);
  }
}

requestSpeechRecognition(inputFilePath, 'sync');
