var markerCount = 0;
var map;
var socket = io();
function initialize() {

        if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition(success, error);
        } else {
              error('not supported');
        }
        
        function success (position) {
            var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            console.log(latlng);
            var mapOptions = {
              center: latlng,
              zoom: 10,
              mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            map = new google.maps.Map(document.getElementById("map_canvas"),
            mapOptions);

            socket.emit('agregar', {
                'latitud': position.coords.latitude,
                'longitud': position.coords.longitude
            });
        }

        function error(msg) {
                       
            console.log(msg);
        }
        
        
      }
google.maps.event.addDomListener(window, 'load', initialize); 

function addMarkerToMap(lat, long, htmlMarkupForInfoWindow){
    var infowindow = new google.maps.InfoWindow();
    var myLatLng = new google.maps.LatLng(lat, long);
    var marker = new google.maps.Marker({
        position: myLatLng,
        map: map,
        animation: google.maps.Animation.DROP,
    });
     
    //Gives each marker an Id for the on click
    markerCount++;
 
    //Creates the event listener for clicking the marker
    //and places the marker on the map
    google.maps.event.addListener(marker, 'click', (function(marker, markerCount) {
        return function() {
            infowindow.setContent(htmlMarkupForInfoWindow);
            infowindow.open(map, marker);
        }
    })(marker, markerCount)); 
     
    //Pans map to the new location of the marker
    //map.panTo(myLatLng)       
}

$(document).ready(function() {
    $('#btnAgregar').click(function(e) {
        e.preventDefault();
        var latitud = $('#txtLatitud').val();
        var longitud = $('#txtLongitud').val();
        addMarkerToMap(latitud, longitud, '<p>Usuario Localizado</p>');
         var coords = {
            latitud: latitud,
             longitud: longitud
         };

        socket.emit('agregar', coords);
    });
})

socket.on('usuario agregado', function(usuario) {
    addMarkerToMap(usuario.latitud, usuario.longitud, '<p>'+ usuario.nombre +'</p>');
});

socket.on('conectados', function(usuarios) {
    usuarios.forEach(function(usuario) {
        addMarkerToMap(usuario.latitud, usuario.longitud, '<p>'+ usuario.nombre +'</p>');
    });
})