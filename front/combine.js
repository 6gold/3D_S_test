'use strict';

var object3D_S; // model imported
var boundingBox_3D_S;
var sphere_3D_S; // sphere around the model
var sphere_radius_3D_S;
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
renderer_3D_S.shadowMapEnabled = true;

// set controller
var controller_3D_S = new THREE.TrackballControls(camera_3DS, renderer_3D_S.domElement);
controller_3D_S.rotateSpeed = 2.5;
controller_3D_S.zoomSpeed = 1.0;
controller_3D_S.panSpeed = 0.6;

// set STL loader
var stlloader_3D_S=new THREE.STLLoader();
var callbackOnLoadSTL_3D_S = function (modelgeom) {

    // ---------------------------create model-----------------------------------
    var modelmat_3D_S = new THREE.MeshBasicMaterial(
        {
            transparency: true,
            opacity: 1,
            wireframeLinewidth: 0.5,
            color: 0x222222
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
    object3D_S.scale.set( 20, 20, 20);
    // add mesh to the scene
    scene_3D_S.add(object3D_S);

    // ------------------------------draw sphere---------------------------------
    // create radius and position
    var sqrt_3D_S = Math.sqrt(
        (boundingBox_3D_S.max.x - boundingBox_3D_S.min.x) * (boundingBox_3D_S.max.x - boundingBox_3D_S.min.x) +
        (boundingBox_3D_S.max.y - boundingBox_3D_S.min.y) * (boundingBox_3D_S.max.y - boundingBox_3D_S.min.y) +
        (boundingBox_3D_S.max.z - boundingBox_3D_S.min.z) * (boundingBox_3D_S.max.z - boundingBox_3D_S.min.z)
    );
    sphere_radius_3D_S = Math.ceil(sqrt_3D_S) / 2;

    // create sphere
    var sphgeom = new THREE.Geometry(); // define a blank geometry

    sphere_wSegs_3D_S = 180; // test value 纬带数(纬线数+1)
    sphere_hSegs_3D_S = 180; // test value 经带数

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
            sphgeom.vertices.push(p);
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
        var color1 = new THREE.Color(0xFF0000);//顶点1颜色——红色
        var color2 = new THREE.Color(0x00FF00);//顶点2颜色——绿色
        var color3 = new THREE.Color(0x0000FF);//顶点3颜色——蓝色
        face.vertexColors.push(color1, color2,color3);//定义三角面三个顶点的颜色
        sphgeom.faces.push(face);
    }

    // random color material
    var sphmat=new THREE.MeshLambertMaterial({
        vertexColors: THREE.VertexColors,//以顶点颜色为准
        side: THREE.DoubleSide,//两面可见
        transparent: true,
        opacity: 1.0
    });//材质对象

    var sphmat2 = new THREE.MeshBasicMaterial(
        { color: THREE.VertexColors, blending: THREE.AdditiveBlending }
    );

    // create sphere and add it to scene
    sphere_3D_S = new THREE.Mesh(sphgeom, sphmat);//网格模型对象
    sphere_3D_S.position.set(0, 0, 0);
    sphere_3D_S.scale.set( 22, 22, 22);
    scene_3D_S.add(sphere_3D_S); //网格模型添加到场景中
};
stlloader_3D_S.load('http://localhost:3000/../models/test.stl',callbackOnLoadSTL_3D_S);

// -----------------------------call functions---------------------------------------
render_3D_S();

// ---------------------------definition of functions--------------------------------
/* method: render_3D_S
   args: none
   function: render */
function render_3D_S() {
    requestAnimationFrame(render_3D_S);
    if (!renderer_3D_S.autoClear) renderer_3D_S.clear();

    // update values
    // console.log(camera_3D_S.rotation.x);
    // document.getElementById("center_X_3D_S").innerHTML = camera_3D_S.position.x;

    controller_3D_S.update();
    renderer_3D_S.render(scene_3D_S,camera_3DS);
}