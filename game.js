
var Game = {};
var beginning_speed=700;
var speed_during=400;
var new_block_speed=300;

// var game = new Phaser.Game(12*64+1, 600, Phaser.AUTO, '', { preload: Game.preload, create: Game.create, update: Game.update });
var block_colors = ['blue_block', 'green_block', 'red_block', 'yellow_block'];
var block_size=224;
soundOnMove= true;
// var timeOut = Phaser.Timer.SECOND; // Falling speed of the falling

Game.radio = { // object that stores sound-related information
    soundOn : true,
    moveSound : null,
    gameOverSound : null,
    winSound : null,
    music : null,
    // Play music if all conditions are met
    playMusic : function(){
        if(Game.radio.soundOn && !pauseState){
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
        if (Game.radio.soundOn && !pauseState) {
            sound.play();
        }
    }
};


window.onload = function() {};
    Game.preload = function() {

        game.load.image('sky', 'assets/ground2.jpeg');
        game.load.image('blue_block', 'assets/blue_unit.png');
        game.load.image('green_block', 'assets/green_unit.png');
        game.load.image('red_block', 'assets/red_unit.png');
        game.load.image('yellow_block', 'assets/yellow_unit.png');
        game.load.image('ground', 'assets/ground.png');
        //-------------------------audio---------------------------------
        game.load.audio('move','assets/sound/move.mp3','assets/sound/move.ogg');


    };

    Game.create = function(){

        // game.physics.startSystem(Phaser.Physics.ARCADE);
        pauseState = false;
        gameOverState = false;
        // Sound on/off icon
        var sound = game.add.sprite(game.world.width-38, 0, 'sound', 0);
        sound.inputEnabled = true;
        sound.events.onInputDown.add(Game.radio.manageSound, this);
        game.add.sprite(0, 0, 'sky');
        Game.radio.moveSound = game.add.audio('move');
        Game.radio.winSound = game.add.audio('win');
        Game.radio.gameOverSound = game.add.audio('gameover');
        Game.radio.music = game.add.audio('music');
        Game.radio.music.volume = 0.2;
        Game.radio.music.loopFull();

        ground = game.add.sprite(0, game.world.height - 64  , 'ground');
        game.physics.arcade.enable(ground);
        ground.body.immovable = true;
        ground.enableBody = true;

        var sound = game.add.sprite(game.world.width-38, 0, 'sound', 0);
        sound.inputEnabled = true;
        sound.events.onInputDown.add(Game.radio.manageSound, this);
        blocks = [];

        init_blocks(beginning_speed);

    };


    Game.update = function() {

        hit1 = game.physics.arcade.collide(ground, blocks, collision_handler2);
        hit2 = game.physics.arcade.collide(blocks, blocks, collision_handler);

        // for (let i = 0; i <blocks.length; i++) {
        //     neighbours(blocks[0]);
        // }

    };

    // function neighbours(block) {
    //     block.
    // }
    // function collision_handler3(block1,block2) {
    //     console.log(block1.i +"-"+block2.i);
    //
    // }
    function collision_handler2(ground, block){
        block.body.immovable = true;
    }

    function collision_handler(block1, block2){
        block1.body.immovable = true;
        block2.body.immovable = true;

        console.log(block1.i +"-"+block2.i);

    }

    /**
     * falls blocks over the killed blocks.
     */
    function makeMovable() {
        for(var i=0;i<blocks.length;i++){
            blocks[i].body.immovable = false;
            blocks[i].body.velocity.y = speed_during;
        }
    }

    /**
     * tıklanan blokla aynı renkteki tüm blokları siler.
     * @param block
     */
    function blockClick(block) {

        var same_color_blocks = findSameColorBlock(block);  // aynı renkteki blokları getirir.
        var blocks_to_be_killed = findNeighborsChain(block, same_color_blocks);
        for(var i=0;i<blocks_to_be_killed.length;i++){
            //console.log(blocks_to_be_killed[i].i);
            blocks_to_be_killed[i].kill();
        }
        Game.radio.playSound(Game.radio.moveSound);


        makeMovable();
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


    function init_blocks(speed) {
        for (let i=0; i<5; i++) {
            setTimeout( function timer(){
                //createBlocks(8);
                createBlocks(7, i,speed);
            }, i*700 );
        }
    }

    function createBlocks(num, j,speed) {
        var sum = 0;
        for (let i=0; i<num; i++) {
            setTimeout( function timer(){
                var width = 1 + Math.floor(Math.random() *3);
                var height = 1 + Math.floor(Math.random() *2);

                if(sum*64+width*64>=game.world.width)
                    return;

                var color = block_colors[Math.floor(Math.random() * 4)];
                var block = createBlock(sum*64, 0, width, height/2, color,speed);
                block.i = i + ","+j;
                var text = game.add.text(0, block.height/2, i+"," +j, {font: "20px Arial", fill: "#ffffff"});

                block.addChild(text);
                blocks.push(block);

                sum+=width;
            }, i*100 );
        }

    }

    function createBlock(x, y, width, height, color,speed) {
        var block = game.add.sprite(x, y, color);
        game.physics.arcade.enable(block);
        block.inputEnabled = true;
        block.events.onInputDown.add(blockClick, this);
        block.body.collideWorldBounds=true;
        block.body.checkCollision=true;
        block.scale.setTo(width, height);
        block.enableBody = true;
        block.bounce = 0;
        block.body.velocity.y = speed;
        block.color = color;

        return block;
    }


