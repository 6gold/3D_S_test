'use strict';

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
createTriangle();
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

/* method: createTriangle
   args: none
   function: draw a triangle */
function createTriangle() {

    var testTriangle_geom = new THREE.Geometry();

    var tv0 = new THREE.Vector3(0,0,-100);
    var tv1 = new THREE.Vector3(100,0,0);
    var tv2 = new THREE.Vector3(0,0,100);
    var tv3 = new THREE.Vector3(0,100,0);
    testTriangle_geom.vertices.push(tv0,tv1,tv2,tv3);

    var tf0 = new THREE.Face3(0,1,2);
    var tf1 = new THREE.Face3(2,3,0);
    var tf2 = new THREE.Face3(3,1,0);
    var tf3 = new THREE.Face3(2,1,3);

    var c1 = new THREE.Color(0xFF0000);//顶点1颜色——红色
    var c2 = new THREE.Color(0x00FF00);//顶点2颜色——绿色
    var c3 = new THREE.Color(0x0000FF);//顶点3颜色——蓝色

    // 设置各个顶点颜色
    testTriangle_geom.colors.push(c1,c2,c3,c1);

    // tf0.vertexColors.push(c1, c2, c3);//定义三角面三个顶点的颜色
    // tf1.vertexColors.push(c1, c2, c3);//定义三角面三个顶点的颜色
    // tf2.vertexColors.push(c1, c2, c3);//定义三角面三个顶点的颜色
    // tf3.vertexColors.push(c1, c2, c3);//定义三角面三个顶点的颜色

    testTriangle_geom.faces.push(tf0,tf1,tf2,tf3);

    var random_material=new THREE.MeshLambertMaterial({
        vertexColors: THREE.VertexColors,//以顶点颜色为准
        side: THREE.DoubleSide,//两面可见
        opacity: 1.0
    });//材质对象

    // var testTriangle = new THREE.Mesh(testTriangle_geom,random_material);
    // scene_3D_S.add(testTriangle);


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
    var verts = testTriangle_geom.vertices;
    var color_r = attributes.color_r.value;
    var color_g = attributes.color_g.value;
    var color_b = attributes.color_b.value;
    for (var v = 0; v < verts.length; v++) {
        color_r.push(Math.random());
        color_g.push(Math.random());
        color_b.push(Math.random());
    }
    console.log(color_r);

    var shaderMaterial_test;
    // // load shader
    $.get('http://localhost:3000/../shaders/my.vs', function(vShader){
        $.get('http://localhost:3000/../shaders/my.fs', function(fShader){
            // console.log(vShader); // test success
            // console.log(fShader); // test success
            shaderMaterial_test = new THREE.ShaderMaterial({
                vertexShader: vShader,
                fragmentShader: fShader,
                attributes: attributes
            });
            // create triangle and add it to scene[这两步必须放到材质生成之后，jQuery中]
            var triangle_test = new THREE.Mesh(testTriangle_geom, shaderMaterial_test);//网格模型对象
            scene_3D_S.add(triangle_test); //模型添加到场景中
        });
    });
}