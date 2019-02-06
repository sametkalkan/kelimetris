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
    /*var liste;
    var xmlhttp = new XMLHttpRequest();   // new HttpRequest instance


    xmlhttp.open("GET", "http://10.100.19.137:5000/");
    xmlhttp.setRequestHeader("Content-Type", "application/json");
    xmlhttp.send();
    setTimeout(function(){
        //do what you need here
    }, 2000);
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4) {

            liste = JSON.parse(xmlhttp.response);
            window.alert(liste.output)
        }
    };*/

    /*var liste;
    var xmlhttp = new XMLHttpRequest();   // new HttpRequest instance




    xmlhttp.open("GET", "http://10.100.19.137:5000/", true);
    xmlhttp.setRequestHeader("Content-Type", "application/json");


    xmlhttp.onreadystatechange = function() {
        window.alert("moruk");
        if (this.readyState == 4) {
            liste = JSON.parse(xmlhttp.response);
            var li = [];

            for(var i = 0; i < 10; i++){
                li[i] = liste.output[i];
            }
            window.alert(li);
            this.word = li;

        }
    };
    window.alert("onur");
    xmlhttp.send();
    */

    //getData();

    //window.alert(this.liste);
    var y = (pos == 1 ? 400 : 550);
    var button = game.add.button(game.world.centerX, y, 'button', startGame, this, 2, 1, 0);
    button.anchor.setTo(0.5);



}



function getData(){       //this will read file and send information to other function
    /*var xmlhttp;

    if (window.XMLHttpRequest) {
        xmlhttp = new XMLHttpRequest();
    }
    else {
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }

    xmlhttp.onreadystatechange = await function () {
        if (xmlhttp.readyState == 4) {
            var lines = xmlhttp.responseText;    //*here we get all lines from text file*

            intoArray(lines);
        }
    }

    xmlhttp.open("GET", "http://10.100.19.137:5000/", true);
    xmlhttp.send();*/
}
var liste = [];

function intoArray (lines) {
    // splitting all text data into array "\n" is splitting data from each new line
    //and saving each new line as each element*

    //var lineArr = lines.split('\n');
    //this.liste = lineArr;
    //window.alert(this.liste);
    //just to check if it works output lineArr[index] as below

}



function startGame() {
    game.state.start('Game');
}
function loadLeaderboard(){
    //reloads the game
    location.reload();

    game.state.start('Leaderboard');
}