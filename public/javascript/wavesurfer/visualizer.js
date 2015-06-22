// 'use strict';

WaveSurfer.Visualizer = {
  
  init: function(container) {
    this.soundData = WaveSurfer.WebAudio.Data;
    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
    this.camera.position.z = 1000;


    var red = 240;
    var green = 50;
    var blue = 10;
    var myColor = new THREE.Color('rgb(' + red + ',' + green + ',' + blue + ')');
    this.geometry = new THREE.BoxGeometry( 200, 200, 200 );
    this.material = new THREE.MeshPhongMaterial( { color: myColor } );

    this.mesh = new THREE.Mesh( this.geometry, this.material );
    this.scene.add( this.mesh );

    this.hemiLight = new THREE.HemisphereLight(0xFFFFFF, 0x80CC99, 1.0);
    this.scene.add( this.hemiLight );

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize( window.innerWidth, window.innerHeight );

    container.append( this.renderer.domElement );

    $('#input-red').val(red);
    $('#input-green').val(green);
    $('#input-blue').val(blue);

  },
  animate: function(frame) {

    requestAnimationFrame(this.animate.bind(this));

    this.mesh.rotation.x += 0.01;
    this.mesh.rotation.y += 0.02;

    var scale = 1 + this.soundData.level;
    this.mesh.scale.x = scale;
    this.mesh.scale.y = scale;
    this.mesh.scale.z = scale;

    this.soundData.update();
    this.renderer.render(this.scene, this.camera);
  },

  getParameters: function() {
    //This function will need continuous updating :(
    var paramArr;

  }
}


