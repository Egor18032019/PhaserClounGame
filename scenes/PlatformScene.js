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
     if(player.body.velocity.x!==0){
       star.body.setVelocityX(player.body.velocity.x);
     }
     else {
       star.body.setVelocityY(player.body.velocity.y);
     }
     star.setFriction(1);
     if (player.body.velocity.x > 0) {
       //  star.x = +80;
     } else if (player.body.velocity.y > 0) {
       //  star.y = +80;
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

   stop() {
     this.body.setVelocityX(0);
     this.body.setVelocityY(0);
   }

   setStop(star) {
     this.time.addEvent({
       delay: 200,
       callback: this.stop,
       callbackScope: star
     });
   }
   create() {
     this.map = this.make.tilemap({
       key: 'map',
       tileWidth: 32,
       tileHeight: 32
     });
     this.tiles = this.map.addTilesetImage('bloks', null, 32, 32, 1, 2);

     this.layer = this.map.createLayer(0, this.tiles, 0, 0).setPipeline('Light2D')
     this.player = this.physics.add.sprite(332, 276, `player`, 6);
     // this.stars = this.createStars()
     this.star2 = this.physics.add.image(202, 100, `star`)
     this.star3 = this.physics.add.image(202, 144, `star`)
     this.star1 = this.physics.add.image(202, 243, `star`)
     const bomb = this.physics.add.sprite(50, 242, "bomb");
     //  // Далее ограничим игрока границами карты. Сначала мы устанавливаем границы мира, а затем устанавливаем
     this.physics.world.bounds.width = this.map.widthInPixels;
     this.physics.world.bounds.height = this.map.heightInPixels;
     this.player.setCollideWorldBounds(true);
     bomb.setCollideWorldBounds(true);

     //делает все тайлы в слое obstacles  доступными для обнаружения столкновений (отправляет 0 если -1 то проникает с внешней стороны)
     this.map.setCollisionByExclusion([0]);

     //  // запрещаем проходить сквозь камни
     this.physics.add.collider(this.player, this.layer);
     this.physics.add.collider(this.star1, this.layer);
     this.physics.add.collider(this.star1, this.tiles);
     this.physics.add.collider(this.star1, this.player, this.setStop, null, this);
     this.physics.add.collider(this.star2, this.player, this.setStop, null, this);
     this.physics.add.collider(this.star3, this.player, this.setStop, null, this);
     this.physics.add.collider(this.star2, this.layer);
     this.physics.add.collider(this.star3, this.layer);
     this.physics.add.collider(bomb, this.layer);
     //  this.physics.add.overlap(this.player, this.star1, this.collectStar, null, this);
     this.physics.add.overlap(this.player, this.star2, this.collectStar, null, this);
     this.physics.add.overlap(this.player, this.star3, this.collectStar, null, this);
     this.physics.add.overlap(this.player, bomb, this.collectStar, null, this);

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
       this.player.anims.play(`left`, true);
       this.player.flipX = true; // Разворачиваем спрайты персонажа вдоль оси X
     } else if (this.cursors.right.isDown) {
       this.player.anims.play(`right`, true);
       this.player.flipX = false; // Отменяем разворот спрайтов персонажа вдоль оси X
     } else if (this.cursors.up.isDown) {
       this.player.anims.play(`up`, true);
     } else if (this.cursors.down.isDown) {
       this.player.anims.play(`down`, true);
     } else {
       this.player.anims.stop();
     }

     this.light.x = this.player.x;
     this.light.y = this.player.y;

   }
 }