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
    var verticies = [];
    var bounds = new google.maps.LatLngBounds();
    var continents = {
      europe: new google.maps.LatLngBounds(),
      eurasia: new google.maps.LatLngBounds(),
      africa: new google.maps.LatLngBounds(),
      asia: new google.maps.LatLngBounds()
    };
    posts.forEach(function(post, i){
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
          ga('send', 'event', 'Marker', 'open', post.attachments.data[0].title);
        });
        verticies.push(pos);
        if (post.place.location.country != 'United States') {
          bounds.extend(pos);
        }
        setBounds(post.place.location.country, pos, continents);
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

    map.fitBounds(bounds);

    addButtons(map, continents);
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

function setBounds(country, pos, continents) {
  switch(country) {
  case 'Italy':
  case 'Greece':
  case 'Germany':
    continents.europe.extend(pos);
    break;
  case 'Georgia':
  case 'Israel':
  case 'Turkey':
    continents.eurasia.extend(pos);
    break;
  case 'South Africa':
  case 'Namibia':
    continents.africa.extend(pos);
    break;
  case 'India':
  case 'Israel':
  case 'Thailand':
  case 'United Arab Emirates':
  case 'Vietnam':
  case 'South Korea':
  case 'Japan':
    continents.asia.extend(pos);
    break;
  }
}

function addButtons(map, continents) {
  var listener = function() {
    map.fitBounds(continents[this.dataset.continent]);
  };

  var container = document.createElement('div');
  for (var key in continents) {
    var button = document.createElement('div');
    button.dataset.continent = key;
    button.innerText = key.charAt(0).toUpperCase() + key.slice(1);
    button.className = 'topBtn';
    button.addEventListener('click', listener);
    container.appendChild(button);
  }
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(container);

  if (window.self !== window.top) { //If in iframe
    var link = document.createElement('a');
    link.innerText = 'Full Screen';
    link.href = window.location.href;
    link.target = '_blank';
    link.className = 'topBtn';
    map.controls[google.maps.ControlPosition.TOP_RIGHT].push(link);
  }
}

function showVideo(id) {
  document.querySelector('#modal').className = 'visible';
  document.querySelector('#player').src = 'https://www.facebook.com/plugins/video.php?allowfullscreen=true&app_id&container_width=1264&href=https%3A%2F%2Fwww.facebook.com%2Fsnapsfromabroad%2Fvideos%2F' + id +'%2F&locale=en_US&sdk=joey&width=500';
}
