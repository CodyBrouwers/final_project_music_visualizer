
var VIZ = VIZ || {};

var scene, camera, renderer;
var geometry, material, mesh;


VIZ.Simple = function(container, sound) {

  // $(function() {
  //   var animate = animateSound(sound);
  // })
  init();
  animate();

  function init() {

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.z = 1000;


    var red = 240;
    var green = 50;
    var blue = 10;
    myColor = new THREE.Color('rgb(' + red + ',' + green + ',' + blue + ')');
    geometry = new THREE.BoxGeometry( 200, 200, 200 );
    material = new THREE.MeshPhongMaterial( { color: myColor } );

    mesh = new THREE.Mesh( geometry, material );
    scene.add( mesh );

    // create a point light
    var pointLight = new THREE.PointLight( 0xFFFFFF );

    // set its position
    pointLight.position.x = 10;
    pointLight.position.y = 150;
    pointLight.position.z = 130;

    // add to the scene
    // scene.add(pointLight);

    // var light = new THREE.AmbientLight( 0x404040 ); // soft white light
    var light = new THREE.HemisphereLight(0xFFFFFF, 0x80CC99, 1.0);
    scene.add( light );

    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );

    container.append( renderer.domElement );

    // TODO: Call menu to add event listeners and all that.

  }

  function animate(frame) {
    
    requestAnimationFrame(animate);

    mesh.rotation.x += 0.01;
    mesh.rotation.y += 0.02;

    var scale = 1 + 2* sound.level;
    mesh.scale.x = scale;
    mesh.scale.y = scale;
    mesh.scale.z = scale;

    renderer.render(scene, camera)
  }

}

// VIZ.SetParameters = function(params) {  
//   $('#input-red').val(params.red);
//   $('#input-green').val(params.green);
//   $('#input-blue').val(params.blue);
// }