'use strict';

var object3D_S; // model imported
var boundingBox_3D_S;
var sphere_3D_S; // sphere around the model
var sphere_pos_3D_S;
var sphere_radius_3D_S;
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
    drawBoundingBox_S();
};
stlloader_3D_S.load('http://localhost:3000/../models/f117.stl',callbackOnLoadSTL_3D_S);

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
    // object3D_S.scale.set( 0.2, 0.2, 0.2);
    // add mesh to the scene
    scene_3D_S.add(object3D_S);

    // set Axis
    var sqrt_3D_S = Math.sqrt(
        (boundingBox_3D_S.max.x - boundingBox_3D_S.min.x) * (boundingBox_3D_S.max.x - boundingBox_3D_S.min.x) +
        (boundingBox_3D_S.max.y - boundingBox_3D_S.min.y) * (boundingBox_3D_S.max.y - boundingBox_3D_S.min.y) +
        (boundingBox_3D_S.max.z - boundingBox_3D_S.min.z) * (boundingBox_3D_S.max.z - boundingBox_3D_S.min.z)
    );
    var axis_radius_3D_S = Math.ceil(sqrt_3D_S) / 2;
    axisHelper_3D_S = new THREE.AxisHelper( 2 * axis_radius_3D_S );
    // scene_3D_S.add( axisHelper_3D_S );
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
    var sphgeom_3D_S = new THREE.SphereGeometry(1.1 * sphere_radius_3D_S, 30, 30);
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
    console.log(v8);
    console.log(sphere_3D_S.position);
    sphere_3D_S.rotation.set( - Math.PI / 2, 0, 0 );
    // add sphere to the scene
    scene_3D_S.add(sphere_3D_S);
}











// create rcs data
// function RCS_s(t, f,r_d) {
//     this.t = t;
//     this.f = f;
//     this.r_d = r_d;
// }
function readRCS() {
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
}