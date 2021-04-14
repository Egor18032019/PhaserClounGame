const formatScore = (score) => `Шагов с грузом: ${score}`;

export default class CargoLabel extends Phaser.GameObjects.Text {
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