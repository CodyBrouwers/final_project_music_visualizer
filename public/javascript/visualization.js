uuid = function() {
  Math.floor(Math.random()*100000)
}

var Visualization = {

  _visualizations: {},
  
  _callbacks: [],


  _createNewViz: function(){
    var id = uuid();
    return { id: id,
        path: '',
        name: id ,
        created_at: '' ,
        updated_at: '' ,
    }

  },

  _runCallbacks: function () {
    for(var i in Visualization._callbacks) {
      Visualization._callbacks[i]();
    }
    // runs every callback
    // for callback in callbcaks
      // callback()
  },

  _addVizLocally: function(viz) {
    Visualization._visualizations[viz.id] = viz;

    // change happened, so run callacks
  },

  _addVizRemotely: function(viz){
    $.ajax({
      type: "POST",
      url: "/visualizations/new",
      dataType: 'json',
      data: viz,
      success: function() {
        console.log('posted');
      },
      error: function() {
        alert('error saving new viz');
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
    console.log(vizs);
    vizs.map(function(viz){
      Visualization._visualizations[viz.id] = viz;
    })
  },

  _updateVizLocally: function(viz) {
    Visualization._visualizations[viz.id] = viz;
    // change happened, so run callacks

  },

  _updateVizRemotely: function (viz) {
    $.ajax({
      type: "PUT",
      url: "/visualizations/"+viz.id+"edit",
      dataType: 'json',
      data: viz,
      success: function() {
        console.log('Updated');
      },
      error: function() {
        alert('error saving updated viz');
      }  
  });
  },

  //Create a new visualization locally and store Visualization new visualization in the db.
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
    var vizs = Visualization._fetchAllFromRemote();
    return null;
  },

  getAll: function() {
    return Visualization._visualizations;
  },

  registerChangeCallback: function(fn) {
    Visualization._callbacks.push(fn);
  }
}