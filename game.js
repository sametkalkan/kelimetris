
var xmlhttp = new XMLHttpRequest();

var Game = {};

var menuWidth = 300;
var blockSize = 64; // px
var numBlocksY = 9; // make the grid 8 blocks high
var numBlocksX = 10; // make the grid 10 blocks wide
var gameWidth = numBlocksX * blockSize; // width of the grid in pixels
var gameHeight = numBlocksY * blockSize+50; // width of the grid in pixels

var initial_row = 3;
var initial_column=8;

var txtBox;
var gameOverTxtBox;

var block_colors = ['blue_block', 'green_block', 'red_block', 'purple_block'];

var scoreTitle, scoreText, timer, loop;
var score = 0;

var words = [];
var liste = [];
var blocks = [];  // existing block on the screen

var ground;
var sound;  // background music

var wordLabel;  // label on the ground

var strip;
let score_add;

var isGameOver = false;

Game.preload = function () {


        loadElements();
};

Game.create = function () {

    game.add.plugin(PhaserInput.Plugin);


    createElements();

    createSounds();  // creates the sounds

    // init_words
    init_words();

    init_blocks(initial_row, initial_column, 700);


};


Game.update = function () {
        game.physics.arcade.collide(ground, blocks, collision_handler2);
        game.physics.arcade.collide(blocks, blocks, collision_handler);
};

    function collision_handler2(ground, block){
        block.body.immovable = true;
    }

    function collision_handler(block1, block2){
        block1.body.immovable = true;
        block2.body.immovable = true;

    }

    /**
     * falls blocks over the killed blocks.
     */
    function makeMovable() {
        for (let i = 0; i < blocks.length; i++) {
            blocks[i].body.immovable = false;
            blocks[i].body.velocity.y = 300+blocks[i].body.y/100;
        }
    }

function removeText() {
    score_add.destroy();
}

/**
     * tıklanan blokla aynı renkteki tüm blokları siler.
     * @param block
     */
    async function blockClick(block) {

        if (isGameOver) {
            return;
        }
        blocks.inputEnabled = false;
        var same_color_blocks = findSameColorBlock(block);  // aynı renkteki blokları getirir.
        var blocks_to_be_killed = findNeighborsChain(block, same_color_blocks);

        await sleep(1000);
        for(let j=0;j<blocks_to_be_killed.length;j++){
            reverseShade(blocks_to_be_killed[j]);
        }
        await sleep(1000);
        for(var i=0;i<blocks_to_be_killed.length;i++){
            //console.log(blocks_to_be_killed[i].i);
            // var tween = game.add.tween(sceneSprites[k][line]);
            // tween.to({ y: 0}, 500,null,false,delay);
            // tween.onComplete.add(destroy, this);
            // tween.start();
            // sceneSprites[k][line] = null;
            // scene[k][line] = 0;
            // delay += 50; // For each block, start the tween 50ms later so they move wave-like
            //
            // blocks_to_be_killed[i].body.collideWorldBounds=false;
            // blocks_to_be_killed[i].body.checkCollision=false;

            //--------------------Block Animation-------------------------------
            var kill_block = blocks_to_be_killed[i];
            var moveTween = game.add.tween(kill_block);
            moveTween.to({x: scoreText.x+10, y: scoreText.y+15}, 100, Phaser.Easing.Linear.None);
            // moveTween.onComplete.add(function () {
            //
            //
            // }, this);
            var scaleTween = game.add.tween(kill_block.scale);
            scaleTween.to({x: 0, y: 0}, 500, Phaser.Easing.Linear.None);
            scaleTween.onComplete.addOnce(function () {
                kill_block.kill();
            }, this);

            //--------------------+50 Animation---------------------------------
            score_add = game.add.bitmapText(blocks_to_be_killed[i].x, blocks_to_be_killed[i].y, 'desyrel',
                '+50', 30);
            score_add.anchor.setTo(0.5);
            let moveScore = game.add.tween(score_add);
            moveScore.to({x: 0, y: -20}, 700, Phaser.Easing.Linear.None);
            // moveScore.onComplete.addOnce(function () {
            //     score_add.destroy();
            // }, this);






            moveTween.start();
            scaleTween.start();
            moveScore.start();
            // scaleScore.start();

            // blocks_to_be_killed[i].kill();
            score += 50;
        }

        blocks = blocks.filter((el) => !blocks_to_be_killed.includes(el));

        Game.radio.playSound(Game.radio.winSound);
        this.scoreText.setText(score);
        await sleep(1000);
        for(let j=0;j<blocks.length;j++){
            reverseShade(blocks[j]);
        }
        makeMovable(createNextBlocks(Math.floor(Math.random() * 4) + 2));
    }


    function getNewWords(num) {
        var similarityList = []
        for(var i = 0; i < 10; i++){
            var word = findWord(this.words);
            if(containsObject(word.split('\n')[0], blocks)){
                i--;
            }
            else{
                similarityList.push(word);
            }
        }
        //TODO query is required, the words as many as the number of 'num' must be fetched.
        //let words = ["perde", "domates", "kulaklık", "yatak", "kelebek", "yılan", "ahtapot"];

        return similarityList.slice(0, num);
    }

    function createNextBlocks(num) {

        var newWords = getNewWords(num)

        var pos = findPositions(num, newWords);
        var keys = Object.keys(pos);

        var j=0;

        var i;
        for(i=0;i<keys.length;i++) {
            setTimeout( function timer(){
                if (isGameOver) {
                    return;
                }

                var height = 1 + Math.floor(Math.random() * 2);
                var word = pos[keys[j]];
                var width;
                /* to determine block width */
                if(word.length<=4)
                    width = 1;
                else if(word.length<=10)
                    width = 2;
                else if(word.length<=15)
                    width = 3;

                var color = block_colors[Math.floor(Math.random() * 4)];
                var block = createBlock(keys[j]*64, 0, width, height/2, color, word);
                blocks.push(block);
                j++;
            }, i*300 );
        }

        i++;
        setTimeout(function () {
            if((isGameOver=checkGameOver()))
                processGameOver();
        }, i*300);

        makeMovable();
    }

    function removeElement(arr, value) {
        if(arr.indexOf(value)!==-1){
            arr.splice(arr.indexOf(value), 1);
        }
    }

    function findPositions(num, words) {
        let positions = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 11];

        let pos = {};

        for(let i=0;i<num;i++) {
            let x = Math.floor(Math.random()*positions.length);
            let word = findWord(words);
            let width = 0;
            if(word.length<=4)
                width = 1;
            else if(word.length<=10)
                width = 2;
            else if(word.length<=15)
                width = 3;

            if( !positions.includes(positions[x]+width-1) ) {
                i--;
                continue;
            }
            pos[positions[x]] = word;
            let s = positions[x];
            for(let j=0;j<width;j++){
                removeElement(positions, s+j);
            }
        }
        return pos;
    }


    function checkGameOver() {
        if(isGameOver===true)
            return true;
        for(var i=blocks.length-1;i>=0;i--){
            if(blocks[i].y<=strip.y)
                return true;
        }
        return false;
    }

    function processGameOver() {
        isGameOver = true;
        txtBox.input.enabled = false;
        // game.input.keyboard.enabled = false;
        // game.input.mouse.enabled = false;

        Game.radio.music.pause();
        Game.radio.playSound(Game.radio.gameOverSound);

        makeShade();
        var gameover = game.add.bitmapText(game.world.centerX, 100, 'videogame',
            'GAME OVER!', 50);
        gameover.anchor.setTo(0.5);

        var overall_score = game.add.bitmapText(game.world.centerX, 150, 'desyrel',
            '\n\n\t\t\t\t\t\tYour score is ' + score + ' \n\t\tPlease Enter Your Name', 40);
        overall_score.anchor.setTo(0.5);

        createGameOverTextBox(game.world.centerX-100, 250, 200);

        game.paused = true;

    }


    // Puts a shade on the stage for the game over and pause screens
    function makeShade() {
        shade = game.add.graphics(0, 0);
        shade.beginFill(0x000000, 0.6);
        shade.drawRect(0, 0, game.world.width, game.world.height);
        shade.endFill();
    }

    function getTxtBlockDict() {
        var txt_block_dict = {};
        for(let i=0;i<blocks.length;i++){
            txt_block_dict[lowerFirstCase(blocks[i].txt)] = blocks[i];
        }
        return txt_block_dict;
    }

    function getCurrentWords() {
        var currentWords = [];
        for(let i=0;i<blocks.length;i++){
            currentWords.push(lowerFirstCase(blocks[i].txt));
        }
        return currentWords;
    }

    function fetchSimilarity(inputWord, currentWords) {

        //TODO similarty list will be fetched via query

        var similarityList = []
        for(var i = 0; i < 10; i++){
            var word = findWord(this.words);
            if(containsObject(word.split('\n')[0], blocks)){
                i--;
            }
        }
        //var similarityList = ["perde", "domates", "kulaklık", "yatak", "kelebek", "yılan", "ahtapot"];

        return similarityList;
    }

    async function blink(block){
        game.time.events.add(100, function() {
            // game.add.tween(block).to({y: 0}, 1500, Phaser.Easing.Linear.None, true);
            game.add.tween(block).to({alpha: 300}, 300, Phaser.Easing.Linear.None, true);
        }, this);
        await sleep(600);
        reverseShade(block);
    }

    function getBlock(txt) {
        for(let i=0;i<blocks.length;i++)
            if(lowerFirstCase(blocks[i].txt.trim())===txt)
                return blocks[i];
            return -1;
    }

    function cleanWord(word) {
        var punc = '.,:;~!^+%*-_?!+%&/()=?'
        for(let j=0;j<word.length;j++)
            for(let i=0;i<punc.length;i++)
                word = word.replace(punc[i], '')
        return word
    }

    function lower(word) {
        var letters = { "İ": "i", "I": "ı", "Ş": "ş", "Ğ": "ğ", "Ü": "ü", "Ö": "ö", "Ç": "ç" };
        word = word.replace(/(([İIŞĞÜÇÖ]))/g, function(letter){ return letters[letter]; })
        return word.toLowerCase();
    }
    function lowerFirstCase(word) {
        if (word.length !== 0) {
            return word.charAt(0).toLowerCase() + word.slice(1);
        }
        return "";
    }

    function findSimilarity(inputWord) {
        inputWord = lower(inputWord);
        let block = null;
        for(let i=0;i<blocks.length;i++){
            let inptt = cleanWord(inputWord.trim())
            if(lowerFirstCase(blocks[i].txt.trim())===inptt){
                block = blocks[i];
                blink(block);
                wordLabel.setText(inptt + " - Ekranda bulanan kelimleri kullanamazsınız!");
                wordLabel.fill = "#ff0018";
                return;
            }
        }

        wordLabel.fill = "#ffffff";


        /* 1 ekrandaki blockların üstündeki kelimleri çek  bunları json dosyasının words'une aktar */

        /* bitti */ /* text'e girilen kelimeyi çek bunu da json dosyasının word kısmına aktar */

        /* post ile gönder ve gelen sonuca ait bloğu buluğ onu patlat */

        var name = "";
        var flag = 0;

        for(var i = 0; i < blocks.length; i++){
            if(lowerFirstCase(blocks[i].txt) != ""){
                name +=  lowerFirstCase(blocks[i].txt) + ",";
            }
        }

        if(name[name.length - 1] == ','){
            name = name.slice(0, name.length - 1);
        }

        /*blocks.forEach(function(element) {

            if(element.txt != '')
                name += element.txt + ',';
        });*/

        wordLabel.setText(inputWord);

        //window.alert(name);

        //window.alert(JSON.stringify({word:"word", words:"ya,moruk,hey"}));

        //window.alert(JSON.stringify({word:inputWord, words:name}));

        var xmlhttp = new XMLHttpRequest();   // new HttpRequest instance
        xmlhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                if(xmlhttp.response != null){
                     var liste = JSON.parse(xmlhttp.response)
                    console.log("------------------");
                    if(liste.none==="none"){
                        window.alert("Benzer kelime bulunamadı. Başka bir kelime deneyin.");
                        return;
                    }
                     if(liste.hata !== "null" ){
                         let block = getBlock(liste.hata.trim());
                         blink(block);
                         return;
                     }

                     if(liste.output.length==0){
                         window.alert("Benzer kelime bulunamadı. Başka bir kelime deneyin.");
                         return;
                     }
                     liste = liste.output;
                     //window.alert(liste[0]);
                     for(var i = 0; i < blocks.length; i++){
                        var temp = lowerFirstCase(blocks[i].txt);


                        if(temp.split("\n")[0] == liste[0] && !containsObject(inputWord, blocks)){
                            //window.alert(lowerFirstCase(blocks[i].txt));
                            makeBlocksShade(i);
                            // blockClick(blocks[i]);
                        }
                     }

                }
            }
        };
        xmlhttp.open("POST", "http://0.0.0.0:5000/");
        xmlhttp.setRequestHeader("Content-Type", "application/json");
        xmlhttp.send(JSON.stringify({word:inputWord, words:name}));


        var currentWords = getCurrentWords();

        var similarityList = fetchSimilarity(inputWord, currentWords);

        startExplodeProcess(similarityList);

    }

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


async function makeBlocksShade(top) {

        for(let j=0;j<blocks.length;j++){
            setTimeout( function timer(){
                if(top!==j)
                    makeOneBlockShade(blocks[j]);
            }, j * 100);
        }
        await sleep(3000);
        blockClick(blocks[top]);
        await sleep(2000);
        // for(let j=i;j<blocks.length+i;j++){
        //     setTimeout( function timer(){
        //         reverseShade(blocks[j-i]);
        //     }, j * 100);
        // }

    }

    function makeOneBlockShade(block) {
        game.time.events.add(0, function() {
            // game.add.tween(block).to({y: 0}, 1500, Phaser.Easing.Linear.None, true);
            game.add.tween(block).to({alpha: 500}, 1, Phaser.Easing.Linear.None, true);
        }, this);

    }

    function reverseShade(block) {
        game.time.events.add(0, function() {
            game.add.tween(block).to({alpha: 1}, 1, Phaser.Easing.Linear.None).start();
            // game.add.tween(block).to({alpha: 500}, 1, Phaser.Easing.Linear.None, true);
        }, this);

    }


    function containsObject(obj, list) {
        var i;

        for (i = 0; i < list.length; i++){
            var temp = lowerFirstCase(blocks[i].txt);

            if (temp.split("\n")[0] == obj){
            return true;
            }

        }

        return false;
    }

    //TODO shadow effects etc.
    function startExplodeProcess(similarityList) {

    }

    /**
     * verilen bloğun aynı renkteki komşularını ve onların komşularını bulur.
     * bulma işlemini Depth First Search algoritması ile yapar.
     * @param block
     * @returns {any[]}
     */
    function findNeighborsChain(block, same_color_blocks) {

        var blocks_to_be_killed = new Set([block]);

        var visited = new Array(same_color_blocks.length).fill(false);  // depth first search için gerekli

        function traverse(blck){
            var i = same_color_blocks.indexOf(blck);
            if(visited[i])
                return;

            visited[i] = true;

            var neighbors = findNeighbors(blck, same_color_blocks);  // blokun dokunan tüm komşularını bulur.

            for(var i=0;i<neighbors.length;i++){
                blocks_to_be_killed.add(neighbors[i]);
                traverse(neighbors[i]);
            }
        }

        traverse(block);

        return Array.from(blocks_to_be_killed);
    }

    /**
     * bir bloğun sadece etrafındaki komşuları bulur (sağ sol yukarı aşağı)
     */
    function findNeighbors(block, same_colors) {
        var neighbors = [];
        var neighbor_pos = findNeighboorCoord(block);

        for(var i=0;i<same_colors.length;i++){
            for(var j=0;j<neighbor_pos.length;j++){
                if(same_colors[i].getBounds().contains(neighbor_pos[j].x, neighbor_pos[j].y)){
                    neighbors.push(same_colors[i]);
                }
            }
        }
        return neighbors;
    }

    /**
     *  bloğun etrafının koordinatlarını getirir.
     */
    function findNeighboorCoord(block) {


        var left1={x:-1, y:-1};
        var left2={x:-1, y:-1};

        var right1={x:-1, y:-1};
        var right2={x:-1, y:-1};

        var top1={x:-1, y:-1};
        var top2={x:-1, y:-1};
        var top3={x:-1, y:-1};

        var bottom1={x:-1, y:-1};
        var bottom2={x:-1, y:-1};
        var bottom3={x:-1, y:-1};


        // bir kutunun sağında ya da solunda en fazla 2 tane kutu bulunabileceği(üst üste olabilir) için o iki kutuyu da her zaman kapsar

        right1.x = block.x + block.width + 5;
        right1.y = block.y + 5;

        right2.x = block.x + block.width + 5;
        right2.y = block.y + block.height - 5;


        left1.x = block.x - 5;
        left1.y = block.y + 5;

        left2.x = block.x - 5;
        left2.y = block.y + block.height - 5;


        // alt ve üstte en fazla 3 tane kutu bulunabilir(yan yana)
        //top
        top1.x = block.x + block.width/3 - 5;
        top1.y = block.y - 5;

        top2.x = block.x + 2*block.width/3 - 5;
        top2.y = block.y - 5;

        top3.x = block.x + block.width - 5;
        top3.y = block.y - 5;

        //bottom
        bottom1.x = block.x + block.width/3 - 5;
        bottom1.y = block.y + block.height + 5;

        bottom2.x = block.x + 2*block.width/3 - 5;
        bottom2.y = block.y + block.height + 5;

        bottom3.x = block.x + block.width - 5;
        bottom3.y = block.y + block.height + 5;

        var neighbor_pos = [left1, left2, right1, right2, top1, top2, top3, bottom1, bottom2, bottom3];

        return neighbor_pos;
    }

    /**
     *  girilen blokla aynı renkteki tüm blokları getirir.
     *  tüm blokları kontrol etmek yerine aynı renktekiler üzerinde işlem yapmak için
     * @param block
     * @returns {Array}
     */
    function findSameColorBlock(block) {
        var b = [];
        for(var i=0;i<blocks.length;i++){
            if(blocks[i].color === block.color)
                b.push(blocks[i]);
        }
        return b;
    }



    function init_blocks(row, column, wait) {
        for (let i = 0; i < row; i++) {
                setTimeout( function timer(){
                    createBlocks(column);
                }, i * wait);
            }
        }



    function createBlocks(num) {
        var sum = 0;
        for (let i=0; i<num; i++) {
            setTimeout( function timer(){
                var height = 1 + Math.floor(Math.random() * 2);
                var word = findWord(this.words);
                /* word değişkeni bize ilk başta düşen kelimeleri verecek */
                var width;

                /* to determine block width */
                if(word.length<=4)                    width = 1;
                else if (word.length <= 10)           width = 2;
                else if(word.length<=15)              width = 3;

                if(sum*64+width*64>=game.world.width)
                    return;

                var color = block_colors[Math.floor(Math.random() * 4)];
                var block = createBlock(sum*64, -64, width, height/2, color, word);

                blocks.push(block);

                sum+=width;

                }, i*100 );
            }
    }

    function createBlock(x, y, width, height, color, word) {

        var block = game.add.sprite(x, y, color);
        game.physics.arcade.enable(block);
        block.inputEnabled = true;
        block.events.onInputDown.add(blockClick, this);
        // block.body.collideWorldBounds=true;
        block.body.checkCollision=true;

        block.scale.setTo(width, height);
        block.enableBody = true;
        block.bounce = 0;
        block.body.velocity.y = 500;
        block.color = color;
        block.txt = word;
        addWordToBlock(block, word);

        return block;
    }
    //TODO align
    function addWordToBlock(block, word) {

        var word_width = 10 * word.length;

        var style = {font: "20px Arial", fill: "#ffffff"};

        // console.log(word+"\n");
        // console.log(block.width+"\n");
        // console.log(word_width+"\n");
        // console.log((block.width-word_width)/2);
        let text = game.add.text(((block.width - word_width) / 2) * (64 / block.width), block.height / 3.5, word, style);
        text.scale.setTo(64/block.width, 64/block.height);

        block.addChild(text);

    }

    function findWord(words) {

            if(Math.floor(Math.random()*3)===1)  // for empty blocks
                return "";

            var i = Math.floor(Math.random()*words.length);
            var content = words[i];
            return content;
    }


    function init_words() {


        fetch("http://0.0.0.0:5000/", {
            method : "GET",
            // body: new FormData(document.getElementById("inputform")),
            // -- or --
            // body : JSON.stringify({
            // user : document.getElementById('user').value,
            // ...
            // })
        }).then(
             function(response) {
                // window.alert(JSON.parse(response).output);
                var list = response.json().then(function (value) {
                    this.words = value.output;

                });
            }
        ).then(
            //window.alert("HATAA")
            // html => console.log(html)
        );



        //TODO words must be fetched via query
        /**words = "masa\n" +
            "tahta\n" +
            "kalem\n" +
            "silgi\n" +
            "pencere\n" +
            "kablo\n" +
            "ahtapot\n" +
            "kedi\n" +
            "köpek\n" +
            "endüstri\n" +
            "tabela\n" +
            "rozet\n" +
            "mouse\n" +
            "bayrak\n" +
            "koltuk\n" +
            "kanepe\n" +
            "televizyon\n" +
            "bina\n" +
            "inşaat\n" +
            "vinç\n" +
            "perde\n" +
            "saat\n" +
            "lastik\n" +
            "teker\n" +
            "tekerlek\n" +
            "tuş\n" +
            "askı\n" +
            "turşu\n" +
            "patlıcan\n" +
            "domates\n" +
            "biber\n" +
            "kumanda\n" +
            "asker\n" +
            "hırka"
        this.words = words.split("\n");*/
        // window.alert("+++" + liste);
        //
        // window.alert("-- " + words);
    }


