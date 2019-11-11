const canvas = document.getElementById('canvas');
canvas.width = 400;
canvas.height = 400;
const ctx = canvas.getContext("2d");

class Game{
    constructor(){
        this.snake = new Snake();
        this.interval = null;
        this.isFoodOnField = false;
        this.food = null;
        this.score = 0;
    }
    isRectOutOfCanvas(){
        return this.snake.x + this.snake.w > canvas.width ||
            this.snake.x < 0 ||
            this.snake.y + this.snake.h > canvas.height ||
            this.snake.y < 0
    }
    isRectOnFood(){
        return this.snake.x + this.snake.w > this.food.x && this.snake.x < this.food.x + this.food.w &&
            this.snake.y + this.snake.h > this.food.y && this.snake.y < this.food.y + this.food.h
    }
    // isRectTouchingTail(){
    //     return this.snake.tail.some(
    //         block =>
    //             this.snake.x + this.snake.w > block.x && this.snake.x < block.x + this.snake.w &&
    //             this.snake.y + this.snake.h > block.y && this.snake.y < block.y + this.snake.h
    //     )
    // }
    addControls(){
        document.addEventListener('keydown', e => {
            switch(e.code){
                case('ArrowUp'):
                    this.snake.changeDirection(0);
                    break;
                case('ArrowLeft'):
                    this.snake.changeDirection(1);
                    break;
                case('ArrowDown'):
                    this.snake.changeDirection(2);
                    break;
                case('ArrowRight'):
                    this.snake.changeDirection(3);
                    break;
                case('KeyS'):
                    this.stop();
                    break;
                case('KeyR'):
                    this.run();
                    break;
            }
        })
    }
    generateFood(){
        this.food = new Food();
        this.food.render()
        this.isFoodOnField = true;
    }
    init(){
        this.addControls();
        this.generateFood();
        this.snake.render();
        ctx.font = "20px Arial";
    }
    render(){
        this.snake.render();

        if(!this.isFoodOnField){
            this.generateFood();
        }
        this.food.render()
        
        ctx.fillStyle = 'black';
        ctx.fillText(`Score: ${this.score}`, 10, 20)
    }
    update(){
        if(this.isRectOnFood()){
            this.isFoodOnField = false;
            this.snake.makeLonger()
            this.score += 1;
        }
        if(this.isRectOutOfCanvas()){
            this.snake.changeDirection()
        }
        this.snake.update();
    }
    clear(){
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    run(){
        this.interval = setInterval(() => {
            this.update();
            this.render();
        }, 100)
    }
    stop(){
        clearInterval(this.interval)
    }
}

class Snake{
    constructor(){
        this.tail = [
            {
                x: 50, y: 60
            },
        ]
        this.w = 10;
        this.h = 10;
        this.x = 50;
        this.y = 50;
        this.speed = 10;
        this.direction = 0;
    }
    changeDirection(d){
        if(d === undefined){
            this.direction = this.direction - 2 !== -1 ?
                        Math.abs(this.direction - 2) :
                        3;
        } else {
            this.direction = d;
        }
    }
    makeLonger(){
        this.tail.push({x: this.x, y: this.y})
    }
    render(){
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = 'black';

        ctx.fillRect(this.x, this.y, this.w, this.h);

        this.tail.forEach(
            block => ctx.fillRect(block.x, block.y, this.w, this.h)
        )
    }
    update(){
        for(let i = this.tail.length - 1; i >= 0; i--){
            if(!i){
                this.tail[i].x = this.x;
                this.tail[i].y = this.y;
            } else {
                this.tail[i].x = this.tail[i - 1].x;
                this.tail[i].y = this.tail[i - 1].y;
            }
            
        }
        switch(this.direction){
            case(0):
                this.y -= this.speed;
                break;
            case(1):
                this.x -= this.speed;
                break;
            case(2):
                this.y += this.speed;
                break;
            case(3):
                this.x += this.speed;
                break;
        }
    }
}

class Food{
    constructor(){
        this.w = 10;
        this.h = 10;
        this.x = Math.random() * (canvas.width - this.w);
        this.y = Math.random() * (canvas.width - this.h);
        this.color = `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`;
    }
    render(){
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.w, this.h);
    }
}

const game = new Game();

game.init();

game.run();