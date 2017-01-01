function initMap() {
  var map = new google.maps.Map(document.getElementById('map-canvas'), {
    zoom: 5,
    center: {lat: 39.8281, lng: -98.5795}
  });
  loadPoints(map);

  document.querySelector('#modal-background').addEventListener('click', function() {
    document.querySelector('#modal').className = '';
    document.querySelector('#player').src = '';
  });
}

function loadPoints(map) {
  getPosts(function(posts){
    let verticies = [];
    posts.forEach(function(post){
      if (post.place) {
        pos = {
          lat: post.place.location.latitude,
          lng: post.place.location.longitude
        };
        var marker = new google.maps.Marker({
          position: pos,
          map: map
        });
        marker.addListener('click', function() {
          showVideo(post.attachments.data[0].target.id);
        });
        verticies.push(pos);
      }
    });
    var path = new google.maps.Polyline({
        path: verticies,
        geodesic: true,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 2
      });

    path.setMap(map);
  });
}

function getPosts(callback) {
  var request = new XMLHttpRequest();
  request.open('GET', '/api/posts', true);

  request.onload = function() {
    if (this.status >= 200 && this.status < 400) {
      var data = JSON.parse(this.response);
      callback(data);
    }
  };

  request.send();
}

function showVideo(id) {
  document.querySelector('#modal').className = 'visible';
  document.querySelector('#player').src = 'https://www.facebook.com/video/embed?video_id=' + id;
}
