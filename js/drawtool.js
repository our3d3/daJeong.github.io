/* 그리기를 위한 Base class */
class BaseDraw{              
    constructor(){
        this.dragging = false;
        this.startX = 0;
        this.startY = 0;
        this.data = [];

        this.canvas = document.getElementById("Canvas");
        this.ctx = this.canvas.getContext("2d");
        this.ctx.lineWidth = 2;
        this.ctx.strokeStyle = "black"; 
        this.ctx.save();
    }

    init(){   
        this.canvas.addEventListener("mousemove", (e) => {this.move(e)}, false);
        this.canvas.addEventListener("mousedown", (e) => {this.down(e)}, false);
        this.canvas.addEventListener("mouseup", (e) => {this.up(e)}, false);
        this.canvas.addEventListener("mouseout",  (e) => {this.out(e)}, false);
    }

    restorePos(){
        let curStrokeStyle = this.ctx.strokeStyle;
        let curFillStyle = this.ctx.fillStyle;
        //this.ctx.drawImage(backGroundImg['img'], 0, 0);
        for(let i in saveShape){
            let shape = saveShape[i];
            if(shape['shapetype'] == 'free'){
                shape = shape['data'];
                this.ctx.beginPath();
                this.ctx.strokeStyle = shape[0]['color'];
                this.ctx.moveTo(shape[0]['x'], shape[0]['y']);
                for(let j in shape){
                    this.ctx.lineTo(shape[j]['x'], shape[j]['y']);
                    this.ctx.stroke();
                }
            }else if(shape['shapetype'] == 'square'){
                this.ctx.fillStyle = shape['color'];
                this.ctx.fillRect(shape['sx'], shape['sy'], shape['x'], shape['y']);
            }else if(shape['shapetype'] == 'circle'){
                this.ctx.beginPath();
                this.ctx.strokeStyle = shape['color'];
                this.ctx.fillStyle = shape['color'];
                this.ctx.moveTo(shape['sx'], shape['sy']);
                this.ctx.arc(shape['sx'], shape['sy'], shape['r'], 0, Math.PI * 2);
                this.ctx.stroke();
                this.ctx.fill();
            }else if(shape['shapetype'] == 'text'){
                this.ctx.fillStyle = shape['color'];
                this.ctx.font = shape['font'];
                this.ctx.fillText(shape['content'], shape['sx'], shape['sy']);
            }else if(shape['shapetype'] == 'image'){
                this.ctx.drawImage(shape['img'], 0, 0);
            }else if(shape['shapetype'] == 'tri'){
                this.ctx.beginPath();
                this.ctx.moveTo(shape['x1'], shape['y1']);
                this.ctx.lineTo(shape['x2'], shape['y2']);
                this.ctx.lineTo(shape['x3'], shape['y3']);
                this.ctx.lineTo(shape['x1'], shape['y1']);

                this.ctx.fillStyle = shape['color'];

                this.ctx.fill();
            }
        }

        this.ctx.fillStyle = dateStamp['color'];
        this.ctx.font = dateStamp['font'];
        this.ctx.fillText(dateStamp['content'], dateStamp['sx'], dateStamp['sy']);

        this.ctx.strokeStyle = curStrokeStyle;
        this.ctx.fillStyle = curFillStyle;

    }

    drawProcess(curX, curY){  }  // Todo Overide

    move(e){
        let curX = e.offsetX;
        let curY = e.offsetY;
        this.drawProcess(curX, curY);
    }
    down(e){ this.dragging = true; }
    up(e){ this.dragging = false; }
    out(e){ this.dragging = false; }
}

/* Base 클래스를 상속 */
/* drawProcess에 원하는 도형 그리는 코드를 입력하면 됨 */
class FreeShape extends BaseDraw{
    constructor(){
        super();
        this.idx = -1;
    }
    drawProcess(curX, curY){
        if(!this.dragging){
            this.ctx.beginPath();
            this.ctx.moveTo(curX, curY);
        }else{
            this.ctx.lineTo(curX, curY);
            this.data = {x: curX, y: curY, color: this.ctx.strokeStyle};
            this.savePos();
            this.tmp = {'shapetype': 'free', 'data': saveLineShape}
            this.ctx.stroke();
        }
    }

    down(e){
        this.dragging = true;
        saveLineShape = [];
        this.tmp = [];
    }

    savePos(){
        saveLineShape.push(this.data);
    }

    up(e){
        this.dragging = false;
        if(Object.keys(this.tmp).length){
            saveShape.push(this.tmp);
        }
    }

    out(e){
        this.dragging = false;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.restorePos();
    }

}

class SquareShape extends BaseDraw{
    constructor(){
        super();
        this.datalist = [];
    }
    drawProcess(curX, curY){
        if(!this.dragging){
            return;
        }else{
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.globalAlpha = 0.2;
            this.ctx.fillRect(this.startX, this.startY, (curX - this.startX), (curY - this.startY));
            this.data = {'shapetype': 'square', sx: this.startX, sy: this.startY, x: (curX - this.startX), y: (curY - this.startY), color: this.ctx.strokeStyle};        
        }
    }

    down(e){
        this.dragging = true;
        this.startX = e.offsetX;
        this.startY = e.offsetY;
        this.data = [];
    }

    savePos(){ saveShape.push(this.data); } 

    up(e){
        this.dragging = false;
        this.ctx.globalAlpha = 1;
        if(Object.keys(this.data).length){
            this.savePos();
        }
        this.data = [];
        this.restorePos();   
    }

    out(e){
        this.dragging = false;
        this.ctx.globalAlpha = 1;
        this.data = [];
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.restorePos();
    }
}

class CircleShape extends BaseDraw{
    constructor(){
        super();
        this.ctx.fillStyle = "black";
        
    }
    drawProcess(curX, curY){
        if(!this.dragging){
            this.ctx.beginPath();
            //this.ctx.moveTo(curX, curY);
            return;
        }else{
            this.r = this.getRadius(this.startX, this.startY, curX, curY);
            this.ctx.arc(this.startX, this.startY, this.r, 0, Math.PI * 2);
            this.ctx.fillStyle = this.ctx.strokeStyle;
            this.ctx.globalAlpha = 0.2;
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.fill();
            this.data = {'shapetype': 'circle', sx: this.startX, sy: this.startY, r: this.r, color: this.ctx.strokeStyle}; 
        }
    }


    getRadius(x, y, dx, dy){
        let a = Math.pow(dx - x, 2);
        let b = Math.pow(dy - y, 2);
        let c = Math.sqrt(a + b);
    
        return c;
    }

    savePos(){ saveShape.push(this.data); }

    down(e){
        this.dragging = true;
        this.startX = e.offsetX;
        this.startY = e.offsetY;
        this.data = [];
    }

    up(e){
        this.dragging = false;
        this.ctx.globalAlpha = 1;
        if(Object.keys(this.data).length){
            this.savePos();
        }
        this.data = [];
        this.restorePos();
    }

    out(e){
        this.dragging = false;
        this.ctx.globalAlpha = 1;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.restorePos();
    }
    
}

class TextShape extends BaseDraw{
    drawProcess(){
        let txt = document.getElementById("textInput").value;
        let font = "italic bold 20px Arial, sans-serif";
        this.ctx.font = font;
        this.ctx.fillText(txt, this.startX, this.startY);
        hide();

        this.savePos(txt, font);
        saveShape.push(this.data);
    }

    savePos(content, font){
        this.data = {"shapetype": "text", "content": content, "font": font, 'color': this.ctx.fillStyle, sx: this.startX, sy: this.startY};
    }
    down(e){
        this.startX = e.offsetX;
        this.startY = e.offsetY;
        show();
    }
    up(e){}
    move(e){}
}

class TriAngle extends BaseDraw{
    drawProcess(curX, curY){
        if(!this.dragging){
            this.ctx.beginPath();
            this.ctx.moveTo(curX, curY);
        }else{
            this.ctx.lineTo(this.startX, this.startY);
            let bottomLine = this.calcBottomLine(this.startX, curX);
            
            this.ctx.lineTo(bottomLine, curY);
            this.ctx.lineTo(curX, curY);
            this.ctx.globalAlpha = 0.2;
            this.data = {"shapetype": "tri", "color": this.ctx.fillStyle, "x1": this.startX, "y1": this.startY, "x2": bottomLine, "y2": curY, "x3": curX, "y3": curY};
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.fill();
        }
    }

    calcBottomLine(sX, x){
        return sX - (x - sX);
    }

    savePos(){ saveShape.push(this.data); }

    down(e){
        this.dragging = true;
        this.startX = e.offsetX;
        this.startY = e.offsetY;
        this.data = [];
    }

    up(e){
        this.dragging = false;
        this.ctx.globalAlpha = 1;
        if(Object.keys(this.data).length){
            this.savePos();
        }
        this.data = [];
        this.restorePos();

    }

    out(e){
        this.dragging = false;
        this.ctx.globalAlpha = 1;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.restorePos();
    }
}

function textInput(){
    document.getElementById("Canvas");
}

function show(){
    document.getElementById("fadeout").style.display = "flex";
    document.getElementById("fadein").style.display = "flex";
}

function hide(){
    document.getElementById("fadeout").style.display = "none";
    document.getElementById("fadein").style.display = "none";
}


function addShapeEvent(){
    canvas = document.getElementById("Canvas");
    canvas.addEventListener("mousemove", gMove, false);
    canvas.addEventListener("mousedown", gDown, false);
    canvas.addEventListener("mouseup", gUp, false);
    canvas.addEventListener("mouseout", gOut, false);
}

function removeShapeEvent(){
    canvas = document.getElementById("Canvas");
    canvas.removeEventListener("mousemove", gMove);
    canvas.removeEventListener("mousedown", gDown);
    canvas.removeEventListener("mouseup", gUp);
    canvas.removeEventListener("mouseout", gOut);
}

function changeShapeCheck(n){
    if(curShape == n) return false;
    else{
        curShape = n;
        return true;
    }
}

function initArray(arr){
    for(let i = 0; i < arr.length; i++){
        arr[i] = new Array();
    }
    return arr;
}


function setShapeEvent(__idx){
    gMove = (e) => { shapeList[__idx].move(e); }
    gDown = (e) => { shapeList[__idx].down(e); }
    gUp = (e) => { shapeList[__idx].up(e); }
    gOut = (e) => { shapeList[__idx].out(e); }
}

function changeColor(__color){
    let ctx = document.getElementById("Canvas");
    ctx = canvas.getContext("2d");
    ctx.strokeStyle = __color;
    ctx.fillStyle = __color;
}

function selectShape(num){
    let cur = 0;
    let isChanged = changeShapeCheck(num);

    if(num == 0x01 && isChanged){
        document.getElementById(String(num)).style['font-size'] = "36px";
        document.getElementById(String(before)).style['font-size'] = "24px";
        removeShapeEvent();
        cur = parseInt(num / 2);
        setShapeEvent(cur);
        addShapeEvent();
    }else if(num == 0x02 && isChanged){
        document.getElementById(String(num)).style['font-size'] = "36px";
        document.getElementById(String(before)).style['font-size'] = "24px";
        removeShapeEvent();
        cur = parseInt(num / 2);
        setShapeEvent(cur);
        addShapeEvent();
    }else if(num == 0x04 && isChanged){
        document.getElementById(String(num)).style['font-size'] = "36px";
        document.getElementById(String(before)).style['font-size'] = "24px";
        removeShapeEvent();
        cur = parseInt(num / 2);
        setShapeEvent(cur);
        addShapeEvent();
    }else if(num == 0x06 && isChanged){
        document.getElementById(String(num)).style['font-size'] = "36px";
        document.getElementById(String(before)).style['font-size'] = "24px";
        removeShapeEvent();
        cur = parseInt(num / 2);
        setShapeEvent(cur);
        addShapeEvent();
    }else if(num == 0x08 && isChanged){
        document.getElementById(String(num)).style['font-size'] = "36px";
        document.getElementById(String(before)).style['font-size'] = "24px";
        removeShapeEvent();
        cur = parseInt(num / 2);
        setShapeEvent(cur);
        addShapeEvent();
    }
    
    before = num;
}

function setNote(){
    let notetype = window.localStorage.getItem("notetype");
    let canvas = document.getElementById("Canvas");
    let ctx = canvas.getContext("2d");
    let data = [];
    
    if(notetype == "whiteboard"){
        let img = document.getElementById("muji");
        data = {"shapetype": "image", "img": img};
        ctx.drawImage(img, 0, 0);
    }else{
        let img = document.getElementById("jul");
        canvas.style.backgroundImage = "url('../images/jul.png')"
        data = {"shapetype": "image", "img": img};
        ctx.drawImage(img, 0, 0);
    }
    saveShape.push(data);
}

function dateWrite(){
    let date = window.localStorage.getItem("select-date");
    let canvas = document.getElementById("Canvas");
    let ctx = canvas.getContext("2d");
    let data = [];

    let year = date.substring(0, 4);
    let month = date.substring(4, 6);
    let day = date.substring(6, 8);

    let txt = year + "년 " + month + "월 " + day + "일";

    ctx.font = "italic bold 15px Arial, sans-serif";
    ctx.fillStyle = "grey";
    ctx.fillText(txt, 10, 20);

    dateStamp = {"shapetype": "text", "content": txt, "font": ctx.font, "color": "grey", sx: 10, sy: 20};
    ctx.fillStyle = "black";  // default
}

function redo(){
    if(saveShape.length == 1){
        alert("더 이상 되돌릴 수 없습니다!");
    }else{
        saveShape.pop();
        base.restorePos();
    }
}

function reset(){
    let range = saveShape.length;
    for(let i = 1; i < range; i++){
        saveShape.pop();
    }
    base.restorePos();
}


let gMove, gDown, gUp, gOut; 

let curShape = 0x01;
let base = new BaseDraw();
let freeshape = new FreeShape();
let squareShape = new SquareShape();
let circleShape = new CircleShape();
let textShape = new TextShape();
let triAngle = new TriAngle();
let dateStamp = [];
let backGroundImg = [];
let before = 0;

let shapeList = {0: freeshape, 1: squareShape, 2: circleShape, 3: textShape, 4: triAngle};
let saveShape = Array();
let saveLineShape = Array(1);


//saveLineShape = initArray(saveLineShape);

document.getElementById("1").style['font-size'] = "36px";
setShapeEvent(0);
addShapeEvent();
before = 1;
setNote();
dateWrite();
