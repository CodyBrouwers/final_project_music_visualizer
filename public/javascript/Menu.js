var Menu = function() {

  var width = 240;

  var effectCallback, micCallback, trackCallback;

  var menu = document.querySelector(".menu");
  var btn = document.querySelector(".menu-button");
  var close = document.querySelector(".menu .close");
  var effects = document.querySelectorAll(".colors li");

  var mic = document.querySelector(".mic");
  var track = document.querySelector(".track");

  var translateX = function(e, v) {
    e.style.webkitTransform = 'translateX(' + v + 'px)';
    e.style.msTransform = 'translateX(' + v + 'px)';
    e.style.MozTransform = 'translateX(' + v + 'px)';
    e.style.transform = 'translateX(' + v + 'px)';
  }

  //KEEP THIS IF YOU START OVER
  $('.color').on('blur', 'li', function(event) {
    var red = $('#input-red').val() + ", ";
    var green = $('#input-green').val() + ", ";
    var blue = $('#input-blue').val();
    color = new THREE.Color('rgb(' + red + green + blue + ')');
    mesh.material.color = color;
  });

  $('.shape').on('click', 'input', function(event) {
    var value = $(this).val();
    if (value === 'sphere') {
      mesh.geometry = new THREE.SphereGeometry( 200, 30, 30 );
    }
    else {
      mesh.geometry = new THREE.BoxGeometry( 200, 200, 200 );
    }
  });
  //-----------
  //
  btn.addEventListener('click', function() {
    btn.style.opacity = 0;
    menu.style.opacity = 1;
    translateX(menu, 0);

    setTimeout(function() {
      btn.style.display = 'none';
    }, 200);
  });

  close.addEventListener('click', function() {
    btn.style.display = 'block';

    setTimeout(function() {
      btn.style.opacity = 1;
    }, 1);

    menu.style.opacity = 0;
    translateX(menu, -30);
  });

  // mic.addEventListener('click', function() {
  //   mic.setAttribute('class', 'selected');
  //   track.setAttribute('class', '');
  //   if(micCallback) micCallback();
  // });

  track.addEventListener('click', function() {
    mic.setAttribute('class', '');
    track.setAttribute('class', 'selected');
    if(trackCallback) trackCallback();
  });

  var m = {};

  m.onEffect = function(callback) {
    effectCallback = callback;
  }

  m.onMic = function(callback) {  
    micCallback = callback;
    
  }

  m.onTrack = function(callback) {
    trackCallback = callback;
  }

  track.setAttribute('class', 'selected');
  btn.style.opacity = 0;
  btn.style.display = 'none';

  return m;

};










