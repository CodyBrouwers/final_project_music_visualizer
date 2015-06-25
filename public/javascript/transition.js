var Transition = {

  _transitions = {},

  _callbacks = [],

  _runCallbacks: function () {
    for(i = 0; i < Transition._callbacks.length; i++) {
      Transition._callbacks[i]();
    }
  },

  _createNewTransition: function () {
    var id = uuid();    
    return {
      // 
    }
  },

  _addTransitionLocally: function(transition) {
    Transition._transitions[transition.id] = transition;
    Transition._runCallbacks();
  },

  _addTransitionRemotely: function(viz, transition){
    $.ajax({
      type: "POST",
      url: "/visualizations/"+viz.id+"/transitions",
      dataType: 'json',
      data: {
        // id: trans.id,
        // path: viz.path,
        // name: viz.name
      },
      success: function(data) {
        console.log('Posted new transition: ', data);
      },
      error: function(jqxhr, string) {
        alert('Error saving new transition');
        console.log(jqxhr);
        console.log(string);
      }  
    });
  },

  _fetchAllFromRemote: function(viz) {
    $.ajax({
        type: "GET",
        url: "/visualizations/"+viz.id+"/transitions",
        dataType: 'json',
        success: function(transitions) {
          Transition._storeAllLocally(transitions);
          Transition._runCallbacks();
        }
    });
  },

  _storeAllLocally: function(transitions) {
    transitions.map(function(transition){
      Transition._transitions[transition.id] = transition;
    })
  },

  _updateTransitionLocally: function(transition) {
    Transition._transitions[transition.id] = transition;
    Transition._runCallbacks();
  },

  _updateTransitionRemotely: function (viz, transition) {
    $.ajax({
      type: "PUT",
      url: "/visualizations/"+viz.id+"/transitions",
      dataType: 'json',
      data: transition,
      success: function() {
        console.log('Updated');
      },
      error: function() {
        alert('error saving updated transition');
      }  
  });
  },

  //Create a new visualization locally and store
  // Visualization new visualization in the db.
  createOne: function(){
    var transition = Transition._createNewTransition();
    Transition._addTransitionLocally(transition);
    Transition._addTransitionRemotely(transition);
    return transition;
  },

  updateOne: function(transition) {
    Transition._updateTransitionLocally(transition);
    Transition._updateTransitionRemotely(transition);
  },

  fetchAll: function() {
    var transitions = Transition._fetchAllFromRemote();
    return null;
  },

  getAll: function() {
    return Transition._transitions;
  },

  registerChangeCallback: function(fn) {
    Transition._callbacks.push(fn);
  }
}