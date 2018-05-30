'use strict';

// UI Control
var stats_3D_S;   // 显示实时渲染帧数
var gui_3D_S;                   // dat.GUI
var controls_3D_S;              // gui控制属性

// model variables
var object3D_S;             // model object
var boundingBox_3D_S;       // model's bounding box

// sphere variables
var sphere_3D_S;            // sphere object
var sphere_pos_3D_S;        // sphere's center point
var sphere_radius_3D_S;     // sphere's radius
var sphere_wSegs_3D_S=180;  // 纬线带数目(test)
var sphere_hSegs_3D_S=360;  // 经线带数目(test)
var sphgeom_3D_S;           // sphere object
var sphmat_3D_S;            // sphere material
var rcsArray_3D_S;          // rcs数组
var RCSmax_3D_S,RCSmin_3D_S;// rcs的最大最小值
var vertexColorArray_3D_S;  // 顶点颜色数组
var verColorArrLen_3D_S;    // 顶点颜色数组长度

// webGL variables
var canvas_3D_S;            // canvas
var scene_3D_S;             // scene
var camera_3D_S;            // camera
var renderer_3D_S;          // WebGL renderer
var axisHelper_3D_S;        // axis
var ambientLight_3D_S;      // ambientLight
var directionalLight1_3D_S; // directionalLight1
var directionalLight2_3D_S; // directionalLight2
var controller_3D_S;        // TrackBallController
var stlloader_3D_S;         // STLLoader


// -----------------------------call functions---------------------------------------
/* initialize WebGL */
initWebGL_S();

/* set STLLoader */
stlloader_3D_S=new THREE.STLLoader();
var callbackOnLoadSTL_3D_S = function (modelgeom) {
    drawModel_S(modelgeom);     // draw model
    readRCSFile();              // read RCS file
    drawSphere();               // draw fusion layer
    // drawBoundingBox_S();        // 【测试用】draw AABB boundingBox
};
stlloader_3D_S.load('testData/f117.stl',callbackOnLoadSTL_3D_S);

// initialize States and GUI
// stats_3D_S = initStats();
// initControls();

// readRCSFile(); // 测试成功

// render
render_3D_S();

// ---------------------------definition of functions--------------------------------
/* method: initWebGL_S
   args: none
   function:  */
function initWebGL_S() {
    canvas_3D_S = document.getElementById('canvas_3D_S');   // get canvas
    scene_3D_S = new THREE.Scene();                         // set scene
    // set Axis
    axisHelper_3D_S = new THREE.AxisHelper( 5 );
    scene_3D_S.add( axisHelper_3D_S );
    // set camera
    camera_3D_S = new THREE.PerspectiveCamera(
        45, window.innerWidth/window.innerHeight, 0.1, 10000
    );
    camera_3D_S.position.x = 30;
    camera_3D_S.position.y = 10;
    camera_3D_S.position.z = 30;
    camera_3D_S.lookAt(new THREE.Vector3(0, 0, 0));
    scene_3D_S.add(camera_3D_S);
    // set lights
    ambientLight_3D_S = new THREE.AmbientLight(0x404040);
    directionalLight1_3D_S = new THREE.DirectionalLight(0xc0c090);
    directionalLight2_3D_S = new THREE.DirectionalLight(0xc0c090);
    directionalLight1_3D_S.position.set(-100,-50,100);
    directionalLight2_3D_S.position.set(100,50,-100);
    scene_3D_S.add(ambientLight_3D_S);
    scene_3D_S.add(directionalLight1_3D_S);
    scene_3D_S.add(directionalLight2_3D_S);
    // set renderer
    renderer_3D_S = new THREE.WebGLRenderer({
        canvas: canvas_3D_S,
        antialias: true,
    });
    renderer_3D_S.setClearColor(0xeeeeee);
    renderer_3D_S.setSize( window.innerWidth, window.innerHeight );
    // set controller
    controller_3D_S = new THREE.TrackballControls(camera_3D_S, renderer_3D_S.domElement);
    controller_3D_S.rotateSpeed = 2.5;
    controller_3D_S.zoomSpeed = 1.0;
    controller_3D_S.panSpeed = 0.6;
}

/* method: render_3D_S
   args: none
   function: render */
function render_3D_S() {
    // stats_3D_S.update();
    requestAnimationFrame(render_3D_S);
    if (!renderer_3D_S.autoClear) renderer_3D_S.clear();
    controller_3D_S.update();
    renderer_3D_S.render(scene_3D_S,camera_3D_S);
}

/* method: drawModel
   args: modelgeom: returned by model loader
   function:  */
function drawModel_S(modelgeom) {
    // ---------------------------create model-----------------------------------
    var modelmat_3D_S = new THREE.MeshBasicMaterial({
            transparency: true,
            opacity: 1.0,
            wireframeLinewidth: 0.3,
            color: 0x555555
    });
    modelmat_3D_S.wireframe = true;
    object3D_S = new THREE.Mesh(modelgeom, modelmat_3D_S);  // create model object
    boundingBox_3D_S = new THREE.Box3().setFromObject(object3D_S);  // get bounding box
    object3D_S.rotation.set( - Math.PI / 2, 0, 0 ); // rotate model
    scene_3D_S.add(object3D_S); // add model to the scene
}

/* method: readRCSFile
   args: none
   function:  */
function readRCSFile() {
    // 读取&&分析文件
    $.get("./testData/f117.txt", function (data) {
        rcsArray_3D_S = [];
        RCSmax_3D_S=parseFloat("0.0");
        RCSmin_3D_S=parseFloat("1.0");

        var rows = data.split('\n'); // 按行划分
        for(let row of rows){
            const row1=row.replace(/\s+/g,' ');
            let rows=row1.split(' ');
            // rows.shift();
            if (rows[8]!='undefined'||NaN) {
                var curNum = parseFloat(rows[8]);
                rcsArray_3D_S.push(curNum);
                if (curNum < RCSmin_3D_S)
                    RCSmin_3D_S = curNum;
                else if (curNum > RCSmax_3D_S)
                    RCSmax_3D_S = curNum;
            }
        }
        // rcsArrayLen_3D_S = rcsArray_3D_S.length;
        // console.log(rcsArray_3D_S);
        // console.log(rcsArrayLen_3D_S);
        // console.log(RCSmax);
        // console.log(RCSmin);
    });
}

/* method: drawSphere
   args: none
   function:  */
function drawSphere() {
    // calculate radius and position
    var sqrt_3D_S = Math.sqrt(
        (boundingBox_3D_S.max.x - boundingBox_3D_S.min.x) * (boundingBox_3D_S.max.x - boundingBox_3D_S.min.x) +
        (boundingBox_3D_S.max.y - boundingBox_3D_S.min.y) * (boundingBox_3D_S.max.y - boundingBox_3D_S.min.y) +
        (boundingBox_3D_S.max.z - boundingBox_3D_S.min.z) * (boundingBox_3D_S.max.z - boundingBox_3D_S.min.z)
    );
    sphere_radius_3D_S = Math.ceil(sqrt_3D_S) / 2;
    sphere_pos_3D_S = new THREE.Vector3(
        // center point of the boundingBox
        (boundingBox_3D_S.max.x + boundingBox_3D_S.min.x) / 2,
        (boundingBox_3D_S.max.y + boundingBox_3D_S.min.y) / 2,
        (boundingBox_3D_S.max.z + boundingBox_3D_S.min.z) / 2
    );

    // create sphere geometry
    sphgeom_3D_S = new THREE.Geometry(); // define a blank geometry

    // 【生成所有顶点位置和颜色】 latNumber:纬线计数器
    for (var latNumber=0; latNumber<=sphere_wSegs_3D_S; latNumber++) {
        var theta = latNumber * Math.PI / sphere_wSegs_3D_S; // θ
        var sinTheta = Math.sin(theta);
        var cosTheta = Math.cos(theta);
        for (var longNumber=0; longNumber<=sphere_hSegs_3D_S; longNumber++) {
            var phi = longNumber * 2 * Math.PI / sphere_hSegs_3D_S; // φ
            var sinPhi = Math.sin(phi);
            var cosPhi = Math.cos(phi);
            // 球坐标系映射到xyz
            var x = sphere_radius_3D_S * sinTheta * cosPhi;
            var y = sphere_radius_3D_S * sinTheta * sinPhi;
            var z = sphere_radius_3D_S * cosTheta;
            var p = new THREE.Vector3(x, y, z);
            sphgeom_3D_S.vertices.push(p);

            // 伪彩色映射
            // 从数组里取rcs
            rcsArray_3D_S[]

            var gray_color = 256.0 *
            var RCSmax_3D_S,RCSmin_3D_S;// rcs的最大最小值
            var vertexColorArray_3D_S;  // 顶点颜色数组

            // 将rcs值映射到灰度上
            // 灰度值伪彩色化
            // var red_color = trans_R(gray_color);
            // var green_color = trans_G(gray_color);
            // var blue_color = trans_B(gray_color);
            // 产生对应的颜色，push到颜色数组中

            // console.log(new THREE.Vector3(red_color,green_color,blue_color));
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
        }
    }

    // create faces
    for (var vertexCounter = 0; vertexCounter<indexData.length; vertexCounter+=3) {
        var index1 = indexData[vertexCounter];
        var index2 = indexData[vertexCounter+1];
        var index3 = indexData[vertexCounter+2];
        var face = new THREE.Face3(index1, index2, index3);
        // var color1 = 颜色数组(index1);
        // var color2 = 颜色数组(index2);
        // var color3 = 颜色数组(index3);
        // face.vertexColors.push(color1, color2, color3);//定义三角面三个顶点的颜色
        sphgeom_3D_S.faces.push(face);
    }

    sphmat_3D_S=new THREE.MeshBasicMaterial({
        vertexColors: THREE.VertexColors,   //以顶点颜色为准
        side: THREE.DoubleSide, //两面可见
        transparent: true,  //允许调整透明度
        opacity: 0.6
    });//材质对象

    var sphmat_3D_S_test = new THREE.MeshBasicMaterial({
        transparency: true,
        opacity: 1.0,
        wireframeLinewidth: 0.3,
        color: 0xaaaaaa
    });
    sphmat_3D_S_test.wireframe = true;

    // create sphere and add it to scene
    sphere_3D_S = new THREE.Mesh(sphgeom_3D_S, sphmat_3D_S_test);//网格模型对象
    scene_3D_S.add(sphere_3D_S); //网格模型添加到场景中
}

function gray_scale(theta, phi) {
    // var gray_value = Math.ceil(Math.sin(theta+phi) * 256);
    var gray_value = Math.ceil(Math.sin(theta) * 256);
    return gray_value;
}

function trans_R(gray_color) {
    var color_red;
    if (gray_color >= 0.0 && gray_color < 128.0) {
        color_red = 0.0;
    }else if (gray_color >= 128.0 && gray_color < 192.0) {
        color_red = (gray_color - 128.0) / 64.0;
    }else if (gray_color >= 192.0 && gray_color <= 256.0) {
        color_red = 1.0;
    }
    return color_red;

    // 传统伪彩色编码
    // var color_red;
    // if (gray_color >= 0.0 && gray_color < 96.0) {
    //     color_red = 0.0;
    // } else if (gray_color >= 96.0 && gray_color < 128.0) {
    //     color_red = (gray_color - 96.0) / 32.0;
    // } else if (gray_color >= 128.0 && gray_color <= 256.0) {
    //     color_red = 1.0;
    // }
    // return color_red;
}

function trans_G(gray_color) {
    var color_green;
    if (gray_color >= 0.0 && gray_color < 64.0) {
        color_green = 0.0;
    }else if (gray_color >= 64.0 && gray_color < 128.0) {
        color_green = (gray_color - 64.0) / 64.0;
    }else if (gray_color >= 128.0 && gray_color < 192.0) {
        color_green = 1.0;
    } else if (gray_color >= 192.0 && gray_color <= 256.0) {
        color_green = (256.0 - gray_color) / 64.0;
    }
    return color_green;

    // 传统伪彩色编码
    // var color_green;
    // if (gray_color >= 0.0 && gray_color < 32.0) {
    //     color_green = 0.0;
    // } else if (gray_color >= 32.0 && gray_color < 64.0) {
    //     color_green = (gray_color - 32.0) / 32.0;
    // } else if (gray_color >= 64.0 && gray_color < 128.0) {
    //     color_green = 1.0;
    // } else if (gray_color >= 128.0 && gray_color < 192.0) {
    //     color_green = (192.0 - gray_color) / 64.0;
    // } else if (gray_color >= 192.0 && gray_color <= 256.0) {
    //     color_green = (gray_color - 192.0) / 64.0;
    // }
    // return color_green;
}

function trans_B(gray_color) {
    var color_blue;
    if (gray_color >= 0.0 && gray_color < 64.0) {
        color_blue = gray_color / 64.0;
    }else if (gray_color >= 64.0 && gray_color < 128.0) {
        color_blue = (128.0 - gray_color) / 64.0;
    }else if (gray_color >= 128.0 && gray_color <= 256.0) {
        color_blue = 0.0;
    }
    return color_blue;

    // 传统伪彩色编码
    // var color_blue;
    // if (gray_color >= 0.0 && gray_color < 32.0) {
    //     color_blue = gray_color / 32.0;
    // } else if (gray_color >= 32.0 && gray_color < 64.0) {
    //     color_blue = 1.0;
    // } else if (gray_color >= 64.0 && gray_color < 96.0) {
    //     color_blue = (96.0 - gray_color) / 32.0;
    // } else if (gray_color >= 96.0 && gray_color < 192.0) {
    //     color_blue = 0.0;
    // } else if (gray_color >= 192.0 && gray_color <= 256.0) {
    //     color_blue = (gray_color - 192.0) / 64.0;
    // }
    // return color_blue;
}

/* method: drawBoundingBox
   args: none
   function:  */
function drawBoundingBox_S() {
    // ------------------------------draw boundingBox---------------------------------
    var bbgeom = new THREE.Geometry();
    var v0 = new THREE.Vector3(boundingBox_3D_S.max.x,boundingBox_3D_S.min.y,boundingBox_3D_S.min.z);
    var v1 = new THREE.Vector3(boundingBox_3D_S.max.x,boundingBox_3D_S.min.y,boundingBox_3D_S.max.z);
    var v2 = new THREE.Vector3(boundingBox_3D_S.min.x,boundingBox_3D_S.min.y,boundingBox_3D_S.max.z);
    var v3 = new THREE.Vector3(boundingBox_3D_S.min.x,boundingBox_3D_S.min.y,boundingBox_3D_S.min.z);
    var v4 = new THREE.Vector3(boundingBox_3D_S.max.x,boundingBox_3D_S.max.y,boundingBox_3D_S.min.z);
    var v5 = new THREE.Vector3(boundingBox_3D_S.max.x,boundingBox_3D_S.max.y,boundingBox_3D_S.max.z);
    var v6 = new THREE.Vector3(boundingBox_3D_S.min.x,boundingBox_3D_S.max.y,boundingBox_3D_S.max.z);
    var v7 = new THREE.Vector3(boundingBox_3D_S.min.x,boundingBox_3D_S.max.y,boundingBox_3D_S.min.z);
    var v8 = new THREE.Vector3(
        // 包围盒中心点
        (boundingBox_3D_S.max.x + boundingBox_3D_S.min.x) / 2,
        (boundingBox_3D_S.max.y + boundingBox_3D_S.min.y) / 2,
        (boundingBox_3D_S.max.z + boundingBox_3D_S.min.z) / 2
    );
    var f0 = new THREE.Face4(0,2,1);
    var f1 = new THREE.Face4(0,2,3);
    var f2 = new THREE.Face4(4,6,5);
    var f3 = new THREE.Face4(4,6,7);
    var f4 = new THREE.Face4(1,4,0);
    var f5 = new THREE.Face4(1,4,5);
    var f6 = new THREE.Face4(2,7,3);
    var f7 = new THREE.Face4(2,7,6);
    var f8 = new THREE.Face4(1,6,2);
    var f9 = new THREE.Face4(1,6,5);
    var f10 = new THREE.Face4(0,7,3);
    var f11 = new THREE.Face4(0,7,4);
    bbgeom.vertices.push(v0,v1,v2,v3,v4,v5,v6,v7,v8);
    bbgeom.faces.push(f0,f1,f2,f3,f4,f5,f6,f7,f8,f9,f10,f11);
    var bbmat = new THREE.MeshBasicMaterial(
        {
            transparency: true,
            opacity: 0.5,
            wireframeLinewidth: 0.5,
            color: 0xff0000
        }
    );
    bbmat.wireframe = true;
    var bb_Object = new THREE.Mesh(bbgeom, bbmat);
    // bb_Object.scale.set(20,20,20);
    bb_Object.rotation.set( - Math.PI / 2, 0, 0 );
    scene_3D_S.add(bb_Object);

    // 测试用：利用粒子系统绘制包围盒的八个顶点和中心点
    var particla_mat = new THREE.ParticleBasicMaterial({
        color: 0x00FFFF,
        size: 0.5
    });
    var vertex_system =  new THREE.ParticleSystem(bbgeom, particla_mat);
    // vertex_system.scale.set(20,20,20);
    vertex_system.rotation.set( - Math.PI / 2, 0, 0 );
    scene_3D_S.add(vertex_system);
}

/* method: findColor
   args: none
   function:  */
function findColor(index,total) {
    var ratio = 1.0 * index / total;
    return new THREE.Color(0xFFFFFF * ratio);
}

/* method: initStats
   args: none
   function:  */
function initStats() {
    stats_3D_S = new Stats();
    stats_3D_S.setMode(0); // 0: fps, 1: ms
    // Align top-left
    stats_3D_S.domElement.style.position = 'absolute';
    stats_3D_S.domElement.style.left = '0px';
    stats_3D_S.domElement.style.top = '0px';
    document.getElementById("Stats-output").appendChild(stats_3D_S.domElement);
}

/* method: initStats
   args: none
   function:  */
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
