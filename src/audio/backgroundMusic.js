const minSpeed = 1000;
const maxSpeed = 200;
const beatAcceleration = 0.01;

export default class BackgroundMusic {
  constructor(audioPlayer) {
    this.beat1 = audioPlayer.getAudioClip('beat1');
    this.beat2 = audioPlayer.getAudioClip('beat2');
    this.isPlaying = false;
    this.speed = minSpeed;
    this.timeToBeat = 0;
    this.isFirstBeat = true;
  }

  update(deltaTime) {
    if (this.isPlaying) {
      if (this.speed > maxSpeed) {
        this.speed -= beatAcceleration * deltaTime;
        if (this.speed < maxSpeed) {
          this.speed = maxSpeed;
        }
      }
      
      this.timeToBeat -= deltaTime;

      if (this.timeToBeat <= 0) {
        this.timeToBeat = this.speed;

        if (this.isFirstBeat) {
          this.beat1.play();
        } else {
          this.beat2.play();
        }

        this.isFirstBeat = !this.isFirstBeat;
      }
    }
  }

  setMinSpeed() {
    this.speed = minSpeed;
  }

  play() {
    if (this.isPlaying) {
      return;
    }

    this.isPlaying = true;
    this.isFirstBeat = true;
    this.timeToBeat = this.speed;
  }

  stop() {
    if (this.isPlaying) {
      this.isPlaying = false;
    }
  }
}
