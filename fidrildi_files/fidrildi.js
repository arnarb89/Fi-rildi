/////////////////////////////////////////////////////////////////
//    Sýnidæmi í Tölvugrafík
//     Jörðin (sem teningur!) snýst um sólina (stærri teningur!)
//
//    Hjálmtýr Hafsteinsson, febrúar 2016
/////////////////////////////////////////////////////////////////
var canvas;
var gl;

var numVertices  = 36;

var movement = false;     // Do we rotate?
var spinX = 35;
var spinY = 60;
spinX = 56;
spinY = 118;
var origX;
var origY;

var program;
var matrixLoc;

/*var rotWing = 50.0;        // Snúningshorn vængjanna
var incWing = 2.0;        // Breyting á snúningshorni*/


var bodyvertices = [
    vec3( -0.5, -0.5,  0.5 ),
    vec3( -0.5,  0.5,  0.5 ),
    vec3(  0.5,  0.5,  0.5 ),
    vec3(  0.5, -0.5,  0.5 ),
    vec3( -0.5, -0.5, -0.5 ),
    vec3( -0.5,  0.5, -0.5 ),
    vec3(  0.5,  0.5, -0.5 ),
    vec3(  0.5, -0.5, -0.5 )
];


// the 8 vertices of the cube
var theoffset = 0.65;

var wingvertices = [
    vec3( -0.9, -0.001,  0.5+theoffset ),
    vec3( -0.9,  0.001,  0.5+theoffset ),
    vec3(  0.9,  0.001,  0.5+theoffset),
    vec3(  0.9, -0.001,  0.5+theoffset ),
    vec3( -0.4, -0.001, -0.5+theoffset ),
    vec3( -0.4,  0.001, -0.5+theoffset ),
    vec3(  0.4,  0.001, -0.5+theoffset ),
    vec3(  0.4, -0.001, -0.5+theoffset )
];


var vertices = [
    vec3( -0.5, -0.5,  0.5 ),
    vec3( -0.5,  0.5,  0.5 ),
    vec3(  0.5,  0.5,  0.5 ),
    vec3(  0.5, -0.5,  0.5 ),
    vec3( -0.5, -0.5, -0.5 ),
    vec3( -0.5,  0.5, -0.5 ),
    vec3(  0.5,  0.5, -0.5 ),
    vec3(  0.5, -0.5, -0.5 )
];

var vertexColors = [
    vec4( 0.0, 0.0, 0.0, 1.0 ),  // black
    vec4( 1.0, 0.0, 0.0, 1.0 ),  // red
    vec4( 1.0, 1.0, 0.0, 1.0 ),  // yellow
    vec4( 0.0, 1.0, 0.0, 1.0 ),  // green
    vec4( 0.0, 0.0, 1.0, 1.0 ),  // blue
    vec4( 1.0, 0.0, 1.0, 1.0 ),  // magenta
    vec4( 0.0, 1.0, 1.0, 1.0 ),  // cyan
    vec4( 1.0, 1.0, 1.0, 1.0 )   // white
];

var bodyvertexColors = [
    vec4( 0.0, 0.0, 0.0, 1.0 ),  // black
    vec4( 0.0, 0.0, 0.0, 1.0 ),  // red
    vec4( 0.0, 0.0, 0.0, 1.0 ),  // yellow
    vec4( 0.0, 0.0, 0.0, 1.0 ),  // green
    vec4( 0.0, 0.0, 0.0, 1.0 ),  // blue
    vec4( 0.0, 0.0, 0.0, 1.0 ),  // magenta
    vec4( 0.0, 0.0, 0.0, 1.0 ),  // cyan
    vec4( 0.0, 0.0, 0.0, 1.0 )   // white
];


var alpha = 1;
var boxColors = [
    vec4( 0.5, 0.0, 0.0, alpha ),  // black
    vec4( 0.5, 0.0, 0.0, alpha ),  // red
    vec4( 0.5, 0.0, 0.0, alpha ),  // yellow
    vec4( 0.5, 0.0, 0.0, alpha ),  // green
    vec4( 1, 1, 0, alpha ),  // blue
    vec4( 1, 1, 0, alpha ),  // magenta
    vec4( 1, 1, 0, alpha ),  // cyan
    vec4( 1, 1, 0, alpha )   // white
];

var yel = vec4( 1.0, 1.0, 0.0, 1.0 );

var pink = vec4( 1.0, 0.0, 1.0, 1.0 );

var thecolor = pink;

var wingvertexColors = [
    thecolor,  // black
    thecolor,  // red
    thecolor,  // yellow
    thecolor    ,  // green
    yel,  // blue
    yel,  // magenta
    yel,  // cyan
    yel   // white
];

function getWingColors(i){
    var temp = [
        bflies[i].color,  // black
        bflies[i].color,  // red
        bflies[i].color,  // yellow
        bflies[i].color    ,  // green
        yel,  // blue
        yel,  // magenta
        yel,  // cyan
        yel   // white
    ];
    return temp;
};

var wingvertexColorsbackup = [
    vec4( 0.0, 0.0, 0.0, 1.0 ),  // black
    vec4( 1.0, 0.0, 0.0, 1.0 ),  // red
    vec4( 1.0, 1.0, 0.0, 1.0 ),  // yellow
    vec4( 0.0, 1.0, 0.0, 1.0 ),  // green
    vec4( 0.0, 0.0, 1.0, 1.0 ),  // blue
    vec4( 1.0, 0.0, 1.0, 1.0 ),  // magenta
    vec4( 0.0, 1.0, 1.0, 1.0 ),  // cyan
    vec4( 1.0, 1.0, 1.0, 1.0 )   // white
];

// indices of the 12 triangles that compise the cube
var indices = [
    1, 0, 3,
    3, 2, 1,
    2, 3, 7,
    7, 6, 2,
    3, 0, 4,
    4, 7, 3,
    6, 5, 1,
    1, 2, 6,
    4, 5, 6,
    6, 7, 4,
    5, 4, 0,
    0, 1, 5
];

function init()
{
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.9, 1.0, 1.0, 1.0 );

    gl.enable(gl.DEPTH_TEST);

    //
    //  Load shaders and initialize attribute buffers
    //
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );




    buffers();

    matrixLoc = gl.getUniformLocation( program, "rotation" );

    //event listeners for mouse
    canvas.addEventListener("mousedown", function(e){
        movement = true;
        origX = e.offsetX;
        origY = e.offsetY;
        e.preventDefault();         // Disable drag and drop
    } );

    canvas.addEventListener("mouseup", function(e){
        movement = false;
    } );

    canvas.addEventListener("mousemove", function(e){
        if(movement) {
    	    spinY = ( spinY + (e.offsetX - origX) ) % 360;
            spinX = ( spinX + (e.offsetY - origY) ) % 360;
            origX = e.offsetX;
            origY = e.offsetY;
        }
    } );

    gl.depthFunc(gl.LESS);
    gl.disable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    /*  */
    /*gl.uniform1f(shaderProgram.alphaUniform, 0.2);*/


}

function buffers(){
     // array element buffer
    var iBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(indices), gl.STATIC_DRAW);

    // color array attribute buffer
    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertexColors), gl.STATIC_DRAW );

    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    // vertex array attribute buffer
    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
}

function stuff(){
    init();
    render();
}

window.onload = stuff;



var bflies = [];
var longradius = 20;
var shortradius = 15;

var alignmentWeight = 0.7;
var cohesionWeight = 0.7;
var separationWeight = 0.7;


for(var i = 0;i<40;i++){
    bflies[i] = {
        rotWing: 0.0,        // Snúningshorn vængjanna
        incWing: 4.0,        // Breyting á snúningshorni
        pos: vec3(),
        vel: vec3(),
        oldpos: vec3(),
        oldvel: vec3(),
        color: vec4(Math.random(),Math.random(),Math.random(),1)
    };
    bflies[i].rotWing = Math.floor(Math.random()*80-40);
    if(i%2===0)bflies[i].incWing *= -1;

    bflies[i].pos =     vec3(Math.random()*80-40,Math.random()*80-40,Math.random()*80-40);
    bflies[i].oldpos =  vec3(Math.random()*80-40,Math.random()*80-40,Math.random()*80-40);

    bflies[i].vel =     vec3(Math.random()-0.5,Math.random()-0.5,Math.random()-0.5);
    bflies[i].oldvel =  vec3(Math.random()-0.5,Math.random()-0.5,Math.random()-0.5);

}


function drawBox(ctmMain){
    // Preparing box
    vertices = bodyvertices;
    vertexColors = boxColors;
    buffers();

    //Draw box
    var ctm10 = mult( ctmMain, scalem( 100, 100, 100 ) );

    gl.uniformMatrix4fv(matrixLoc, false, flatten(ctm10));
    gl.drawElements( gl.TRIANGLES, numVertices, gl.UNSIGNED_BYTE, 0 );
}


function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    setOldPosVel(); 

    var ctmMain = mat4();
    ctmMain = mult( ctmMain, rotateX(spinX) );
    ctmMain = mult( ctmMain, rotateY(spinY) );
    ctmMain = mult( ctmMain, scalem(0.01,0.01,0.01) );

    drawBox(ctmMain);

    for(var i = 0;i<bflies.length;i++){
        var x1 = bflies[i].oldpos[0];
        var y1 = bflies[i].oldpos[1];
        var z1 = bflies[i].oldpos[2];


        var v1 = vec3(0,0,0);
        var n1 = 0;
        var v2 = vec3(0,0,0);
        var n2 = 0;
        var v3 = vec3(0,0,0);
        var n3 = 0;

        for(var p = 0;p<bflies.length;p++){
            if(p!==i){
                var x2 = bflies[p].oldpos[0];
                var y2 = bflies[p].oldpos[1];
                var z2 = bflies[p].oldpos[2];

                var x3 = Math.abs(x2-x1);
                var y3 = Math.abs(y2-y1);
                var z3 = Math.abs(z2-z1);

                if(Math.sqrt(Math.pow(x3,2) + Math.pow(y3,2) + Math.pow(z3,2))<longradius){
                    v1[0] += bflies[p].oldvel[0];
                    v1[1] += bflies[p].oldvel[1];
                    v1[2] += bflies[p].oldvel[2];

                    v2[0] += bflies[p].oldpos[0];
                    v2[1] += bflies[p].oldpos[1];
                    v2[2] += bflies[p].oldpos[2];   

                    
                    n1++;
                    n2++;

                }  
                if(Math.sqrt(Math.pow(x3,2) + Math.pow(y3,2) + Math.pow(z3,2))<shortradius){
                        v3[0] += bflies[p].oldpos[0] - bflies[i].oldpos[0];
                        v3[1] += bflies[p].oldpos[1] - bflies[i].oldpos[1];
                        v3[2] += bflies[p].oldpos[2] - bflies[i].oldpos[2];
                        n3++;
                }     

            }
            
        }
        if(n1!==0){
            v1[0] /= n1;
            v1[1] /= n1;
            v1[2] /= n1;

            v1 = normalizeV(v1);
            
        }
        if(n2!==0){
            v2[0] /= n2;
            v2[1] /= n2;
            v2[2] /= n2;

            var temp = vec3(v2[0]-x1,v2[1]-y1,v2[2]-z1);
            v2 = temp;
            
            v2 = normalizeV(v2);
        }
        if(n3!==0){
            v3[0] /= n3;
            v3[1] /= n3;
            v3[2] /= n3;       

            v3[0] *= -1;
            v3[1] *= -1;
            v3[2] *= -1;

            v3 = normalizeV(v3);
        }
        
        bflies[i].vel[0] += v1[0] * alignmentWeight + v2[0] * cohesionWeight + v3[0] * separationWeight;
        bflies[i].vel[1] += v1[1] * alignmentWeight + v2[1] * cohesionWeight + v3[1] * separationWeight;
        bflies[i].vel[2] += v1[2] * alignmentWeight + v2[2] * cohesionWeight + v3[2] * separationWeight;

        

        bflies[i].vel  = normalizeV(bflies[i].vel);

        /*var length = Math.sqrt( Math.pow(bflies[i].vel[0],2) + Math.pow(bflies[i].vel[1],2) + Math.pow(bflies[i].vel[2],2) ); */
        /*console.log(length+" "+bflies[i].vel[0]+" "+bflies[i].vel[1]+" "+bflies[i].vel[2]);*/

        bflies[i].pos[0] += bflies[i].vel[0];
        bflies[i].pos[1] += bflies[i].vel[1];
        bflies[i].pos[2] += bflies[i].vel[2];

        var distance = 48;
        var offset = 0;

        if(bflies[i].pos[0]< -1*distance) bflies[i].pos[0] = distance -offset;
        if(bflies[i].pos[0]>distance) bflies[i].pos[0] = -1*distance + offset;

        if(bflies[i].pos[1]<-1*distance) bflies[i].pos[1] = distance -offset;
        if(bflies[i].pos[1]>distance) bflies[i].pos[1] = -1*distance + offset;

        if(bflies[i].pos[2]<-1*distance) bflies[i].pos[2] = distance -offset;
        if(bflies[i].pos[2]>distance) bflies[i].pos[2] = -1*distance + offset;

        drawBfly(ctmMain,i);
    }

    
    setTimeout(function(){ 
        requestAnimFrame( render ); 
    }, 1000/60);
}


function drawBfly(ctmMain,i){
        rotateWings(i);

        var ctm0 = ctmMain;  
        
        ctm0 = mult( ctm0, translate( bflies[i].pos[0], bflies[i].pos[1], bflies[i].pos[2] ) );
        ctm0 = mult(ctm0,rotateY(getAngle(bflies[i].vel[0],bflies[i].vel[2])));

        // Preparing body
        vertices = bodyvertices;
        vertexColors = bodyvertexColors;
        buffers();

        var size = 0.3;

        //Draw body
        var ctm3 = mult( ctm0, scalem( 10.4*size, 4*size, 4*size) );

        gl.uniformMatrix4fv(matrixLoc, false, flatten(ctm3));
        gl.drawElements( gl.TRIANGLES, numVertices, gl.UNSIGNED_BYTE, 0 );

        // Preparing wings
        vertices = wingvertices;
        vertexColors = getWingColors(i);
        buffers();
        var ctm = mult(ctm0, scalem(17*size,17*size,17*size));
        
        // Wing 1
        var ctm2 = ctm;
        ctm = mult( ctm, rotateX( bflies[i].rotWing ) );

        gl.uniformMatrix4fv(matrixLoc, false, flatten(ctm));
        gl.drawElements( gl.TRIANGLES, numVertices, gl.UNSIGNED_BYTE, 0 );


        // Wing 2
        ctm2 = mult(ctm2, scalem(1,1,-1));
        ctm2 = mult( ctm2, rotateX( bflies[i].rotWing ) );

        gl.uniformMatrix4fv(matrixLoc, false, flatten(ctm2));
        gl.drawElements( gl.TRIANGLES, numVertices, gl.UNSIGNED_BYTE, 0 );
}

function rotateWings(i){
    bflies[i].rotWing += bflies[i].incWing;
    if(bflies[i].rotWing> 50.0  || bflies[i].rotWing< -60.0 ){
        bflies[i].incWing *= -1;
    }
}



function setOldPosVel(){
    for(var i = 0;i<bflies.length;i++){
        bflies[i].oldpos = bflies[i].pos;
        bflies[i].oldvel = bflies[i].vel;
        //console.log(bflies[i].pos);
    }
}

function getAngle(x,z){
    return Math.atan2(z,x)*180/Math.PI;
}

function normalizeV(v){
    var length = Math.sqrt( Math.pow(v[0],2) + Math.pow(v[1],2) + Math.pow(v[2],2) );

    v[0] /= length;
    v[1] /= length;
    v[2] /= length; 

    return v;
}

document.getElementById("longrangeinput").value = longradius;
document.getElementById("shortrangeinput").value = shortradius;

document.getElementById("alignmentinput").value = alignmentWeight;
document.getElementById("cohesioninput").value = cohesionWeight;
document.getElementById("separationinput").value = separationWeight;

document.getElementById("longrangeinput").onchange = function(){
    longradius = this.value;
};
document.getElementById("shortrangeinput").onchange = function(){
    shortradius = this.value;
};

document.getElementById("alignmentinput").onchange = function(){
    alignmentWeight = this.value;
};
document.getElementById("cohesioninput").onchange = function(){
    cohesionWeight = this.value;
};
document.getElementById("separationinput").onchange = function(){
    separationWeight = this.value;
};