var uuid = function() {
    return Math.floor(Math.random()*100000)
}

function debounce(func, wait, immediate) {
  var timeout;
  return function() {
    var context = this, args = arguments;
    var later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};

var Transition = {

  _transitions: [],

  _callbacks: [],

  _runCallbacks: function () {
    for(i = 0; i < Transition._callbacks.length; i++) {
      Transition._callbacks[i]();
    }
  },

  _createNewTransition: function (vizId, time, params) {
    var id = uuid();    
    return {
      id: id,
      visualization_id: vizId,
      time: time,
      params: params
    }
  },

  _addTransitionLocally: function(transition) {
    Transition._transitions.push(transition);
  },

  _addTransitionRemotely: function(vizId, transition){
    $.ajax({
      type: "POST",
      url: "/visualizations/"+vizId+"/transitions",
      dataType: 'json',
      data: {
        id: transition.id,
        time: transition.time,
        params: JSON.stringify(transition.params)
      },
      success: function(data) {
        console.log('Posted new transition');
        data.params = JSON.parse(data.params);
      },
      error: function(jqxhr, string) {
        alert('Error saving new transition');
        console.log(jqxhr);
        console.log(string);
      }  
    });
  },

  _fetchAllFromRemote: function(vizId) {
    $.ajax({
        type: "GET",
        url: "/visualizations/"+vizId+"/transitions",
        dataType: 'json',
        success: function(transitions) {
          Transition._storeAllLocally(vizId, transitions);
          visualizer.setParams(Transition._transitions[0].params);
          Transition._runCallbacks();
        }
    });
  },

  _deleteTransitionLocally: function (transition) {
    for (var i = 0; i < Transition._transitions.length; i++) {
      if (Transition._transitions[i] === transition) {
        if (Transition._transitions.length > 1) {
          Transition._transitions.splice(i,i);
          return;
        } else {
          Transition._transitions.splice(i,i+1);
          return;
        }
      }
    }
  },

  _deleteTransitionRemotely: function(vizId, transition) {
    $.ajax({
      type: "DELETE",
      url: "/visualizations/"+vizId+"/transitions/"+transition.id,
      dataType: 'json',
      data: {
        id: transition.id,
      },
      success: function() {
        console.log('Transition deleted');
      },
      error: function() {
        alert('error deleting transition');
      }  
    });
  },

  _deleteAllTransitionsLocally: function () {
    Transition._transitions.length = 0;
  },

  _deleteAllTransitionsRemotely: function(vizId) {
    $.ajax({
      type: "DELETE",
      url: "/visualizations/"+vizId+"/transitions",
      dataType: 'json',
      success: function() {
        console.log('All transitions deleted');
        Transition.addInitialRegionAndTransition(vizId);
      },
      error: function() {
        alert('error deleting all transitions');
      }  
    });
  },

  _updateTransitionLocally: function(transition) {
    Transition._transitions.push(transition);
    // Transition._runCallbacks();
  },

  _updateTransitionRemotely: function (vizId, transition) {
    $.ajax({
      type: "PUT",
      url: "/visualizations/"+vizId+"/transitions/"+transition.id,
      dataType: 'json',
      data: {
        id: transition.id,
        params: JSON.stringify(transition.params)
      },
      success: function() {
        console.log('Updated');
      },
      error: function() {
        alert('error saving updated transition');
      }  
    });
  },

  _storeAllLocally: function(vizId, transitions) {
    if (transitions.length > 0) {
      transitions.forEach(function(transition, index) {
        transition.params = JSON.parse(transition.params);
        Transition._transitions.push(transition);
      })
    } else {
      var time = 0;
      var params = visualizer.getParams();
      var new_transition = Transition._createNewTransition(vizId, time, params);
      Transition._addTransitionLocally(new_transition);
      Transition._addTransitionRemotely(vizId, new_transition);
    }
  },

  _debouncedUpdateTransitionRemotely: debounce(
    function (vizId, transition) {
      Transition._updateTransitionRemotely(vizId, transition);
    }, 1000),

  // Create a new transition locally and store in the db.
  createTransition: function(vizId, time, params) {
    var transition = Transition._createNewTransition(vizId, time, params);
    Transition._addTransitionLocally(transition);
    Transition._addTransitionRemotely(vizId, transition);
    return transition;
  },

  deleteTransition: function (vizId, transition) {
    Transition._deleteTransitionLocally(transition);
    Transition._deleteTransitionRemotely(vizId, transition);
  },

  updateOneRemotely: function(vizId, transition) {
    this._debouncedUpdateTransitionRemotely(vizId, transition)
  },

  fetchAll: function(vizId) {
    Transition._fetchAllFromRemote(vizId);
    return null;
  },

  getAll: function() {
    return Transition._transitions;
  },

  addTransition: function (vizId) {
    var time = musicInterface.getCurrentTime();
    var params = visualizer.getParams();
    var newTransition = Transition.createTransition(vizId, time, params);
    musicInterface.addRegion(newTransition);
  },

  addInitialRegionAndTransition: function (vizId) {
    var params = visualizer.getParams();
    var newTransition = Transition.createTransition(vizId, 0, params);
    musicInterface.addInitialRegion(newTransition);
  },

  removeTransition: function (vizId) {
    var activeRegion = musicInterface.getCurrentRegion();
    var activeTransition = Transition.findCurrentTransition(activeRegion);
    if (activeTransition) {
      Transition.deleteTransition(vizId, activeTransition);
      musicInterface.removeRegion(activeRegion);  
    } else {
      alert("There is no transition to delete here");
    }
  },

  removeAllTransitions: function (vizId) {
    musicInterface.removeAllRegions();
    Transition._deleteAllTransitionsLocally();
    Transition._deleteAllTransitionsRemotely(vizId);
  },

  updateTransition: function (vizId) {
    var activeTransition = Transition.findCurrentTransition(musicInterface.getCurrentRegion());
    var newParams = visualizer.getParams();
    activeTransition.params = newParams;
    Transition.updateOneRemotely(vizId, activeTransition);
  },

  findCurrentTransition: function (region) {
    var transitions = Transition.getAll();
    var current_transition;
    for (var i = 0; i < transitions.length; i++) {
      var transition = transitions[i];
      if (transition.id === region.id) {
        current_transition = transition;
        return transition;
      }
    }
    return current_transition;
  },

  setCurrentRegionAndTransition: function(vizId, region) {
    musicInterface.currentRegion = region;
    var transition = this.findCurrentTransition(region);
    visualizer.setParams(transition.params);
    return transition;
  },

  registerChangeCallback: function (fn) {
    Transition._callbacks.push(fn);
  }
}