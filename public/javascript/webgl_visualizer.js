WebGLVisualizer = {

  //Need to have access to visualizer and it's parameters
  init: function() {

    this.scene = new THREE.Scene();
    
    this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
    this.camera.position.z = 1000;

    var red = 240;
    var green = 50;
    var blue = 10;
    this.color = 'rgb(' + red + ',' + green + ',' + blue + ')'
    var myColor = new THREE.Color(this.color);
    var geometry = new THREE.BoxGeometry( 200, 200, 200 );
    this.material = new THREE.MeshPhongMaterial( { color: myColor } );

    this.mesh = new THREE.Mesh( geometry, this.material );
    this.scene.add( this.mesh );
    this.geometry = this.mesh.geometry;

    this.hemiLight = new THREE.HemisphereLight(0xFFFFFF, 0x80CC99, 1.0);
    this.scene.add( this.hemiLight );

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize( window.innerWidth, window.innerHeight );

    this.visualizerType = 1;

    //TODO: remove this shiiit (don't use jQuery)
    // $('#input-red').val(red);
    // $('#input-green').val(green);
    // $('#input-blue').val(blue);

  },

  animate: function(frame) {

    requestAnimationFrame(this.animate.bind(this));

    this.mesh.rotation.x += 0.01;
    this.mesh.rotation.y += 0.02;

    var scale = 1 + musicInterface.level;
    this.mesh.scale.x = scale;
    this.mesh.scale.y = scale;
    this.mesh.scale.z = scale;

    musicInterface.updateData();
    this.renderer.render(this.scene, this.camera);
  },

  setParams: function(params) {
    //params is supposed to be an array of hashes following
    //the format of {type:..., value:...} that we can iterate
    //through and set parameters automatically.
    params.forEach(function(param, index) {
      var type = param['type'];
      var value = param['value'];
      
      switch (type) {
        case 'color':
          this.setColor(value);
          break;
        case 'geometry':
          this.setGeometry(value);
          break;
      }
    }, this);
  },

  getParams: function() {
    var params = [];
    paramsList = this.getParamsList(this.visualizerType);
    paramsList.forEach(function(paramType, index) {
      params[index] = this.getParam(paramType);
    }, this);
    return params;
  },

  getParamsList: function(visualizerType) {
    //Might make this a multicase chained operation?
    var paramList = [];
    switch (visualizerType) {
      case 1: //Basic Visualizer Case
        paramList = paramList.concat(['color', 'geometry']);
        break;
    }
    return paramList;
  },

  getParam: function(type) {
    switch (type) {
      case 'color':
        return this.getColor();
      case 'geometry':
        return this.mesh.geometry;
    }
  },

  getColor: function() {
    color = this.mesh.material.color;
    red = Math.floor(255 * color.r);
    green = Math.floor(255 * color.g);
    blue = Math.floor(255 * color.b);
    return 'rgb('+red+','+green+','+blue+')'
  },

  setColor: function(color) {
    this.mesh.material.color = new THREE.Color(color);
  },

  setGeometry: function(shape) {
    console.log(shape)
    if (shape === 'SphereGeometry') {
      this.mesh.geometry = new THREE[shape]( 200, 30, 30 );
    }
    else {
      this.mesh.geometry = new THREE[shape]( 200, 200, 200 );
    }
  }
}