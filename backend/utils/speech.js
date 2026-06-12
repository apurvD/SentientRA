import sdk from 'microsoft-cognitiveservices-speech-sdk';

/**
 * Acoustic Synthesis Engine: Converts text descriptions into raw audio streams.
 * @param {string} textToSpeak - The raw screen reader transcript simulation.
 * @returns {Promise<Buffer>} Binary audio stream buffer (MPEG/Audio).
 */
export function synthesizeSpeechStream(textToSpeak) {
  return new Promise((resolve, reject) => {
    // Initialize speech config with subscription context
    const speechConfig = sdk.SpeechConfig.fromSubscription(
      process.env.AZURE_SPEECH_KEY,
      process.env.AZURE_SPEECH_REGION
    );

    // Set the output format to standard MP3 stream format for seamless HTML5 playback
    speechConfig.speechSynthesisOutputFormat = sdk.SpeechSynthesisOutputFormat.Audio16Khz128KBitRateMonoMp3;

    // Use a clear, empathetic narrator voice (e.g., Jenny)
    speechConfig.speechSynthesisVoiceName = 'en-US-JennyNeural';

    // Configure the synthesizer to write straight into an in-memory stream buffer
    const pullStream = sdk.AudioOutputStream.createPullStream();
    const audioConfig = sdk.AudioConfig.fromStreamOutput(pullStream);

    const synthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig);

    synthesizer.speakTextAsync(
      textToSpeak,
      (result) => {
        if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
          // Convert the internal raw array buffer directly to a Node.js executable Buffer
          const audioBuffer = Buffer.from(result.audioData);
          synthesizer.close();
          resolve(audioBuffer);
        } else {
          synthesizer.close();
          reject(new Error(`Speech synthesis split out early: ${result.errorDetails || 'Unknown Reason'}`));
        }
      },
      (error) => {
        synthesizer.close();
        reject(error);
      }
    );
  });
}