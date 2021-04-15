import ScoreLabel from './ui/ScoreLabel.js';
import StepsLabel from './ui/StepsLabel.js';
import CargoLabel from './ui/CargoLabel.js';
import onSetupFormSubmit from '../src/utils/submit_score.js';


export default class PlatformScene extends Phaser.Scene {
  constructor() {
    super({
      key: `PlatformScene`
    });
    this.cursors = null;
    this.light;
    this.offsets = [];
    this.player = null;
    this.layer;
  }

  preload() {

  }

  makeAnimePlayer() {
    this.anims.create({
      key: `left`,
      frames: this.anims.generateFrameNumbers(`player`, {
        frames: [1, 7, 1, 13]
      }),
      frameRate: 10,
      repeat: -1
    });
    // анимация клавиши 'right' для персонажа
    this.anims.create({
      key: `right`,
      frames: this.anims.generateFrameNumbers(`player`, {
        frames: [1, 7, 1, 13]
      }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: `up`,
      frames: this.anims.generateFrameNumbers(`player`, {
        frames: [2, 8, 2, 14]
      }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: `down`,
      frames: this.anims.generateFrameNumbers(`player`, {
        frames: [0, 6, 0, 12]
      }),
      frameRate: 10,
      repeat: -1
    });

  }
  makeLight() {
    this.light = this.lights.addLight(0, 0, 200).setScrollFactor(0.0);
    this.lights.enable().setAmbientColor(0x555555);
    this.lights.addLight(0, 100, 100).setColor(0xff0000).setIntensity(2.0);
  }

  collectStar(player, star) {
    if (player.body.velocity.x !== 0) {
      star.body.setVelocityX(player.body.velocity.x);
    } else {
      star.body.setVelocityY(player.body.velocity.y);
    }
  }

  createStars() {
    const stars = this.physics.add.group({
      key: `star`,
      repeat: 5,
      setXY: {
        x: 50,
        y: 160,
        stepX: 70,
      },
    });
    return stars;
  }

  createScoreLabel(x, y, score) {
    const style = {
      fontSize: `32px`,
      fill: `red`,
    };
    const label = new ScoreLabel(this, x, y, score, style);
    this.add.existing(label);
    return label;
  }
  createStepsLabel(x, y, score) {
    const style = {
      fontSize: `32px`,
      fill: `orange`,
    };
    const label = new StepsLabel(this, x, y, score, style);
    this.add.existing(label);
    return label;
  }
  createCargoLabel(x, y, score) {
    const style = {
      fontSize: `32px`,
      fill: `white`,
    };
    const label = new CargoLabel(this, x, y, score, style);
    this.add.existing(label);
    return label;
  }


  stop(star, player) {
    this.CargoLabel.add(1);
    if (player.body.velocity.x !== 0) {
      if (player.body.velocity.x < 0) {
        star.body.setVelocityX(-0.001);
      } else {
        star.body.setVelocityX(0.001);
      }
    } else {
      if (player.body.velocity.y < 0) {
        star.body.setVelocityY(-0.001);
      } else {
        star.body.setVelocityY(0.001);
      }
    }
  }

  destroy(first, second) {
    this.scoreLabel.add(10);
    first.destroy()
    const data = this.scoreLabel.getScore()
    if(data>=60){
      onSetupFormSubmit(data)
    }
  }
  setStop(first, second) {
    first.setImmovable(true)
    second.setImmovable(true)
  }
  create() {
    this.map = this.make.tilemap({
      key: 'map',
      tileWidth: 32,
      tileHeight: 32
    });
    this.tiles = this.map.addTilesetImage('bloks', null, 32, 32, 1, 2);
    this.layer = this.map.createLayer(0, this.tiles, 0, 0).setPipeline('Light2D')

    this.scoreLabel = this.createScoreLabel(544, 366, 0);
    this.StepsLabel = this.createStepsLabel(0, 366, 0);
    this.CargoLabel = this.createCargoLabel(0, 400, 0);

    this.player = this.physics.add.sprite(400, 266, `player`, 6)
    this.danger = this.physics.add.image(611, 244, `red`)
    // this.stars = this.createStars()
    this.star6 = this.physics.add.image(266, 145, `star`)
    this.star5 = this.physics.add.image(240, 111, `star`)
    this.star4 = this.physics.add.image(175, 88, `star`)
    this.star3 = this.physics.add.image(175, 140, `star`)
    this.star2 = this.physics.add.image(175, 241, `star`)
    this.star1 = this.physics.add.image(85, 241, `star`)
    this.star1.setCollideWorldBounds(true);

    //  // Далее ограничим игрока границами карты. Сначала мы устанавливаем границы мира, а затем устанавливаем
    this.physics.world.bounds.width = this.map.widthInPixels;
    this.physics.world.bounds.height = this.map.heightInPixels;
    this.player.setInteractive().setCollideWorldBounds();
    //делает все тайлы в слое obstacles  доступными для обнаружения столкновений (отправляет 0 если -1 то проникает с внешней стороны)
    this.map.setCollisionByExclusion([0]);

    //  // запрещаем проходить сквозь 
    this.physics.add.collider(this.player, this.layer);
    this.physics.add.collider(this.star1, this.layer);
    this.physics.add.collider(this.star2, this.layer);
    this.physics.add.collider(this.star3, this.layer);
    this.physics.add.collider(this.star4, this.layer);
    this.physics.add.collider(this.star5, this.layer);
    this.physics.add.collider(this.star6, this.layer);
    this.physics.add.collider(this.star1, this.tiles);

    this.physics.add.collider(this.star1, this.player, this.stop, null, this);
    this.physics.add.collider(this.star2, this.player, this.stop, null, this);
    this.physics.add.collider(this.star3, this.player, this.stop, null, this);
    this.physics.add.collider(this.star4, this.player, this.stop, null, this);
    this.physics.add.collider(this.star5, this.player, this.stop, null, this);
    this.physics.add.collider(this.star6, this.player, this.stop, null, this);

    this.physics.add.collider(this.star1, this.danger, this.destroy, null, this);
    this.physics.add.collider(this.star2, this.danger, this.destroy, null, this);
    this.physics.add.collider(this.star3, this.danger, this.destroy, null, this);
    this.physics.add.collider(this.star4, this.danger, this.destroy, null, this);
    this.physics.add.collider(this.star5, this.danger, this.destroy, null, this);
    this.physics.add.collider(this.star6, this.danger, this.destroy, null, this);

    this.physics.add.overlap(this.star1, this.star2, this.setStop, null, this);
    this.physics.add.overlap(this.star1, this.star3, this.setStop, null, this);
    this.physics.add.overlap(this.star1, this.star4, this.setStop, null, this);
    this.physics.add.overlap(this.star1, this.star5, this.setStop, null, this);
    this.physics.add.overlap(this.star1, this.star6, this.setStop, null, this);
    this.physics.add.overlap(this.star2, this.star3, this.setStop, null, this);
    this.physics.add.overlap(this.star2, this.star4, this.setStop, null, this);
    this.physics.add.overlap(this.star2, this.star5, this.setStop, null, this);
    this.physics.add.overlap(this.star2, this.star6, this.setStop, null, this);
    this.physics.add.overlap(this.star3, this.star4, this.setStop, null, this);
    this.physics.add.overlap(this.star3, this.star5, this.setStop, null, this);
    this.physics.add.overlap(this.star3, this.star6, this.setStop, null, this);
    this.physics.add.overlap(this.star4, this.star5, this.setStop, null, this);
    this.physics.add.overlap(this.star4, this.star6, this.setStop, null, this);
    this.physics.add.overlap(this.star5, this.star6, this.setStop, null, this);

    this.cursors = this.input.keyboard.createCursorKeys();

    // ограничиваем камеру размерами карты
    this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
    // заставляем камеру следовать за игроком
    this.cameras.main.startFollow(this.player);
    // своего рода хак, чтобы предотвратить пояление полос в тайлах
    this.cameras.main.roundPixels = true;

    this.makeAnimePlayer()
    this.makeLight()
  }

  update() {
    // Сначала мы устанавливаем скорость тела на 0.
    this.player.body.setVelocity(0);
    // горизонтальное перемещение
    if (this.cursors.left.isDown) {
      var tile = this.layer.getTileAtWorldXY(this.player.x - 11, this.player.y + 2, true);

      if (tile.index === 2) {
        //  Blocked, we can't move
      } else {
        this.player.body.setVelocityX(-80);
      }
    } else if (this.cursors.right.isDown) {
      var tile = this.layer.getTileAtWorldXY(this.player.x + 11, this.player.y + 2, true);

      if (tile.index === 2) {
        //  Blocked, we can't move
      } else {
        this.player.body.setVelocityX(80);
      }
    }
    // вертикальное перемещение
    if (this.cursors.up.isDown) {
      var tile = this.layer.getTileAtWorldXY(this.player.x + 2, this.player.y - 16, true);

      if (tile.index === 2) {
        //  Blocked, we can't move
      } else {
        this.player.body.setVelocityY(-80);
      }
    } else if (this.cursors.down.isDown) {
      //  console.log(this.player.body);
      var tile = this.layer.getTileAtWorldXY(this.player.x + 2, this.player.y + 16, true);
      if (tile.index === 2) {
        //  Blocked, we can't move
      } else {
        this.player.body.setVelocityY(80);
      }
    }

    // В конце обновляем анимацию и устанавливаем приоритет анимации
    // left/right над анимацией up/down
    if (this.cursors.left.isDown) {
      this.StepsLabel.add(1);
      this.player.anims.play(`left`, true);
      this.player.flipX = true; // Разворачиваем спрайты персонажа вдоль оси X
    } else if (this.cursors.right.isDown) {
      this.StepsLabel.add(1);
      this.player.anims.play(`right`, true);
      this.player.flipX = false; // Отменяем разворот спрайтов персонажа вдоль оси X
    } else if (this.cursors.up.isDown) {
      this.StepsLabel.add(1);
      this.player.anims.play(`up`, true);
    } else if (this.cursors.down.isDown) {
      this.StepsLabel.add(1);
      this.player.anims.play(`down`, true);
    } else {
      this.player.anims.stop();
    }

    this.light.x = this.player.x;
    this.light.y = this.player.y;

  }
}