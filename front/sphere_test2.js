'use strict';

var sphere_3D_S; // sphere around the model
var sphere_radius_3D_S;
var sphere_pos_3D_S;
var sphere_wSegs_3D_S;
var sphere_hSegs_3D_S;

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
render_3D_S();

// ---------------------------definition of functions--------------------------------
/* method: render_3D_S
   args: none
   function: render */
function render_3D_S() {
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

            // geometry.colors.push( Math.sin(theta+phi) );
            // geometry.colors.push("rgb(255, 0, 0)");
            // 为每个顶点产生随机颜色
            // var random_r=Math.floor(Math.random());
            // var random_g=Math.floor(Math.random());
            // var random_b=Math.floor(Math.random());
            // var randomColor = new THREE.Color(random_r, random_g, random_b);
            // var randomColor = new THREE.Color(0xFF0000);
            // console.log(randomColor);
            // geometry.colors.push(randomColor);
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
        // var color1 = new THREE.Color(0xFF0000);//顶点1颜色——红色
        // var color2 = new THREE.Color(0x00FF00);//顶点2颜色——绿色
        // var color3 = new THREE.Color(0x0000FF);//顶点3颜色——蓝色

        // 着色方案2：灰度→彩色映射
        // 测试

        // 着色方案3：随机颜色
        // var color1 = new THREE.Color(0xFFFFFF * Math.random());//顶点1颜色——红色
        // var color2 = new THREE.Color(0xFFFFFF * Math.random());//顶点2颜色——绿色
        // var color3 = new THREE.Color(0xFFFFFF * Math.random());//顶点3颜色——蓝色

        // 着色方案4：随顶点索引数随机变化
        var color1 = findColor(index1,geometry.vertices.length);//顶点1颜色——红色
        var color2 = findColor(index2,geometry.vertices.length);//顶点2颜色——绿色
        var color3 = findColor(index3,geometry.vertices.length);//顶点3颜色——蓝色



        face.vertexColors.push(color1, color2, color3);//定义三角面三个顶点的颜色
        geometry.faces.push(face);
    }

    // 重新着色
    // var shaderMaterial;
    // load shader
    // $.get('assets/shaders/my.vs', function(vShader){
    //     $.get('assets/shaders/my.fs', function(fShader){
    //         // console.log(vShader);// test success
    //         // console.log(fShader);// test success
    //         shaderMaterial = new THREE.ShaderMaterial({
    //             vertexShader: vShader,
    //             fragmentShader: fShader
    //         });
    //         // create sphere and add it to scene[这两步必须放到材质生成之后，jQuery中]
    //         sphere_3D_S = new THREE.Mesh(geometry,shaderMaterial);//网格模型对象
    //         scene_3D_S.add(sphere_3D_S); //网格模型添加到场景中
    //     });
    // });

    // random color material
    // var random_material=new THREE.MeshLambertMaterial({
    //     vertexColors: THREE.VertexColors,//以顶点颜色为准
    //     //vertexColors: geometry.colors,//以顶点颜色为准
    //     side: THREE.DoubleSide,//两面可见
    //     opacity: 1.0
    // });//材质对象

    var random_material=new THREE.MeshBasicMaterial({
        vertexColors: THREE.VertexColors,//以顶点颜色为准
        //vertexColors: geometry.colors,//以顶点颜色为准
        side: THREE.DoubleSide,//两面可见
        opacity: 1.0
    });//材质对象

    // create sphere and add it to scene
    sphere_3D_S = new THREE.Mesh(geometry,random_material);//网格模型对象

    // sphere_3D_S.position.set(sphere_pos_3D_S.x, sphere_pos_3D_S.y, sphere_pos_3D_S.z);
    // sphere_3D_S.scale.set( 22, 22, 22);
    scene_3D_S.add(sphere_3D_S); //网格模型添加到场景中


    // var testTriangle_geom = new THREE.Geometry();
    //
    // var tv0 = new THREE.Vector3(0,0,1);
    // var tv1 = new THREE.Vector3(0,0,1);
    // var tv2 = new THREE.Vector3(0,1,1);
    // testTriangle_geom.vertices.push(tv0,tv1,tv2);
    //
    // var tf = new THREE.Face3(0,1,2);
    // var c1 = new THREE.Color(0xFF0000);//顶点1颜色——红色
    // var c2 = new THREE.Color(0x00FF00);//顶点2颜色——绿色
    // var c3 = new THREE.Color(0x0000FF);//顶点3颜色——蓝色
    // tf.vertexColors.push(c1, c2, c3);//定义三角面三个顶点的颜色
    // testTriangle_geom.faces.push(tf);
    //
    // var random_material=new THREE.MeshLambertMaterial({
    //         vertexColors: THREE.VertexColors,//以顶点颜色为准
    //         //vertexColors: geometry.colors,//以顶点颜色为准
    //         side: THREE.DoubleSide,//两面可见
    //         opacity: 1.0
    //     });//材质对象
    // var testTriangle = new THREE.Mesh(testTriangle_geom,random_material);
    // testTriangle.scale.set(20,20,20);
    // scene_3D_S.add(testTriangle);
}

// 测试用：根据顶点索引是否能整除3产生固定颜色
function findColor(index,total) {
    var ratio = 1.0 * index / total;
    return new THREE.Color(0xFFFFFF * ratio);
}