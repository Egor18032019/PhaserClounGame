const formatScore = (score) => `Шагов: ${score}`;

export default class StepsLabel extends Phaser.GameObjects.Text {
    constructor(scene, x, y, score, style) {
        super(scene, x, y, formatScore(score), style);
        this.score = score;
    }

    setScore(score) {
        this.score = score;
        this.updateScoreText();
    }

    add(points) {
        this.setScore(this.score + points);
    }

    updateScoreText() {
        this.setText(formatScore(this.score));
    }
}