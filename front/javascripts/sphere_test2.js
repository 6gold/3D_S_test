'use strict';

// UI ----------------------------------------
var stats_3D_S; // 显示实时渲染帧数
var gui_3D_S;
var controls_3D_S; // gui控制属性
// -------------------------------------------

var sphere_3D_S; // sphere around the model
var sphere_radius_3D_S;
var sphere_pos_3D_S;
var sphere_wSegs_3D_S;
var sphere_hSegs_3D_S;
var sphmat_3D_S;

// get canvas
var canvas_3D_S = document.getElementById('canvas_3D_S');

// set scene
var scene_3D_S = new THREE.Scene();

// set Axis
var axisHelper_3D_S = new THREE.AxisHelper( 150 );
scene_3D_S.add( axisHelper_3D_S );

// set camera
var camera_3DS = new THREE.PerspectiveCamera(
    45, window.innerWidth/window.innerHeight, 0.1, 10000
);
camera_3DS.position.x = 0;
camera_3DS.position.y = 175;
camera_3DS.position.z = 500;
camera_3DS.lookAt(new THREE.Vector3(0, 0, 0));
scene_3D_S.add(camera_3DS);

// set lights
var ambientLight_3D_S = new THREE.AmbientLight(0x404040);
var directionalLight1_3D_S = new THREE.DirectionalLight(0xc0c090);
var directionalLight2_3D_S = new THREE.DirectionalLight(0xc0c090);
directionalLight1_3D_S.position.set(-100,-50,100);
directionalLight2_3D_S.position.set(100,50,-100);
scene_3D_S.add(ambientLight_3D_S);
scene_3D_S.add(directionalLight1_3D_S);
scene_3D_S.add(directionalLight2_3D_S);

// set renderer
var renderer_3D_S = new THREE.WebGLRenderer({
    canvas:canvas_3D_S,
    antialias:true,
});
renderer_3D_S.setClearColor(0xeeeeee);
renderer_3D_S.setSize( window.innerWidth, window.innerHeight );
// renderer_3D_S.setPixelRatio( window.devicePixelRatio );

// set controller
var controller_3D_S = new THREE.TrackballControls(camera_3DS, renderer_3D_S.domElement);
controller_3D_S.rotateSpeed = 2.5;
controller_3D_S.zoomSpeed = 1.0;
controller_3D_S.panSpeed = 0.6;

// -----------------------------call functions---------------------------------------
createSphere();

initStats();
// initialize GUI
initControls();

render_3D_S();

// ---------------------------definition of functions--------------------------------
/* method: render_3D_S
   args: none
   function: render */
function render_3D_S() {
    stats_3D_S.update();
    requestAnimationFrame(render_3D_S);
    if (!renderer_3D_S.autoClear) renderer_3D_S.clear();
    controller_3D_S.update();
    renderer_3D_S.render(scene_3D_S,camera_3DS);
}

/* method: createSphere
   args: none
   function: draw a sphere */
function createSphere() {
    var geometry = new THREE.Geometry({
        colorsNeedUpdate : true
    }); // define a blank geometry
    var material = new THREE.MeshBasicMaterial(
        {
            transparency: true,
            opacity: 1.0,
            wireframeLinewidth: 0.5,
            color: 0x444444
        }
    );
    material.wireframe = true;

    sphere_radius_3D_S = 60; // test value
    sphere_wSegs_3D_S = 60; // test value 纬带数(纬线数+1)
    sphere_hSegs_3D_S = 60; // test value 经带数

    // 【生成所有顶点位置】 latNumber:纬线计数器
    var totalVertex = (sphere_wSegs_3D_S+1)*(sphere_hSegs_3D_S+1);
    for (var latNumber=0; latNumber<=sphere_wSegs_3D_S; latNumber++) {
        var theta = latNumber * Math.PI / sphere_wSegs_3D_S;
        var sinTheta = Math.sin(theta);
        var cosTheta = Math.cos(theta);
        for (var longNumber=0; longNumber<=sphere_hSegs_3D_S; longNumber++) {
            var phi = longNumber * 2 * Math.PI / sphere_hSegs_3D_S;
            var sinPhi = Math.sin(phi);
            var cosPhi = Math.cos(phi);
            // 球坐标系映射到xyz
            var x = sphere_radius_3D_S * sinTheta * cosPhi;
            var y = sphere_radius_3D_S * sinTheta * sinPhi;
            var z = sphere_radius_3D_S * cosTheta;
            var p = new THREE.Vector3(x, y, z);
            geometry.vertices.push(p);
        }
    }
    // 为了把这些顶点缝合到一起，需要【建立三角面片索引列表】
    var indexData = [];
    for (var latNumber = 0; latNumber < sphere_wSegs_3D_S; latNumber++) {
        for (var longNumber = 0; longNumber < sphere_hSegs_3D_S; longNumber++) {
            var first = (latNumber * (sphere_hSegs_3D_S + 1)) + longNumber;
            var second = first + sphere_hSegs_3D_S + 1;
            indexData.push(first);
            indexData.push(second);
            indexData.push(first + 1);
            indexData.push(second);
            indexData.push(second + 1);
            indexData.push(first + 1);
            // 测试用：调整了顶点顺序
            // indexData.push(first + 1);
            // indexData.push(second);
            // indexData.push(second + 1);
        }
    }
    // create faces
    for (var vertexCounter = 0; vertexCounter<indexData.length; vertexCounter+=3) {
        // var face = new THREE.Face3(
        //     indexData[vertexCounter],
        //     indexData[vertexCounter+1],
        //     indexData[vertexCounter+2]
        // );
        var index1 = indexData[vertexCounter];
        var index2 = indexData[vertexCounter+1];
        var index3 = indexData[vertexCounter+2];
        var face = new THREE.Face3(
            index1,
            index2,
            index3
        );

        //着色方案1：仅用三种颜色测试
        // var color1 = findColor2(index1);//顶点1颜色
        // var color2 = findColor2(index2);//顶点2颜色
        // var color3 = findColor2(index3);//顶点3颜色

        // 着色方案2：灰度→彩色映射
        // 尚未测试
        // var color1 = trans_R( gray_scale(index1,totalVertex) );
        // var color2 = trans_G( gray_scale(index2,totalVertex) );
        // var color3 = trans_B( gray_scale(index3,totalVertex) );

        // 着色方案3：随机颜色
        // var color1 = new THREE.Color(0xFFFFFF * Math.random());//顶点1颜色——红色
        // var color2 = new THREE.Color(0xFFFFFF * Math.random());//顶点2颜色——绿色
        // var color3 = new THREE.Color(0xFFFFFF * Math.random());//顶点3颜色——蓝色
        // var color1 = new THREE.Color(getColor());//顶点1颜色——红色  产生随机色の方法2
        // var color2 = new THREE.Color(getColor());//顶点2颜色——绿色
        // var color3 = new THREE.Color(getColor());//顶点3颜色——蓝色

        // 着色方案4：随顶点索引数规律变化
        var color1 = findColor(index1,totalVertex);//顶点1颜色——红色
        var color2 = findColor(index2,totalVertex);//顶点2颜色——绿色
        var color3 = findColor(index3,totalVertex);//顶点3颜色——蓝色

        face.vertexColors.push(color1, color2, color3);//定义三角面三个顶点的颜色
        geometry.faces.push(face);
    }

    sphmat_3D_S=new THREE.MeshBasicMaterial({
        vertexColors: THREE.VertexColors,//以顶点颜色为准
        //vertexColors: geometry.colors,//以顶点颜色为准
        side: THREE.DoubleSide,//两面可见
        opacity: 1.0
    });//材质对象

    // create sphere and add it to scene
    sphere_3D_S = new THREE.Mesh(geometry,sphmat_3D_S);//网格模型对象
    scene_3D_S.add(sphere_3D_S); //网格模型添加到场景中
}

// 测试用：根据顶点索引产生连续变化的颜色
function findColor(index,total) {
    var ratio = 1.0 * index / total;
    return new THREE.Color(0xFFFFFF * ratio);
}

function findColor2(index) {
    if (index % 3==0) {
        return new THREE.Color(0xFF6666);
    } else if (index % 3==1) {
        return new THREE.Color(0xFFFF66);
    } else if (index % 3==2) {
        return new THREE.Color(0x99CC66);
    }
}

// 随机生成16进制的颜色值
function getColor(){
    var r=Math.floor(Math.random()*256);
    var g=Math.floor(Math.random()*256);
    var b=Math.floor(Math.random()*256);
    return "rgb("+r+','+g+','+b+")";
}


function initStats() {
    stats_3D_S = new Stats();
    stats_3D_S.setMode(0); // 0: fps, 1: ms
    // Align top-left
    stats_3D_S.domElement.style.position = 'absolute';
    stats_3D_S.domElement.style.left = '0px';
    stats_3D_S.domElement.style.top = '0px';
    document.getElementById("Stats-output").appendChild(stats_3D_S.domElement);
}

function initControls() {
    controls_3D_S = new function () {
        this.opacity = sphmat_3D_S.opacity;
        this.transparent = sphmat_3D_S.transparent;
    };
    gui_3D_S = new dat.GUI();
    var spGui = gui_3D_S.addFolder("Sphere");
    spGui.add(controls_3D_S, 'opacity', 0, 1).onChange(function (e) {
        sphmat_3D_S.opacity = e
    });
    spGui.add(controls_3D_S, 'transparent').onChange(function (e) {
        sphmat_3D_S.transparent = e
    });
}

// function gray_scale(index,total) {
//     // var gray_value = Math.ceil(Math.sin(theta+phi) * 256);
//     return Math.ceil(256 * index / total);
// }
// function trans_R(gray_color) {
//     var color_red;
//     if (gray_color >= 0.0 && gray_color < 128.0) {
//         color_red = 0.0;
//     }else if (gray_color >= 128.0 && gray_color < 192.0) {
//         color_red = (gray_color - 128.0) / 64.0;
//     }else if (gray_color >= 192.0 && gray_color <= 256.0) {
//         color_red = 1.0;
//     }
//     return color_red;
//
//     // 传统伪彩色编码
//     // var color_red;
//     // if (gray_color >= 0.0 && gray_color < 96.0) {
//     //     color_red = 0.0;
//     // } else if (gray_color >= 96.0 && gray_color < 128.0) {
//     //     color_red = (gray_color - 96.0) / 32.0;
//     // } else if (gray_color >= 128.0 && gray_color <= 256.0) {
//     //     color_red = 1.0;
//     // }
//     // return color_red;
//
// }
// function trans_G(gray_color) {
//     var color_green;
//     if (gray_color >= 0.0 && gray_color < 64.0) {
//         color_green = 0.0;
//     }else if (gray_color >= 64.0 && gray_color < 128.0) {
//         color_green = (gray_color - 64.0) / 64.0;
//     }else if (gray_color >= 128.0 && gray_color < 192.0) {
//         color_green = 1.0;
//     } else if (gray_color >= 192.0 && gray_color <= 256.0) {
//         color_green = (256.0 - gray_color) / 64.0;
//     }
//     return color_green;
//
//     // 传统伪彩色编码
//     // var color_green;
//     // if (gray_color >= 0.0 && gray_color < 32.0) {
//     //     color_green = 0.0;
//     // } else if (gray_color >= 32.0 && gray_color < 64.0) {
//     //     color_green = (gray_color - 32.0) / 32.0;
//     // } else if (gray_color >= 64.0 && gray_color < 128.0) {
//     //     color_green = 1.0;
//     // } else if (gray_color >= 128.0 && gray_color < 192.0) {
//     //     color_green = (192.0 - gray_color) / 64.0;
//     // } else if (gray_color >= 192.0 && gray_color <= 256.0) {
//     //     color_green = (gray_color - 192.0) / 64.0;
//     // }
//     // return color_green;
// }
// function trans_B(gray_color) {
//     var color_blue;
//     if (gray_color >= 0.0 && gray_color < 64.0) {
//         color_blue = gray_color / 64.0;
//     }else if (gray_color >= 64.0 && gray_color < 128.0) {
//         color_blue = (128.0 - gray_color) / 64.0;
//     }else if (gray_color >= 128.0 && gray_color <= 256.0) {
//         color_blue = 0.0;
//     }
//     return color_blue;
//
//     // 传统伪彩色编码
//     // var color_blue;
//     // if (gray_color >= 0.0 && gray_color < 32.0) {
//     //     color_blue = gray_color / 32.0;
//     // } else if (gray_color >= 32.0 && gray_color < 64.0) {
//     //     color_blue = 1.0;
//     // } else if (gray_color >= 64.0 && gray_color < 96.0) {
//     //     color_blue = (96.0 - gray_color) / 32.0;
//     // } else if (gray_color >= 96.0 && gray_color < 192.0) {
//     //     color_blue = 0.0;
//     // } else if (gray_color >= 192.0 && gray_color <= 256.0) {
//     //     color_blue = (gray_color - 192.0) / 64.0;
//     // }
//     // return color_blue;
// }