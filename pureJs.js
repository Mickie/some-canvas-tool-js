//半透明涂抹：

function getX(obj){  //get current X
    var parObj=obj;
    var left=obj.offsetLeft;
    while(parObj=parObj.offsetParent){
        left+=parObj.offsetLeft;
    }
    return left;
}

function getY(obj){ //get Current Y
    var parObj=obj;
    var top=obj.offsetTop;
    while(parObj = parObj.offsetParent){
        top+=parObj.offsetTop;
    }
    return top;
}


$("canvas").bind("mousemove",function(e){
    var top,left,oDiv;
    oDiv=document.getElementById("imagePreView"); //canvas div(imagePreview)
    top=getY(oDiv);
    left=getX(oDiv);// get div X,Y

    x = (e.clientX-left+document.body.scrollLeft);
    y = (e.clientY-top+document.body.scrollTop); // get current X,Y according to div position


    if(down == 1){ //mouse down
        var ctx=canvas.getContext("2d");
        var newX=x-result;
        var newY=y-result;    //wipe penWidth(result), get newX, newY(middle of pen selected area)
        var d=result*2;

        var imageData=ctx.getImageData(newX,newY,d,d);
        var data=imageData.data;

        for(var j=0;j<d;j++){
            for(var i=0;i<d;i++){
                if((j-d/2)*(j-d/2)+(i-d/2)*(i-d/2)<=(d/2*d/2)){ // if the pixel point within the pen selected area(circle)
                    var pixelOffset= (j * d + i) * 4;
                    data[pixelOffset+3]=127;} // set Alpha value
            }
        }

        ctx.putImageData(imageData,(newX),(newY));
//

    }


});


//输出半透明换成固定色值的 b64
var canvas=document.getElementsByTagName("canvas")[0];
var ctx=canvas.getContext("2d");
var newImgData=ctx.getImageData(0,0,canvas.width,canvas.height);

var newData=newImgData.data;


for(var j=0;j<canvas.height;j++){
    for(var i=0;i<canvas.width;i++){
        var pixelOffset=(j*canvas.width+i)*4;
        if (newData[pixelOffset+3]==127){
            newData[pixelOffset]=119;
            newData[pixelOffset+1]=119;
            newData[pixelOffset+2]=119;
            newData[pixelOffset+3]=255;
        }
    }
}
ctx.putImageData(newImgData,0,0);
anotherB64=canvas.toDataURL(); //get canvas b64


// create canvas image ,also could use Fabric.js/AlloyImg to create canvas element
var img= new Image();
img.src="";

var createImage = function(anImg,elementId){
    var theCanvas = document.getElementById(elementId);
    var theCtx = theCanvas.getContext('2d');
    anImg.addEventListener('load', function () {
        theCtx.drawImage(this, 0, 0, anImg.width, anImg.height)
    });
};


//create and replace current canvas after rotate movement

jQuery.fn.rotate  = function(angle) {
    var p = this.get(0);


    // we store the angle inside the image tag for persistence

    p.angle = (r + angle) % 360;

    r=p.angle;

    if (p.angle >= 0) {
        var rotation = Math.PI * p.angle / 180;
    } else {
        var rotation = Math.PI * (360+p.angle) / 180;
    }
    var costheta = Math.cos(rotation);
    var sintheta = Math.sin(rotation);


    var canvas = document.createElement('canvas');
    if (!p.oImage) {
        canvas.oImage = new Image();
        canvas.oImage.src = p.src;
    } else {
        canvas.oImage = p.oImage;
    }

    canvas.style.width = canvas.width = Math.abs(costheta*canvas.oImage.width) + Math.abs(sintheta*canvas.oImage.height);
    canvas.style.height = canvas.height = Math.abs(costheta*canvas.oImage.height) + Math.abs(sintheta*canvas.oImage.width);

    var context = canvas.getContext('2d');
    context.save();
    if (rotation <= Math.PI/2) {
        context.translate(sintheta*canvas.oImage.height,0);
    } else if (rotation <= Math.PI) {
        context.translate(canvas.width,-costheta*canvas.oImage.height);
    } else if (rotation <= 1.5*Math.PI) {
        context.translate(-costheta*canvas.oImage.width,canvas.height);
    } else {
        context.translate(0,-sintheta*canvas.oImage.width);
    }
    context.rotate(rotation);
    context.drawImage(canvas.oImage, 0, 0, canvas.oImage.width, canvas.oImage.height);
    context.restore();
    canvas.id = "myCanvas1";  // set up newCanvas id
    canvas.angle = p.angle;
    c = document.getElementsByTagName("canvas")[0];
    c.parentNode.replaceChild(canvas, c);

}

jQuery.fn. rotateRight = function(angle) {
    this.rotate(angle==undefined?90:angle);
}

jQuery.fn. rotateLeft = function(angle) {
    this.rotate(angle==undefined?-90:-angle);
}


