const G = 9.81;

let c = document.querySelector('#c');
let ctx = c.getContext('2d');

let krono = new Krono({
    output: 1000,
    isBackwards : true,
    initial : 10,
    end : true,
})

krono.start();


let sizes = {
    w: 800,
    h: 550
}

c.width = sizes.w;
c.height = sizes.h;



class Circle{
    constructor(xpos, ypos){
        // Basics
        this.xpos = xpos
        this.ypos = ypos
        this.r = 30
        this.color = ''
        
        // Mouse behavior
        this.isMouseOver = false
        this.isMouseClicked = false
        this.MouseXDistance = undefined;
        this.MouseYDistance = undefined;
        
        // Fisics




        this.mass = 12;

        this.xi = this.xpos
        this.xf = this.xi
        this.xd = this.xf - this.xi

        this.yi = this.ypos
        this.yf = this.yi
        this.yd = this.yf - this.yi + G;


        
        
        
        
    }
    
    draw(ctx){
        ctx.beginPath()
        ctx.arc(this.xpos,this.ypos,this.r,0,Math.PI*2,false);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath()
    }
    
    update(ctx){

        this.changeColor();
        if(!this.isMouseClicked){
            
            this.ypos += this.yd
            this.xpos += this.xd

            this.ypos += this.mass**1/2
            this.yd += Math.sqrt(G)


            if(this.xd !== 0){
                this.xd += (-(this.xd / Math.abs(this.xd)) / this.mass) / Math.sqrt(G)

                if(Math.floor(this.xd) == 0) {
                    this.xd = 0
                }

                
            }

            



        }




        




        if(this.ypos+this.r > sizes.h){
            this.ypos = sizes.h - this.r
            this.yd *= -1
        }

        if(this.ypos - this.r < 0){
            this.ypos = this.r
            this.yd*=-1
            this.yd /= 1+(1/this.mass*G)
        }

        if(this.xpos + this.r > sizes.w){
            this.xpos = sizes.w - this.r
            this.xd*= -1
            this.xd /= 1+(1/this.mass*G)
        }
        
        if(this.xpos - this.r < 0){
            this.xpos = this.r;
            this.xd*= -1
            this.xd /= 1+(1/this.mass)
        }


        this.draw(ctx);
    }

    changeColor(){
        this.color = this.isMouseOver ? '#a77' : '#dbb'
    }

    detectMouse(mouseX, mouseY){
        return (
            mouseX <= this.xpos+this.r &&
            mouseX >= this.xpos-this.r &&
            mouseY <= this.ypos+this.r &&
            mouseY >= this.ypos-this.r 
        )

    }

    updateDs(){


        this.yd = this.yf - this.yi
        this.xd = this.xf - this.xi  
    }
}


let circles = [
    new Circle(300, 50),
    new Circle(400, 200),
    new Circle(500, 50),

]



function loop() {
    requestAnimationFrame(loop)

    let tiempo = krono.getTime();
    if(tiempo == 0){
        krono.toInitial();
        
        let draggedCircle = getDraggedCircle()

        if(draggedCircle){
            draggedCircle.xi = draggedCircle.xf
            draggedCircle.xf = draggedCircle.xpos

            draggedCircle.yi = draggedCircle.yf
            draggedCircle.yf = draggedCircle.ypos

            draggedCircle.updateDs()

            velocity.innerHTML = `X: ${draggedCircle.xd} px/cs - Y: ${-draggedCircle.yd} px/cs`
            
        }
    }


    ctx.fillStyle = "#200";
    ctx.fillRect(0,0,c.width,c.height)

    circles.forEach( circle => {
        circle.update(ctx)
    })

    
}

loop()


c.addEventListener('mousemove',(e)=>{

    let C = c.getBoundingClientRect();

    let hoverCount = 0;

    let mouseX = e.clientX - Math.floor(C.left)
    let mouseY = e.clientY - Math.floor(C.top)

    circles.forEach( circle =>{
        const isHover = circle.detectMouse(mouseX,mouseY)

        circle.isMouseOver = isHover;

        hoverCount += isHover ? 1 : 0 ;

        if(circle.isMouseClicked){
            if (circle.MouseXDistance == undefined) {
                circle.MouseXDistance = -(circle.xpos - mouseX)
            }
            if (circle.MouseYDistance == undefined) {
                circle.MouseYDistance = -(circle.ypos - mouseY)
            }

            circle.xpos = mouseX - circle.MouseXDistance;
            circle.ypos = mouseY - circle.MouseYDistance
        }
          
    })

    if (hoverCount > 0) {
        c.classList.add('active')
    }else{
        c.classList.remove('active')
    }

})

c.addEventListener('mousedown', (e) => {

    if(e.button == 0)
    circles.forEach( circle => {
        
        circle.isMouseClicked = circle.isMouseOver;


        
    })

})

c.addEventListener('mouseup', (e) => {
    if(e.button == 0){
        circles.forEach( circle => {
        
            circle.isMouseClicked = false;
            circle.MouseXDistance = undefined;
            circle.MouseYDistance = undefined;
            
        })
    }
})


c.addEventListener('mouseleave', ()=> {
    circles.forEach( circle => {
        
        circle.isMouseOver = false
        circle.isMouseClicked = circle.isMouseOver
        
    })
})

function getDraggedCircle() {
    return circles.filter( circle => circle.isMouseClicked)[0]
}