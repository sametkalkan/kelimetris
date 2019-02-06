
var Leaderboard = {};

Leaderboard.preload = function(){};

Leaderboard.create = function(){
    var ldb = game.add.bitmapText(game.world.centerX, 80, 'videogame', 'LEADERBOARD',64);
    ldb.anchor.setTo(0.5);

};