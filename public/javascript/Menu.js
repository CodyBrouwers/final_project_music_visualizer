var Menu = function() {

  var menu = document.querySelector(".menu");
  var showbtn = document.querySelector(".menu-button");
  var hidebtn = document.querySelector(".close");
  

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

  showbtn.addEventListener('click', function() {
    menu.style.opacity = 1;
    hidebtn.style.display = 'block';
    showbtn.style.display = 'none';  
  });

  hidebtn.addEventListener('click', function() {
    showbtn.style.opacity = 1;
    menu.style.opacity = 0;
    showbtn.style.display = 'block';
    hidebtn.style.display = 'none';
    
  });

};










