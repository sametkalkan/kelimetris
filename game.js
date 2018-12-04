
var Game = {};

var block_colors = ['blue_block', 'green_block', 'red_block', 'yellow_block'];

var scoreTitle, scoreText, timer, loop;
var score = 0;

var words = [];

var blocks = [];  // existing block on the screen

var ground;
var sound;  // background music

var wordLabel;  // label on the ground


Game.preload = function () {


        loadElements();
};

Game.create = function () {

    game.add.plugin(PhaserInput.Plugin);

    createElements();

    createSounds();  // creates the sounds

    init_blocks(5, 8, 700);

    getWords();

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
        for(var i=0;i<blocks.length;i++){
            blocks[i].body.immovable = false;
            blocks[i].body.velocity.y = 300;
        }
    }

    /**
     * tıklanan blokla aynı renkteki tüm blokları siler.
     * @param block
     */
    function blockClick(block) {
        blocks.inputEnabled = false;
        var same_color_blocks = findSameColorBlock(block);  // aynı renkteki blokları getirir.
        var blocks_to_be_killed = findNeighborsChain(block, same_color_blocks);

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
            var kill_block = blocks_to_be_killed[i];
            var killTween = game.add.tween(kill_block.scale);
            killTween.to({x: 0, y: 0}, 200, Phaser.Easing.Bounce.Out);
            killTween.onComplete.addOnce(function () {
                kill_block.kill();

            }, this);

            killTween.start();
            // blocks_to_be_killed[i].kill();
            score += 50;
        }

        blocks = blocks.filter((el) => !blocks_to_be_killed.includes(el));


        Game.radio.playSound(Game.radio.winSound);
        this.scoreText.setText(score);
        makeMovable();

        createBlocks(3);

        blocks.inputEnabled = true;

    }

    function findSimilarity(word) {
        wordLabel.setText(word);
    }





    /**
     * verilen bloğun aynı rekteki komşularını ve onların komşularını bulur.
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

//TODO issue after killing the block new blocks appear always at the beginning to avoid this wwe can add random flog to the function
function createBlocks(num) {
    var sum = 0;
        for (let i=0; i<num; i++) {
            setTimeout( function timer(){
                var height = 1 + Math.floor(Math.random() * 2);
                var word = findWord();
                var width;

                /* to determine block width */
                if(word.length<=4)
                    width = 1;
                else if(word.length<=10)
                    width = 2;
                else if(word.length<=15)
                    width = 3;

                if(sum*64+width*64>=game.world.width)
                    return;

                var color = block_colors[Math.floor(Math.random() * 4)];
                var block = createBlock(sum*64, 0, width, height/2, color, word);

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
        block.body.collideWorldBounds=true;
        block.body.checkCollision=true;

        block.scale.setTo(width, height);
        block.enableBody = true;
        block.bounce = 0;
        block.body.velocity.y = 500;
        block.color = color;

        addWordToBlock(block, word);

        return block;
    }

function addWordToBlock(block, word) {

    var word_width = 12.8*word.length;

    var style = { font: "20px Arial", fill: "#ffffff", wordWrap: true, wordWrapWidth: block.width, align: "center"};


    var text = game.add.text(10, block.height/3, word, style);
    text.scale.setTo(1/(block.width/64), 1/(block.height/64));
    block.addChild(text);

}

function findWord() {

        if(Math.floor(Math.random()*3)==1)  // for empty blocks
            return "";

        var i = Math.floor(Math.random()*words.length);
        var content = words[i];
        return content;
}

function getWords() {
    var path = "assets/words.txt";
    //TODO words must be fetched via query
    words = "masa\n" +
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

    this.words = words.split("\n");
}


