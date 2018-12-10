Game.radio = { // object that stores sound-related information
    soundOn : true,
    moveSound : null,
    gameOverSound : null,
    winSound : null,
    music : null,
    // Play music if all conditions are met
    playMusic : function(){
        if(Game.radio.soundOn){
            Game.radio.music.resume();
        }
    },
    // Toggle sound on/off
    manageSound : function(sprite){
        sprite.frame = 1- sprite.frame;
        Game.radio.soundOn = !Game.radio.soundOn;
        if(Game.radio.soundOn){
            Game.radio.playMusic();
        }else{
            Game.radio.music.pause();
        }
    },
    // Play sound if all conditions are met
    playSound : function(sound) {
        if (Game.radio.soundOn) {
            sound.play();
        }
    }
};

function loadElements() {
        loadImages();
        loadSounds();
}

function loadImages() {
    game.load.image('sky', 'assets/ground2.jpeg');
    game.load.image('blue_block', 'assets/blue_unit.png');
    game.load.image('green_block', 'assets/green_unit.png');
    game.load.image('red_block', 'assets/red_unit.png');
    game.load.image('yellow_block', 'assets/purple_unit.png');
    game.load.image('ground', 'assets/ground.png');
    game.load.image('strip', 'assets/strip.jpg');

    game.load.bitmapFont('desyrel', 'assets/fonts/desyrel.png', 'assets/fonts/desyrel.xml');

    game.load.spritesheet('sound', 'assets/sound.png', 32, 32); // Icon to turn sound on/off
}

function loadSounds() {
    game.load.audio('move','assets/sound/move.mp3','assets/sound/move.ogg');
    game.load.audio('move', 'assets/sound/move.mp3', 'assets/sound/move.ogg');
    game.load.audio('win', 'assets/sound/win.mp3', 'assets/sound/win.ogg');
    game.load.audio('gameover', 'assets/sound/gameover.mp3', 'assets/sound/gameover.ogg');
    game.load.audio('music', 'assets/sound/tetris.mp3'); // load music now so it's loaded by the time the game starts
}

function createElements() {
    game.add.sprite(0, 0, 'sky');  // background image
    strip = game.add.sprite(75, 40, 'strip');  // background image
    strip.scale.setTo(0.5, 0.25);
    createGround();
    soundOnOff();
    createScore();
    createTextBox();
    createLabelOnTheGround();
}

function createScore() {
    scoreTitle = game.add.bitmapText(20, 5, 'desyrel', 'Score', 30);

    scoreText = game.add.bitmapText(60, 32, 'desyrel', '0', 30);
    scoreText.text = '0';

    var center = scoreTitle.x + scoreTitle.textWidth / 2;
    scoreText.x = center - (scoreText.textWidth * 0.5);
}

function createSounds() {
    Game.radio.moveSound = game.add.audio('move');
    Game.radio.winSound = game.add.audio('win');
    Game.radio.gameOverSound = game.add.audio('gameover');
    Game.radio.music = game.add.audio('music');
    Game.radio.music.volume = 0.2;
    Game.radio.music.loopFull();
}

function soundOnOff() {
    sound = game.add.sprite(game.world.width-38, 0, 'sound', 0);
    sound.inputEnabled = true;
    sound.events.onInputDown.add(Game.radio.manageSound, this);
}

function createGround() {
    ground = game.add.sprite(0, game.world.height - 64  , 'ground');
    game.physics.enable(ground, Phaser.Physics.ARCADE);
    // ground.body.allowGravity = false;
    ground.body.immovable = true;
    ground.enableBody = true;
}

function createLabelOnTheGround() {
    wordLabel = game.add.text(5, 3, "", {font: "20px Times New Roman", fill: "#ffffff", align: "center"});
    ground.addChild(wordLabel);
}

function createTextBox() {
    txtBox = game.add.inputField(0, game.height-ground.height/3, {
        font: '18px Arial',
        fill: '#212121',
        fontWeight: 'bold',
        width: game.width-13,
        padding: 5,
        borderWidth: 1,
        borderColor: '#000',
        borderRadius: 7,
        placeHolder: 'Type and press enter',
        type: PhaserInput.InputType.text,
        focusOutOnEnter: true,
        blockInput: true
    });
    // txtBox.startFocus();
    game.scale.refresh();
    txtBox.keyListener = textBoxListener;
}

function textBoxListener(evt) {
    this.value = this.getFormattedText(this.domElement.value);

    if (evt.keyCode === 13) {
        findSimilarity(this.value);

        this.resetText();
        this.endFocus();
        this.startFocus();
        return;
    }

    this.updateText();
    this.updateCursor();
    this.updateSelection();
    evt.preventDefault();
}

