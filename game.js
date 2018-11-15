window.onload = function() {

    var game = new Phaser.Game(12*64+1, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

    var block_colors = ['blue_block', 'green_block', 'red_block', 'yellow_block'];
    var block_size=224;
    function preload () {

        game.load.image('sky', 'assets/ground2.jpeg');
        game.load.image('blue_block', 'assets/blue_unit.png');
        game.load.image('green_block', 'assets/green_unit.png');
        game.load.image('red_block', 'assets/red_unit.png');
        game.load.image('yellow_block', 'assets/yellow_unit.png');
        game.load.image('ground', 'assets/ground.png');

    }

    function create () {

        game.physics.startSystem(Phaser.Physics.ARCADE);

        game.add.sprite(0, 0, 'sky');

        ground = game.add.sprite(0, game.world.height - 64  , 'ground');
        game.physics.arcade.enable(ground);
        ground.body.immovable = true;
        ground.enableBody = true;

        blocks = []



        init_blocks();


    }


    function update() {

        hit1 = game.physics.arcade.collide(ground, blocks, collision_handler2);
        hit2 = game.physics.arcade.collide(blocks, blocks, collision_handler);

    }

    function collision_handler2(ground, block){
        block.body.immovable = true;
    }

    function collision_handler(block1, block2){
        block1.body.immovable = true;
        block2.body.immovable = true;

        console.log(block1.i +"-"+block2.i);

    }

    function init_blocks() {
        for (let i=0; i<5; i++) {
            setTimeout( function timer(){
                //createBlocks(8);
                createBlocks(7, i);
            }, i*700 );
        }
    }

    function createBlocks(num, j) {
        var sum = 0;
        for (let i=0; i<num; i++) {
            setTimeout( function timer(){
                var width = 1 + Math.floor(Math.random() *3);
                var height = 1 + Math.floor(Math.random() *2);

                if(sum*64+width*64>=game.world.width)
                    return;

                var color = block_colors[Math.floor(Math.random() * 4)];
                var block = createBlock(sum*64, 0, width, height/2, color);
                block.i = i + ","+j;
                var text = game.add.text(0, 0, i+"," +j, {font: "20px Arial", fill: "#ffffff"});

                block.addChild(text);
                blocks.push(block);
                sum+=width;
            }, i*100 );
        }

    }

    function createBlock(x, y, width, height, color) {
        var block = game.add.sprite(x, y, color);

        game.physics.arcade.enable(block);
        block.scale.setTo(width, height);
        block.enableBody = true;
        block.bounce = 0;
        block.body.velocity.y = 700;
        block.color = color;
        return block;
    }


};