var Waveform = function() {

  // Creates waveform instance
  var wavesurfer = Object.create(WaveSurfer);

  // Waveform options
  var options = {
    container: document.querySelector("#wave"),
    waveColor: 'violet',
    progressColor: 'purple',
    cursorColor: 'navy',
    scrollParent: false,
    audioContext: new window.AudioContext()
  };

  // Initializes with above options
  wavesurfer.init(options);

  // Loads music
  // wavesurfer.load();

  // Initializes timeline plugin and plays once ready
  wavesurfer.on('ready', function () {
    // wavesurfer.play();
    wavesurfer.Visualizer.animate();
    var timeline = Object.create(WaveSurfer.Timeline);

    timeline.init({
      wavesurfer: wavesurfer,
      container: "#wave-timeline"
    });
    
  });

  // Console logs errors
  wavesurfer.on('error', function (err) {
    console.log(err);
  });

  wavesurfer.on('finish', function () {
    console.log('Finished playing');
  })

  // Set global actions of buttons
  var GLOBAL_ACTIONS = {
    'play': function () {
      wavesurfer.playPause();
    },
    
    'backward': function () {
      wavesurfer.skipBackward();
    },

    'forward': function () {
      wavesurfer.skipForward();
    },

    'toggle-mute': function () {
      wavesurfer.toggleMute();
    },

    'add-transition': function () {
      
    }

  };

  // Bind actions to buttons and keypresses
  document.addEventListener('keydown', function (e) {
    var map = {
        32: 'play',       // space
        37: 'backward',  // left
        39: 'forward'    // right
    };
    var action = map[e.keyCode];
    if (action in GLOBAL_ACTIONS) {
        if (document == e.target || document.body == e.target) {
            e.preventDefault();
        }
        GLOBAL_ACTIONS[action](e);
    }
  });

  [].forEach.call(document.querySelectorAll('[data-action]'), function (el) {
    el.addEventListener('click', function (e) {
        var action = e.currentTarget.dataset.action;
        if (action in GLOBAL_ACTIONS) {
            e.preventDefault();
            GLOBAL_ACTIONS[action](e);
        }
    });
  });

  // Drag and Drop for files
  var toggleActive = function (e, toggle) {
      e.stopPropagation();
      e.preventDefault();
      toggle ? e.target.classList.add('wavesurfer-dragover') :
          e.target.classList.remove('wavesurfer-dragover');
  };

  var handlers = {
      // Drop event
      drop: function (e) {
          toggleActive(e, false);

          // Load the file into wavesurfer
          if (e.dataTransfer.files.length) {
              wavesurfer.loadBlob(e.dataTransfer.files[0]);
          } else {
              wavesurfer.fireEvent('error', 'Not a file');
          }
      },

      // Drag-over event
      dragover: function (e) {
          toggleActive(e, true);
      },

      // Drag-leave event
      dragleave: function (e) {
          toggleActive(e, false);
      }
  };

  var dropTarget = document.querySelector('#drop');
  
  Object.keys(handlers).forEach(function (event) {
      dropTarget.addEventListener(event, handlers[event]);
  });

  return wavesurfer;

};
