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

  _createNewTransition: function (viz_id, time, params) {
    var id = uuid();    
    return {
      id: id,
      visualization_id: viz_id,
      time: time,
      params: params
    }
  },

  _addTransitionLocally: function(transition) {
    Transition._transitions.push(transition);
  },

  _addTransitionRemotely: function(viz_id, transition){
    $.ajax({
      type: "POST",
      url: "/visualizations/"+viz_id+"/transitions",
      dataType: 'json',
      data: {
        id: transition.id,
        time: transition.time,
        params: JSON.stringify(transition.params)
      },
      success: function(data) {
        console.log('Posted new transition');
        console.log("List of transitions: ", Transition._transitions);
        data.params = JSON.parse(data.params);
      },
      error: function(jqxhr, string) {
        alert('Error saving new transition');
        console.log(jqxhr);
        console.log(string);
      }  
    });
  },

  _fetchAllFromRemote: function(viz_id) {
    $.ajax({
        type: "GET",
        url: "/visualizations/"+viz_id+"/transitions",
        dataType: 'json',
        success: function(transitions) {
          Transition._storeAllLocally(viz_id, transitions);
          visualizer.setParams(Transition._transitions[0].params);
          musicInterface.setTransitions(Transition._transitions);
          Transition._runCallbacks();
        }
    });
  },

  _storeAllLocally: function(viz_id, transitions) {
    if (transitions.length !== 0) {
      transitions.forEach(function(transition, index) {
        transition.params = JSON.parse(transition.params);
        Transition._transitions.push(transition);
      })
    } else {
      var time = 0;
      var params = visualizer.getParams();
      var new_transition = Transition._createNewTransition(viz_id, time, params);
      Transition._addTransitionLocally(new_transition);
      Transition._addTransitionRemotely(viz_id, new_transition);
    }
  },

  _updateTransitionLocally: function(transition) {
    Transition._transitions.push(transition);
    // Transition._runCallbacks();
  },

  _updateTransitionRemotely: function (viz, transition) {
    $.ajax({
      type: "PUT",
      url: "/visualizations/"+viz.id+"/transitions",
      dataType: 'json',
      data: {
        id: transition.id,
        params: transition.params
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
  createOne: function(viz_id, time, params) {
    var transition = Transition._createNewTransition(viz_id, time, params);
    Transition._addTransitionLocally(transition);
    Transition._addTransitionRemotely(viz_id, transition);
    return transition;
  },

  updateOne: function(transition) {
    Transition._updateTransitionLocally(transition);
    Transition._updateTransitionRemotely(transition);
  },

  fetchAll: function(viz_id, callback) {
    Transition._fetchAllFromRemote(viz_id);
    return null;
  },

  getAll: function() {
    return Transition._transitions;
  },

  registerChangeCallback: function(fn) {
    Transition._callbacks.push(fn);
  }
}