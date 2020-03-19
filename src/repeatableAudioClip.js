export default class RepeatableAudioClip {
  constructor(clipName, audioPlayer) {
    this.audioClip = audioPlayer.getAudioClip(clipName);
    this.audioClip.loop = true;
    this.isPlaying = false;
  }

  play() {
    if (this.isPlaying) {
      return;
    }

    this.isPlaying = true;
    this.audioClip.play();
  }

  stop() {
    if (this.isPlaying) {
      this.isPlaying = false;
      this.audioClip.pause();
      this.audioClip.currentTime = 0;
    }
  }
}
