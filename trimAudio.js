const ffmpeg = require('fluent-ffmpeg');

function trimSelectedTime(startTime, endTime) {
  const inputFilePath = '/home/mingyu/prototype/sample.mp3';
  const trimFilePath1 = '/home/mingyu/prototype/trim_1.mp3';
  const trimFilePath2 = '/home/mingyu/prototype/trim_2.mp3';
  const outputFilePath = '/home/mingyu/prototype/result.mp3';
  let totalDuration;

  ffmpeg.ffprobe(inputFilePath, (err, metadata) => {
    if (err) {
      console.error('오류 발생:', err.message);
      return;
    }

    totalDuration = metadata.format.duration;

    ffmpeg(inputFilePath)
      .outputOptions([
        '-af',
        `atrim=start=${0}:end=${startTime},asetpts=PTS-STARTPTS`,
      ])
      .save(trimFilePath1)
      .on('end', () => {
        ffmpeg(inputFilePath)
          .outputOptions([
            '-af',
            `atrim=start=${endTime}:end=${totalDuration},asetpts=PTS-STARTPTS`,
          ])
          .save(trimFilePath2)
          .on('end', () => {
            ffmpeg()
              .input(trimFilePath1)
              .input(trimFilePath2)
              .concat(outputFilePath)
              .output(outputFilePath)
              .on('end', () => {
                console.log('합치기 완료.');
              })
              .on('error', (err) => {
                console.error('오류 발생:', err.message);
              })
              .run();
          });
      });
  });
}

function trimAudio(startTime, endTime){
    const inputFilePath = '/home/mingyu/prototype/sample.mp3';
    const outputFilePath = '/home/mingyu/prototype/result.mp3';
    ffmpeg(inputFilePath)
      .outputOptions([
        '-af',
        `atrim=start=${startTime}:end=${endTime},asetpts=PTS-STARTPTS`,
      ])
      .save(outputFilePath)
}

// trimSelectedTime(10, 15);
trimAudio(0, 15);
