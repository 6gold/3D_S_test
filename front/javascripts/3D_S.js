'use strict';

// model variables
var object3D_S;
var boundingBox_3D_S;
// sphere variables
var sphere_3D_S; // sphere around the model
var sphere_pos_3D_S;
var sphere_radius_3D_S;
var sphere_wSegs_3D_S;
var sphere_hSegs_3D_S;
var sphgeom_3D_S;
var sphmat_3D_S;
// webGL variables
var canvas_3D_S;
var scene_3D_S;
var axisHelper_3D_S;
var camera_3D_S;
var ambientLight_3D_S;
var directionalLight1_3D_S;
var directionalLight2_3D_S;
var renderer_3D_S;
var controller_3D_S;
var stlloader_3D_S;


// -----------------------------call functions---------------------------------------
initWebGL_S();

// set STL loader
stlloader_3D_S=new THREE.STLLoader();
var callbackOnLoadSTL_3D_S = function (modelgeom) {
    drawModel_S(modelgeom);
    drawSphere();
    // drawBoundingBox_S();
};
stlloader_3D_S.load('http://localhost:3000/../models/test.stl',callbackOnLoadSTL_3D_S);

render_3D_S();

// ---------------------------definition of functions--------------------------------
/* method: initWebGL_S
   args: none
   function:  */
function initWebGL_S() {
    // get canvas
    canvas_3D_S = document.getElementById('canvas_3D_S');

    // set scene
    scene_3D_S = new THREE.Scene();

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
    // renderer_3D_S.setPixelRatio( window.devicePixelRatio );

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
    requestAnimationFrame(render_3D_S);
    if (!renderer_3D_S.autoClear) renderer_3D_S.clear();

    // update values
    // console.log(camera_3D_S.rotation.x);
    // document.getElementById("center_X_3D_S").innerHTML = Math.ceil(camera_3D_S.position.x).toString();
    // document.getElementById("center_Y_3D_S").innerHTML = Math.ceil(camera_3D_S.position.y).toString();
    // document.getElementById("center_Z_3D_S").innerHTML = Math.ceil(camera_3D_S.position.z).toString();
    // document.getElementById("rotation_X_3D_S").innerHTML = Math.ceil(camera_3D_S.rotation.x).toString();
    // document.getElementById("rotation_Y_3D_S").innerHTML = Math.ceil(camera_3D_S.rotation.y).toString();
    // document.getElementById("rotation_Z_3D_S").innerHTML = Math.ceil(camera_3D_S.rotation.z).toString();

    controller_3D_S.update();
    renderer_3D_S.render(scene_3D_S,camera_3D_S);
}

/* method: drawModel
   args: none
   function:  */
function drawModel_S(modelgeom) {
    // ---------------------------create model-----------------------------------
    var modelmat_3D_S = new THREE.MeshBasicMaterial(
        {
            transparency: true,
            opacity: 1,
            wireframeLinewidth: 0.5,
            color: 0x444444
        }
    );
    modelmat_3D_S.wireframe = true;
    object3D_S = new THREE.Mesh(modelgeom, modelmat_3D_S);
    // calculate boundingBox
    boundingBox_3D_S = new THREE.Box3().setFromObject(object3D_S);// bounding box
    console.log(boundingBox_3D_S);
    // calculate number of vertexes and faces
    // ......

    // object3D_S.position.set( 0, - 0.25, 0.6 );
    object3D_S.rotation.set( - Math.PI / 2, 0, 0 );
    // object3D_S.scale.set( 20, 20, 20);
    // add mesh to the scene
    scene_3D_S.add(object3D_S);
}

/* method: drawModel
   args: none
   function:  */
function drawSphere() {
    // create radius and position
    var sqrt_3D_S = Math.sqrt(
        (boundingBox_3D_S.max.x - boundingBox_3D_S.min.x) * (boundingBox_3D_S.max.x - boundingBox_3D_S.min.x) +
        (boundingBox_3D_S.max.y - boundingBox_3D_S.min.y) * (boundingBox_3D_S.max.y - boundingBox_3D_S.min.y) +
        (boundingBox_3D_S.max.z - boundingBox_3D_S.min.z) * (boundingBox_3D_S.max.z - boundingBox_3D_S.min.z)
    );
    sphere_radius_3D_S = Math.ceil(sqrt_3D_S) / 2;
    sphere_pos_3D_S = new THREE.Vector3(
        // 包围盒中心点
        (boundingBox_3D_S.max.x + boundingBox_3D_S.min.x) / 2,
        (boundingBox_3D_S.max.y + boundingBox_3D_S.min.y) / 2,
        (boundingBox_3D_S.max.z + boundingBox_3D_S.min.z) / 2
    );

    // create sphere
    sphgeom_3D_S = new THREE.Geometry(); // define a blank geometry

    sphere_wSegs_3D_S = 60; // test value 纬带数(纬线数+1)
    sphere_hSegs_3D_S = 60; // test value 经带数

    // 重新着色
    // ShaderMaterial测试
    var attributes = {
        color_r: {
            type: 'f', // a float
            value: [] // an empty array
        },
        color_g: {
            type: 'f', // a float
            value: [] // an empty array
        },
        color_b:{
            type: 'f', // a float
            value: [] // an empty array
        }
    };
    // now populate the array of attributes
    var color_r = attributes.color_r.value;
    var color_g = attributes.color_g.value;
    var color_b = attributes.color_b.value;

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
            sphgeom_3D_S.vertices.push(p);
            // 重新着色(伪彩色编码)

            //着色方案1：仅用三种颜色测试
            if ( sphgeom_3D_S.vertices.length%3 == 0 ) {
                var red_color = 255.0 / 256.0;
                var green_color = 102.0 / 256.0;
                var blue_color = 102.0 / 256.0;
            } else if ( sphgeom_3D_S.vertices.length%3 == 1 ) {
                var red_color = 255.0 / 256.0;
                var green_color = 255.0 / 256.0;
                var blue_color = 102.0 / 256.0;
            } else if ( sphgeom_3D_S.vertices.length%3 == 2 ) {
                var red_color = 153.0 / 256.0;
                var green_color = 204.0 / 256.0;
                var blue_color = 102.0 / 256.0;
            }

            // 着色方案2：灰度→彩色映射
            // // var gray_color = gray_scale(theta, phi);// 产生连续变化的灰度值1
            // var gray_color = Math.ceil(256.0 * sphgeom_3D_S.vertices.length / totalVertex);// 产生连续变化的灰度值2
            // // var gray_color = Math.random() * 256;// 随机产生灰度值
            // var red_color = trans_R(gray_color);
            // var green_color = trans_G(gray_color);
            // var blue_color = trans_B(gray_color);

            // 着色方案3：随机颜色
            // var red_color = Math.random();
            // var green_color = Math.random();
            // var blue_color = Math.random();

            // 着色方案4：随顶点索引数随机变化
            // var red_color = findColor(sphgeom_3D_S.vertices.length,totalVertex).r;
            // var green_color = findColor(sphgeom_3D_S.vertices.length,totalVertex).g;
            // var blue_color = findColor(sphgeom_3D_S.vertices.length,totalVertex).b;

            color_r.push(red_color);
            color_g.push(green_color);
            color_b.push(blue_color);
            console.log(new THREE.Vector3(red_color,green_color,blue_color));
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
        var face = new THREE.Face3(
            indexData[vertexCounter],
            indexData[vertexCounter+1],
            indexData[vertexCounter+2]
        );
        // 为面片随机生成颜色
        // var color1 = new THREE.Color(0xFF0000);//顶点1颜色——红色
        // var color2 = new THREE.Color(0x00FF00);//顶点2颜色——绿色
        // var color3 = new THREE.Color(0x0000FF);//顶点3颜色——蓝色
        // face.vertexColors.push(color1, color2,color3);//定义三角面三个顶点的颜色
        sphgeom_3D_S.faces.push(face);
    }

    // // random color material
    // var sphmat=new THREE.MeshLambertMaterial({
    //     vertexColors: THREE.VertexColors,//以顶点颜色为准
    //     side: THREE.DoubleSide,//两面可见
    //     transparent: true,
    //     opacity: 1.0
    // });//材质对象

    // // load shader
    $.get('http://localhost:3000/../shaders/my.vs', function(vShader){
        $.get('http://localhost:3000/../shaders/my.fs', function(fShader){
            // console.log(vShader); // test success
            // console.log(fShader); // test success
            sphmat_3D_S = new THREE.ShaderMaterial({
                vertexShader: vShader,
                fragmentShader: fShader,
                attributes: attributes,
                transparent: true
            });
            // create sphere and add it to scene[这两步必须放到材质生成之后，jQuery中]
            sphere_3D_S = new THREE.Mesh(sphgeom_3D_S, sphmat_3D_S);//网格模型对象
            sphere_3D_S.position.set(sphere_pos_3D_S.x, sphere_pos_3D_S.y, sphere_pos_3D_S.z);
            scene_3D_S.add(sphere_3D_S); //模型添加到场景中
        });
    });

    // create sphere and add it to scene
    // sphere_3D_S = new THREE.Mesh(sphgeom_3D_S, sphmat_3D_S);//网格模型对象
    // sphere_3D_S.position.set(0, 0, 0);
    // sphere_3D_S.scale.set( 22, 22, 22);
    // scene_3D_S.add(sphere_3D_S); //网格模型添加到场景中
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


    // 测试用 - create sphere
    // create radius and position
    var sqrt_3D_S = Math.sqrt(
        (boundingBox_3D_S.max.x - boundingBox_3D_S.min.x) * (boundingBox_3D_S.max.x - boundingBox_3D_S.min.x) +
        (boundingBox_3D_S.max.y - boundingBox_3D_S.min.y) * (boundingBox_3D_S.max.y - boundingBox_3D_S.min.y) +
        (boundingBox_3D_S.max.z - boundingBox_3D_S.min.z) * (boundingBox_3D_S.max.z - boundingBox_3D_S.min.z)
    );
    sphere_radius_3D_S = Math.ceil(sqrt_3D_S) / 2;
    sphere_pos_3D_S = new THREE.Vector3(v8.x, v8.y, v8.z);
    var sphgeom_3D_S = new THREE.SphereGeometry(sphere_radius_3D_S, 60, 60);
    var sphmat_3D_S = new THREE.MeshBasicMaterial(
        {
            transparency: true,
            opacity: 0.5,
            wireframeLinewidth: 0.5,
            color: 0xbbbbbb
        }
    );
    sphmat_3D_S.wireframe = true;
    sphere_3D_S = new THREE.Mesh(sphgeom_3D_S, sphmat_3D_S);
    // sphere_3D_S.position.set(0, 0, 0);
    sphere_3D_S.position.set(v8.x, v8.y, v8.z);
    sphere_3D_S.rotation.set( - Math.PI / 2, 0, 0 );
    // add sphere to the scene
    scene_3D_S.add(sphere_3D_S);
}

/* method: findColor
   args: none
   function:  */
function findColor(index,total) {
    var ratio = 1.0 * index / total;
    return new THREE.Color(0xFFFFFF * ratio);
}

// create rcs data
// function RCS_s(t, f,r_d) {
//     this.t = t;
//     this.f = f;
//     this.r_d = r_d;
// }
// function readRCS() {
    // read rcs data
// var rcs_s=[];
// var rcsLength_s;
// $.get("http://localhost:3000/rcs1", function( data ) {
//     var rows = data.split('\n');
//     for (let row of rows) {
//         const row1 = row.replace(/\s+/g, ' ');
//         let rows = row1.split(' ');
//         rcs_s.push(new RCS_s(rows[1], rows[2], rows[3]))
//     }
//     rcs_s.shift();
//     rcsLength_s = rcs_s.length;
//     console.log(rcs_s);
//     console.log(rcsLength_s);
// });
// }


// set OBJ loader
// var objLoader_3D_S = new THREE.OBJLoader2();
// var callbackOnLoad_3D_S = function (event) {
//     console.log(event.detail);
//     object3D_S = event.detail.loaderRootNode;
//     // scale the model
//     object3D_S.scale.set(5,5,5);
//     // calculate the center point
//     center_3D_S = object3D_S.position;
//     console.log(center_3D_S);
//     // calculate the bounding box
//     boundingBox_3D_S = new THREE.Box3().setFromObject(object3D_S);
//     console.log(boundingBox_3D_S);
//     // calculate the Euler rotation
//     rotation_3D_S = object3D_S.rotation;
//     console.log(rotation_3D_S);
//     // calculate number of vertexes and faces
//     // console.log(objLoader_3D_S);
//     console.log(controller_3D_S);
//
//     // add model to scene
//     scene_3D_S.add(object3D_S);
//
//     console.log(camera_3D_S);
// };
// objLoader_3D_S.load('assets/models/obj/Lockheed C130 Hercules.obj', callbackOnLoad_3D_S, null, null, null, false);