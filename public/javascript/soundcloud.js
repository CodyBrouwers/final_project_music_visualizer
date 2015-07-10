var SoundCloud = {
 
  loadStreamUrl: function(viz, trackURL) {
    var clientID = "10ad4796eba0b699ba58581dcb84e252"
    SC.initialize({
      client_id: clientID
    });
    SC.get('/resolve', { url: trackURL }, function (track) {
      if (track.errors) {
        alert('Error loading track, please make sure the URL has the correct format: https://soundcloud.com/artist/title-of-the-track');
      } else {
        var songID = track.id;
        var streamURL;
        $.ajax({
          type: "GET",
          url: "http://api.sndcdn.com/i1/tracks/"+songID+"/streams?client_id="+clientID,
          dataType: 'jsonp',
          success: function(trackLinks) {
            // Gets artwork url from track and gets larger version
            var art = track.artwork_url;
            var imgLink;
            if (art) {
              imgLink = art.replace("large", "t300x300");
            } else {
              imgLink = 'https://www.wilde-life.com/sites/default/files/2014_sleep.jpg';
            }

            // Gets streaming link and sets streamURL with key
            var stream = trackLinks.http_mp3_128_url;
            if (stream) {
              var trackKey = stream.match(/\w{12}/);
              streamURL = "https://media.soundcloud.com/stream/"+trackKey;

              // Sets new viz properties and updates and loads song
              viz.path = streamURL;
              viz.image = imgLink;
              viz.name = track.title.split('(')[0]
              Visualization.updateOne(viz);
              musicInterface.loadSong(streamURL);
            } else {
              alert("This song cannot be used with NWMP unfortunately");
            }
          },
          error: function (error) {
            console.log(error);
          }
        })
      }
    });
  }
}