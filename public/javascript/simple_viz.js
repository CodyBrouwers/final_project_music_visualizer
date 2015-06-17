var scene, camera, renderer;
var geometry, material, mesh;

init();
var animate = animateSound(sound);
animate();

function init() {

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
  camera.position.z = 1000;

  geometry = new THREE.BoxGeometry( 200, 200, 200 );
  material = new THREE.MeshPhongMaterial( { color: 0xff0000 } );

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

  container = document.createElement( 'div' );
  document.body.appendChild( container );
  container.appendChild( renderer.domElement );
  // $('webgl-container').append( renderer.domElement );

}

function animateSound(soundAnalyzer) {
  return function animate(frame) {

    requestAnimationFrame( animate );

    mesh.rotation.x += 0.01;
    mesh.rotation.y += 0.02;

    // var phase = frame / 360 * Math.PI;
    // var scale = 2 + 0.5* Math.sin(phase);
    // console.log(soundAnalyzer.level)
    var scale = 1 + 2* soundAnalyzer.level;
    mesh.scale.x = scale;
    mesh.scale.y = scale;
    mesh.scale.z = scale;

    renderer.render( scene, camera );
  }
}
