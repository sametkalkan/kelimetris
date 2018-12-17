var config = {
    type: Phaser.AUTO,
    width: gameWidth+ 1 ,
    height: gameHeight,
    // parent: document.getElementById("game"),
    scaleMode: Phaser.ScaleManager.SHOW_ALL,

    physics: {
        default: 'arcade',
        // arcade: {
        //     gravity: { y: 200 }
        // }
    },
    scene: {
        preload: Game.preload, create: Game.create, update: Game.update
    }
};

var game = new Phaser.Game(config);

game.state.add('Game', Game);
game.state.add('Menu', Menu);
game.state.start('Menu');

function placeSeparators() {
    var leftSeparator = game.add.graphics(0, 0);
    leftSeparator.lineStyle(3, 0xffffff, 1);
    leftSeparator.lineTo(0, game.world.height);
    var rightSeparator = game.add.graphics(gameWidth + menuWidth - 3, 0);
    rightSeparator.lineStyle(3, 0xffffff, 1);
    rightSeparator.lineTo(0, game.world.height);
}

function startButton(pos) { // pos = 1 : display on menu sreen, pos = 2: display on leaderboard
    var y = (pos == 1 ? 400 : 550);
    var button = game.add.button(game.world.centerX, y, 'button', startGame, this, 2, 1, 0);
    button.anchor.setTo(0.5);
}

function startGame() {
    game.state.start('Game');
}
function loadLeaderboard(){
    //reloads the game
    location.reload();

    game.state.start('Leaderboard');
}