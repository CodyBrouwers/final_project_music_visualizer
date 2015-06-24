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
    // runs every callback
    // for callback in callbcaks
      // callback()
  },

  _addVizLocally: function(viz) {
    this._visualizations[viz.id] = viz;

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
          _storeAllLocally(vizs);
      });

    // change happened, so run callacks
  },

  _storeAllLocally: function (vizs) {
    vizs.map(function(viz){
      this._visualizations[viz.id] = viz;
    })
  }

  _updateVizLocally: function(viz) {
    this._visualizations[viz.id] = viz;
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

  //Create a new visualization locally and store this new visualization in the db.
  createOne: function(){
    var viz = _createNewViz();
    _addVizLocally(viz);
    _addVizRemotely(viz);
    return viz;
  },

  updateOne: function(viz) {
    _updateVizLocally(viz);
    _updateVizRemotely(viz);
  },

  fetchAll: function() {
    var vizs = _fetchAllFromRemote();
    _storeAllLocally(vizs);
    return null;
  },

  getAll: function() {
    return this._visualizations;
  },

  registerChangeCallback: function(fn) {
    this._callbacks.push(fn);
  }
}