const topScoresCount = 5;

export default class ScoresCollection {
  constructor() {
    this.scores = [];
    this.latestScore = 0;
  }

  isHighscore(score) {
    const scoresCount = this.scores.length;

    return scoresCount < topScoresCount || score > this.scores[scoresCount - 1].score;
  }

  registerLatestScore(latestScore) {
    this.latestScore = latestScore;
  }

  registerScore(score, initials) {
    this.registerLatestScore(score);

    const scoresCount = this.scores.length;
    if (scoresCount < topScoresCount || score > this.scores[scoresCount - 1].score) {
      if (scoresCount === topScoresCount) {
        this.scores.pop();
      }

      this.scores.push({
        score: score,
        initials: initials
      });

     this.scores.sort((a, b) => b.score - a.score);
    }
  }

  get highestScore() {
    if (this.scores.length === 0) {
      return 0
    }
    
    return this.scores[0].score;
  }
}
