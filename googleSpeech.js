// Imports the Google Cloud client library
const fs = require('fs');
const speech = require('@google-cloud/speech');

// Creates a client
const client = new speech.SpeechClient();
process.env.GOOGLE_APPLICATION_CREDENTIALS = '/home/mingyu/prototype/weighty-diagram-388614-46e0b3d27dca.json';
/**
 * TODO(developer): Uncomment the following lines before running the sample.
 */
const filename = '/home/mingyu/prototype/output.mp3';
const encoding = 'mp3';
const sampleRateHertz = 44100;
const languageCode = 'en-US';

const config = {
  encoding: encoding,
  sampleRateHertz: sampleRateHertz,
  languageCode: languageCode,
};
const audio = {
  content: fs.readFileSync(filename).toString('base64'),
};

const request = {
  config: config,
  audio: audio,
};

// Detects speech in the audio file
(async () => {
    const [response] = await client.recognize(request);
    const transcription = response.results
      .map(result => result.alternatives[0].transcript)
      .join('\n');
    console.log('Transcription: ', transcription);
  })();
  
  