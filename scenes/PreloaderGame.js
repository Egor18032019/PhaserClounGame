 export default class PreloaderGame extends Phaser.Scene {
   constructor() {
     super({
       key: `PreloaderGame`
     });

   }

   loadProgressBar() {
     let progressBar = this.add.graphics();
     let progressBox = this.add.graphics();
     let width = this.cameras.main.width;
      let height = this.cameras.main.height;
 
     let loadingText = this.make.text({
       x: width / 2,
       y: height / 2 - 50,
       text: `Загрузка...`,
       style: {
         font: `20px monospace`,
         fill: `#ffffff`
       }
     });
     loadingText.setOrigin(0.5, 0.5);

     let percentText = this.make.text({
       x: width / 2,
       y: height / 2 - 5,
       text: `0%`,
       style: {
         font: `18px monospace`,
         fill: `#ffffff`
       }
     });
     percentText.setOrigin(0.5, 0.5);

     let assetText = this.make.text({
       x: width / 2,
       y: height / 2 + 50,
       text: ``,
       style: {
         font: `18px monospace`,
         fill: `#ffffff`
       }
     });
     assetText.setOrigin(0.5, 0.5);

     progressBox.fillStyle(0x222222, 0.8);
     progressBox.fillRect(width / 4 + 40, height / 2 - 30, width / 8 * 3 + 20, 50); //(240, 270, 320, 50)

     this.load.on(`progress`, function (value) {
       percentText.setText(parseInt(value * 100) + `%`);
       progressBar.clear();
       progressBar.fillStyle(0xffffff, 1);
       progressBar.fillRect(width / 4 + 50, height / 2 - 20, width / 8 * 3 * value, 30); //(250, 280, 300 * value, 30);
     });

     this.load.on(`fileprogress`, function (file) {
       assetText.setText(`Загрузка ресурса: ` + file.key);
     });

     this.load.on(`complete`, function () {
       progressBar.destroy();
       progressBox.destroy();
       loadingText.destroy();
       percentText.destroy();
       assetText.destroy();
     });

   }

   preload() {

     this.loadProgressBar();

     // здесь происходит загрузка ресурсов
     this.load.image('bloks', './assets/drawtiles1.png');
    //  this.load.tilemapTiledJSON(`map`, `./assets/map/map.json`);
     this.load.image(`tiles`, `./assets/map/spritesheet.png`);

     this.load.tilemapCSV('map', './assets/grid1.csv');
     this.load.image(`star`, `./assets/star.png`);
     this.load.image(`bomb`, `./assets/bomb.png`);
     this.load.image(`red`, `http://labs.phaser.io/assets/particles/red.png`);

     this.load.spritesheet(`player`, `./assets/RPG_assets.png`, {
      frameWidth: 16,
      frameHeight: 16
    });
   }


   create() {
     // let logo = this.add.image(400, 300, `logo`);
     this.scene.start(`PlatformScene`, false);
   }

   update() {}
 }