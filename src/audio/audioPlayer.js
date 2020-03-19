import BackgroundMusic from './backgroundMusic.js';

export default class AudioPlayer {
  constructor() {
    this.sounds = {};
    this.initAudioClips();
    this.backgroundMusic = new BackgroundMusic(this);
  }
  
  initAudioClips() {
    this.sounds['fire'] = new Audio('sounds/fire.mp3');
    this.sounds['thrust'] = new Audio('sounds/thrust.mp3');
    this.sounds['beat1'] = new Audio('sounds/beat1.mp3');
    this.sounds['beat2'] = new Audio('sounds/beat2.mp3');
    this.sounds['bangLarge'] = new Audio('sounds/bangLarge.mp3');
    this.sounds['bangMedium'] = new Audio('sounds/bangMedium.mp3');
    this.sounds['bangSmall'] = new Audio('sounds/bangSmall.mp3');
    this.sounds['extraShip'] = new Audio('sounds/extraShip.mp3');
    this.sounds['saucerBig'] = new Audio('sounds/saucerBig.mp3');
    this.sounds['saucerSmall'] = new Audio('sounds/saucerSmall.mp3');
  }

  playClip(key) {
    this.getAudioClip(key).play();
  }

  static cloneAudioClip(clip) {
    return clip.cloneNode();
  }

  getAudioClip(key) {
    return AudioPlayer.cloneAudioClip(this.sounds[key]);
  }
}
