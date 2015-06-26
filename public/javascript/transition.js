var uuid = function() {
    return Math.floor(Math.random()*100000)
}

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
          musicInterface.setRegion(Transition._transitions);
          Transition._runCallbacks();
        }
    });
  },

  _storeAllLocally: function(vizId, transitions) {
    if (transitions.length !== 0) {
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

  // Create a new transition locally and store
  // it in the db.
  createOne: function(vizId, time, params) {
    var transition = Transition._createNewTransition(vizId, time, params);
    Transition._addTransitionLocally(transition);
    Transition._addTransitionRemotely(vizId, transition);
    return transition;
  },

  updateOneRemotely: function(vizId, transition) {
    Transition._updateTransitionRemotely(vizId, transition);
  },

  fetchAll: function(vizId, callback) {
    Transition._fetchAllFromRemote(vizId);
    return null;
  },

  getAll: function() {
    return Transition._transitions;
  },

  registerChangeCallback: function(fn) {
    Transition._callbacks.push(fn);
  },

  addTransition: function(vizId) {
    var time = musicInterface.getCurrentTime();
    var params = visualizer.getParams();
    var new_transition = Transition.createOne(vizId, time, params);
    musicInterface.addRegion(new_transition); 
  },

  updateTransition: function(vizId){
    console.log(vizId);
    var activeTransition = Transition.findCurrentTransition(musicInterface.currentRegion);
    var newParams = visualizer.getParams();
    activeTransition.params = newParams;
    Transition.updateOneRemotely(vizId, activeTransition);
  },

  findCurrentTransition: function(region){
    var transitions = Transition.getAll();
    for (var i = 0; i < transitions.length; i++) {
      var transition = transitions[i];
      if (transition.id === region.id) {
        return transition;
      }
    }
  },

  setCurrentTransition: function(transition){
    visualizer.setParams(transition.params);
  },

  setCurrentRegionAndTransition: function(vizId, region) {
    musicInterface.currentRegion = region;
    var transition = this.findCurrentTransition(region);
    this.setCurrentTransition(transition);
    return transition;
  },
}