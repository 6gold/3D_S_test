'use strict';

var object3D_S; // model imported
var boundingBox_3D_S;
var sphere_3D_S; // sphere around the model
var sphere_pos_3D_S;
var sphere_radius_3D_S;



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


//+
function RCS_s(t, f,r_d) {
    this.t = t;
    this.f = f;
    this.r_d = r_d;
}

var rcs_s=[];
var rcsLength_s;
$.get("http://localhost:3000/rcs1", function( data ) {
    var rows = data.split('\n')
    for (let row of rows) {
        const row1 = row.replace(/\s+/g, ' ')
        let rows = row1.split(' ')
        rcs_s.push(new RCS_s(rows[1], rows[2], rows[3]))
    }
    rcs_s.shift()
    rcsLength_s = rcs_s.length;
    console.log(rcs_s);
    console.log(rcsLength_s);
});

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
renderer_3D_S.setPixelRatio( window.devicePixelRatio );

// set controller
var controller_3D_S = new THREE.TrackballControls(camera_3DS, renderer_3D_S.domElement);
controller_3D_S.rotateSpeed = 2.5;
controller_3D_S.zoomSpeed = 1.0;
controller_3D_S.panSpeed = 0.6;

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

// set STL loader
var stlloader_3D_S=new THREE.STLLoader();
var callbackOnLoadSTL_3D_S = function (modelgeom) {

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
    sphere_pos_3D_S = new THREE.Vector3(
        (boundingBox_3D_S.max.x + boundingBox_3D_S.min.x) / 2,
        (boundingBox_3D_S.max.y + boundingBox_3D_S.min.y) / 2,
        (boundingBox_3D_S.max.z + boundingBox_3D_S.min.z) / 2
    );

    // create sphere
    var sphgeom_3D_S = new THREE.SphereGeometry(sphere_radius_3D_S, 100, 100);
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
    sphere_3D_S.position.set(0, 0, 0);
    // sphere_3D_S.rotation.set( - Math.PI / 2, 0, 0 );
    sphere_3D_S.scale.set( 22, 22, 22);
    // add sphere to the scene
    scene_3D_S.add(sphere_3D_S);
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