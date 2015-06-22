var startMusicInterface = function() {

  // Creates waveform instance
  var musicInterface = Object.create(MusicInterface);

  // Initializes with above options
  musicInterface.init();

  // Loads music
  // musicInterface.loadSong('./music/Lenno-Lost.mp3');

  // Initializes timeline plugin and plays once ready
  musicInterface.on('ready', function () {
    // musicInterface.play();
    musicInterface.animateVisualizer();
    var timeline = Object.create(WaveSurfer.Timeline);

    timeline.init({
      WaveSurfer: musicInterface.waveSurfer,
      container: "#wave-timeline"
    });
    
  });

  // Console logs errors
  musicInterface.on('error', function (err) {
    console.log(err);
  });

  musicInterface.on('finish', function () {
    console.log('Finished playing');
  })

  // Set global actions of buttons
  var GLOBAL_ACTIONS = {
    'play': function () {
      musicInterface.playPause();
    },
    
    'backward': function () {
      musicInterface.skipBackward();
    },

    'forward': function () {
      musicInterface.skipForward();
    },

    'toggle-mute': function () {
      musicInterface.toggleMute();
    },
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

  //TODO Get drag and drop working again (and as React events)
  // // Drag and Drop for files
  // var toggleActive = function (e, toggle) {
  //     e.stopPropagation();
  //     e.preventDefault();
  //     toggle ? e.target.classList.add('musicInterface-dragover') :
  //         e.target.classList.remove('musicInterface-dragover');
  // };

  // var handlers = {
  //     // Drop event
  //     drop: function (e) {
  //         toggleActive(e, false);

  //         // Load the file into musicInterface
  //         if (e.dataTransfer.files.length) {
  //             musicInterface.loadBlob(e.dataTransfer.files[0]);
  //         } else {
  //             musicInterface.fireEvent('error', 'Not a file');
  //         }
  //     },

  //     // Drag-over event
  //     dragover: function (e) {
  //         toggleActive(e, true);
  //     },

  //     // Drag-leave event
  //     dragleave: function (e) {
  //         toggleActive(e, false);
  //     }
  // };

  // var dropTarget = document.querySelector('#drop');
  
  // Object.keys(handlers).forEach(function (event) {
  //     dropTarget.addEventListener(event, handlers[event]);
  // });

  return musicInterface;

};
