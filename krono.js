class Krono{
    constructor(attr={
        output:1000,
        isBackwards:false,
        end:false,
        initial:0,
        whenDone: Function
    }){
        this.startTime = 0;
        this.isRunning = false;
        // 

        this.output = 1000/attr.output || 1000;
        this.isBackwards = attr.isBackwards || false;
        this.initial = attr.initial || 0;
        this.whenDone = attr.whenDone || Function;
        this.end = attr.end || false;
        // 
        this.startPause = 0;
        this.pauseTime = 0;
        this.isPaused = false;
        // 
        this.done = false;
        // 
        this.addedTime = 0;
    }
    
    start(){
        if(!this.isRunning && !this.isPaused){
        this.startTime = Date.now()
        this.isRunning = true;
    }
}


    reset(){
        this.startTime = 0;
        this.isRunning = false;
    
        this.startPause = 0;
        this.pauseTime = 0;
        this.isPaused = false;
     
        this.done = false;
     
        this.addedTime = 0;
    }
    
    getTime(){
     
        let elapsedTime = Math.floor(( this.isBackwards ? this.initial : 0 )-(this.startPause - this.startTime - this.pauseTime)/this.output)+this.addedTime;


        if(this.isRunning){
            elapsedTime = Math.floor((this.isBackwards? this.initial : 0 )-(Date.now()-this.startTime-this.pauseTime)/this.output)+this.addedTime;
        }

        if(this.isBackwards && elapsedTime < 0 && !this.done){
            this.whenDone();
            this.done = true;
        }

        if (this.done && this.end) {
            elapsedTime = 0;
        }
        return this.isBackwards?elapsedTime:Math.abs(elapsedTime);
    }

    
    pause(){
        if(this.isRunning){
            this.startPause = Date.now()
            this.isRunning = false;
            this.isPaused = true;
        }
    }
    
    continue(){
        if(!this.isRunning){
        this.pauseTime += Date.now()-this.startPause;
        this.isRunning = true;
        this.isPaused = false;
        }
    }

    toInitial(){
        this.startTime = 0;
        this.isRunning = false;
        
        this.startPause = 0;
        this.pauseTime = 0;
        // isPaused

        this.done = false;

        this.addedTime = 0;
        
        
        if(!this.isPaused){
            this.start();
        }
        
    }

    addTime(quan = 0){
        this.addedTime += -quan;
    }
}
