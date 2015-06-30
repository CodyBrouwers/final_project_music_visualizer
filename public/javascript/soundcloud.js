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
        $.ajax({
          type: "GET",
          url: "http://api.sndcdn.com/i1/tracks/"+songID+"/streams?client_id="+clientID,
          dataType: 'json',
          success: function(trackLinks) {
            var stream = trackLinks.http_mp3_128_url;
            var trackKey = stream.match(/\w{12}/);
            var streamURL = "http://media.soundcloud.com/stream/"+trackKey;
            musicInterface.loadSong(streamURL);
            viz.path = streamURL;
            Visualization.updateOne(viz);
          }
        });
      }
    });
  }
}