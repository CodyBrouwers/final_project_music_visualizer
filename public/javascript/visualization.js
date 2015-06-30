var uuid = function() {
    return Math.floor(Math.random()*100000)
}

var Visualization = {

  _visualizations: {},
  
  _callbacks: [],

  _runCallbacks: function () {
    for(i = 0; i < Visualization._callbacks.length; i++) {
      Visualization._callbacks[i]();
    }
  },

  _createNewViz: function(){
    var id = uuid();
    return { id: id,
             path: null,
             name: "Song: "+id
    }
  },

  _addVizLocally: function(viz) {
    Visualization._visualizations[viz.id] = viz;
    // Visualization._runCallbacks();
  },

  _addVizRemotely: function(viz){
    $.ajax({
      type: "POST",
      url: "/visualizations",
      dataType: 'json',
      data: {
        id: viz.id,
        path: viz.path,
        name: viz.name
      },
      success: function(data) {
        console.log('Posted new visualization');
      },
      error: function(jqxhr, string) {
        alert('Error saving new visualization');
      }  
    });
  },

  _fetchAllFromRemote: function() {
    $.ajax({
        type: "GET",
        url: "/visualizations",
        dataType: 'json',
        success: function(vizs) {
          Visualization._storeAllLocally(vizs);
          Visualization._runCallbacks();
        }
    });
  },

  _storeAllLocally: function(vizs) {
    vizs.map(function(viz){
      Visualization._visualizations[viz.id] = viz;
    })
  },

  _updateVizLocally: function(viz) {
    Visualization._visualizations[viz.id] = viz;
    Visualization._runCallbacks();
  },

  _updateVizRemotely: function (viz) {
    console.log(viz.path);
    $.ajax({
      type: "PUT",
      url: "/visualizations/"+viz.id+"/edit",
      dataType: 'json',
      data: {
        id: viz.id,
        path: viz.path,
        name: viz.name
      },
      success: function(data) {
        console.log(data);
        console.log('Updated');
      },
      error: function() {
        alert('error saving updated viz');
      }  
  });
  },

  //Create a new visualization locally and store
  // Visualization new visualization in the db.
  createOne: function(){
    var viz = Visualization._createNewViz();
    Visualization._addVizLocally(viz);
    Visualization._addVizRemotely(viz);
    return viz;
  },

  updateOne: function(viz) {
    Visualization._updateVizLocally(viz);
    Visualization._updateVizRemotely(viz);
  },

  fetchAll: function() {
    Visualization._fetchAllFromRemote();
    return null;
  },

  getAll: function() {
    return Visualization._visualizations;
  },

  registerChangeCallback: function(fn) {
    Visualization._callbacks.push(fn);
  }
}