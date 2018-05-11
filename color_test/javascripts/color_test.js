'use strict';

var canvas_3D_S;
var scene_3D_S;
var axisHelper_3D_S;
var camera_3DS;
var ambientLight_3D_S;
var directionalLight1_3D_S;
var directionalLight2_3D_S;
var renderer_3D_S;
var controller_3D_S;

// -----------------------------call functions---------------------------------------
initWebGL();
createMesh();
render_3D_S();

// ---------------------------definition of functions--------------------------------
/* method: initWebGL
   args: none
   function: initialize webGL */
function initWebGL() {
    // get canvas
    canvas_3D_S = document.getElementById('canvas_3D_S');

    // set scene
    scene_3D_S = new THREE.Scene();

    // set Axis
    axisHelper_3D_S = new THREE.AxisHelper( 150 );
    scene_3D_S.add( axisHelper_3D_S );

    // set camera
    camera_3DS = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.1, 10000);
    camera_3DS.position.x = 0;
    camera_3DS.position.y = 175;
    camera_3DS.position.z = 500;
    camera_3DS.lookAt(new THREE.Vector3(0, 0, 0));
    scene_3D_S.add(camera_3DS);

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
        canvas:canvas_3D_S,
        antialias:true,
    });
    renderer_3D_S.setClearColor(0xeeeeee);
    renderer_3D_S.setSize( window.innerWidth, window.innerHeight );
    // renderer_3D_S.setPixelRatio( window.devicePixelRatio );

    // set controller
    controller_3D_S = new THREE.TrackballControls(camera_3DS, renderer_3D_S.domElement);
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
    controller_3D_S.update();
    renderer_3D_S.render(scene_3D_S,camera_3DS);
}

/* method: createMesh
   args: none
   function: draw a mesh */
function createMesh() {

    var mesh_geom = new THREE.Geometry();
    // 四个顶点
    var tv0 = new THREE.Vector3(0,0,-100);
    var tv1 = new THREE.Vector3(100,0,0);
    var tv2 = new THREE.Vector3(0,0,100);
    var tv3 = new THREE.Vector3(0,100,0);
    mesh_geom.vertices.push(tv0,tv1,tv2,tv3);
    // 四个面片
    var tf0 = new THREE.Face3(0,1,2);
    var tf1 = new THREE.Face3(2,3,0);
    var tf2 = new THREE.Face3(3,1,0);
    var tf3 = new THREE.Face3(2,1,3);
    mesh_geom.faces.push(tf0,tf1,tf2,tf3);

    // ShaderMaterial测试
    var shaderMaterial_test; // 定义ShaderMaterial
    var attributes = {
        random_r: {
            type: 'f', // a float
            value: [] // an empty array
        },
        random_g: {
            type: 'f', // a float
            value: [] // an empty array
        },
        random_b:{
            type: 'f', // a float
            value: [] // an empty array
        }
    }; // 定义attributes，可传递到ShaderMaterial中
    // 向attributes中添加数据（本case存放随机的rgb数值）
    var verts = mesh_geom.vertices;
    var values_r = attributes.random_r.value;
    var values_g = attributes.random_g.value;
    var values_b = attributes.random_b.value;
    for (var v = 0; v < verts.length; v++) {
        values_r.push(Math.random());
        values_g.push(Math.random());
        values_b.push(Math.random());
    }
    // 调试
    console.log(values_r);
    console.log(values_g);
    console.log(values_b);

    // 加载顶点着色器和片元着色器
    $.get('./assets/shaders/my.vs', function(vShader){
        $.get('./assets/shaders/my.fs', function(fShader){
            // console.log(vShader); // test success!
            // console.log(fShader); // test success!
            shaderMaterial_test = new THREE.ShaderMaterial({
                vertexShader: vShader,
                fragmentShader: fShader,
                attributes: attributes //传递attributes
            });
            // create triangle and add it to scene[这两步必须放到材质生成之后，jQuery中]
            var mesh = new THREE.Mesh(mesh_geom, shaderMaterial_test);//网格模型对象
            scene_3D_S.add(mesh); //模型添加到场景中
        });
    });
}