var guj = require("geojson-utils"),
    geocodeAddress = require("./geocode"),
    getCurrentLocation = require("./current_location"),
    Map = require("./map"),
    config = require("../config");

var json = {},
    map,
    latitude,
    longitude;

//--------------------
// MAP VARIABLES
//--------------------


/**
 * Initializes the application and sets
 * event listeners
 */

function init (data) {
  json = data, map = new Map(data);

  $('#input-target').on('click', onGetCurrentLocation);
  $('#input-go').on('click', onGo);
  $('#location-form').on('submit', onSubmit);
  $(document).keydown(function (e) {
    if (e.which == 27 && e.ctrlKey == false && e.metaKey == false) reset();
  });
  $('#about-link').on('click', aboutOpen);
  $('#about-close').on('click', function (e) {
    e.preventDefault();
    reset();
  });
}

/**
 * Load from hash to determine state of the application
 */

function loadHash() {
  var hash = window.location.hash;
  var state = hash.substr(hash.indexOf('#/'));
  switch(state) {
    case 'about':
      $('#about-link').click();
      break;
    case 'here':
      $('#input-target').click();
      break;
    case 'find':
      $('#input-go').click();
      break;
    default:
      reset();
  }
/*
  if (hash.match(/\//)) {
      var splitHash = hash.split(/\//);
      var section = splitHash[0];
      var projectID = splitHash[1];
      // Open portfolio item
      if(section == '#portfolio'){
          $('#d-portfolio').show();
          $('#port-menu').hide();
          $('#port-project').show();
          if(projectID){
              loadProject(projectID);
          }
      }
  }
  */
}

/**
 *  history.js test
 */

(function(window,undefined){

    // Prepare
    var History = window.History; // Note: We are using a capital H instead of a lower h
    if ( !History.enabled ) {
         // History.js is disabled for this browser.
         // This is because we can optionally choose to support HTML4 browsers or not.
        return false;
    }

    // Bind to StateChange Event
    History.Adapter.bind(window,'statechange',function(){ // Note: We are using statechange instead of popstate
        var State = History.getState(); // Note: We are using History.getState() instead of event.state
        History.log(State.data, State.title, State.url);
    });

    // Change our States

    /*
    History.pushState({state:1}, "State 1", "?state=1"); // logs {state:1}, "State 1", "?state=1"
    History.pushState({state:2}, "State 2", "?state=2"); // logs {state:2}, "State 2", "?state=2"
    History.replaceState({state:3}, "State 3", "?state=3"); // logs {state:3}, "State 3", "?state=3"
    History.pushState(null, null, "?state=4"); // logs {}, '', "?state=4"
    // logs {state:3}, "State 3", "?state=3"
    History.back(); // logs {state:1}, "State 1", "?state=1"
    History.back(); // logs {}, "Home Page", "?"
    History.go(2); // logs {state:3}, "State 3", "?state=3"
    */

})(window);

/**
 * Creates the page from config and renders the map
 */

function render () {
  $('head title').html('Am I in ' + config.name);
  $('#header h1').html(config.name + '?');
  $('#header p').html(config.tagline);
  $('#about p:first').html(config.about);
  $('#input-location').attr('placeholder', config.address);
  $('#input-location').focus();
  map.render();
}

/**
 * Resets the application to its initial state
 */

function reset () {
  // window.location.hash = '#/';
  $('#input-location').val('');
  $('#alert').hide();
  aboutClose();
  $('#question').fadeIn(150);
  $('#input-location').focus();

  map.reset();
}

/**
 * Renders the answer and drops the pin on the map
 */

function setAnswer (answer) {
  // Include a message providing further information.
  // Currently, it's just a simple restatement of the
  // answer.  See GitHub issue #6.
  var detail;
  if (answer == 'Yes') {
    detail = config.responseYes
  } else {
    detail = config.responseNo
  }

  map.createMarker(latitude, longitude);
  map.createPopup(latitude, longitude, answer, detail)
  map.setLocation(latitude, longitude, config.finalZoom);

//  $('.leaflet-popup-content-wrapper').show().animate({opacity: 0, top: '-150px'}, 0);
  $('#question').fadeOut(250, function() {
//    $('.leaflet-popup-content-wrapper').animate({opacity: 1, top: '0'}, 150);
  });

}

/**
 * Checks to see whether a latitude and longitude
 * fall within the limits provided in region.json
 * @param {String} [latitude] the latitude
 * @param {String} [longitude] the longitude
 */

function checkWithinLimits (latitude, longitude) {
  var point   = { type: "Point", coordinates: [ longitude, latitude ] };
  var polygon = json.features[0].geometry;
  var withinLimits = guj.pointInPolygon(point, polygon);

  if (withinLimits) {
    onWithinLimits()
  } else {
    onOutsideLimits();
  }
}

/**
 * Displays an answer that specifies that the location
 * is within the limits
 */

function onWithinLimits () {
  setAnswer("Yes");
}

/**
 * Displays an answer that specifies that the location
 * is not within the limits
 */

function onOutsideLimits () {
  setAnswer("No");
}

/**
 * Gets the current location, and checks whether
 * it is within the limits
 */

function onGetCurrentLocation () {
  window.location.hash = '#/here/';  
  geocodeByCurrentLocation();
  return false;
}

/**
 * Submits the form, geocodes the address, and checks
 * whether it is within the limits
 */

function onGo (e) {
  e.preventDefault();
  submitLocation();
}

/**
 * Submits the form, geocodes the address, and checks
 * whether it is within the limits
 */

function onSubmit (e) {
  e.preventDefault();
  submitLocation();
}

/**
 * Submits form
 */
function submitLocation () {
  var $input = $("#input-location"),
      address = $input.val(),
      options = '';
  if (address != '') {
    window.location.hash = '#/find/' + encodeURIComponent(address) + options;
    geocodeByAddress(address);
  }
  else {
    $('#input-location').focus();
    for (var i = 0; i < 3; i++) {
      $('#input-location').animate({backgroundColor: '#fee'}, 100).animate({backgroundColor: '#fff'}, 100);
    }
    $('#alert').html('Please enter an address').slideDown(100);
  }
  return false;  
}

/**
 * Gets the current location and checks whether it is
 * within the limits
 */

function geocodeByCurrentLocation () {
  var onSuccess = function (position) {
    latitude = position.coords.latitude, longitude = position.coords.longitude;
    checkWithinLimits(latitude, longitude);
  }

  var onError = function (err) {
    alert("Error getting current position");
  }

  getCurrentLocation(onSuccess, onError);
 }

/**
 * Geocodes an address
 */ 

function geocodeByAddress (address) {
  geocodeAddress(address, function (res) {
    if (res && res.results.length > 0) {
      var result = res.results[0].geometry.location;
      latitude = result.lat, longitude = result.lng
      checkWithinLimits(latitude, longitude);
    }
  });
}

/**
 * Opens about window
 */

function aboutOpen (e) {
  e.preventDefault();
  window.location.hash = '#/about/';
  $('#location-form').fadeOut(200, function (){
    $('#about').fadeIn(200);
  });
}

/**
 * Closes about window
 */

function aboutClose () {
  $('#about').fadeOut(200, function () {
    $('#location-form').fadeIn(200);
  });
}

/**
 * Go back
 */

function goBack (e) {
  e.preventDefault();
  History.back();
  reset();
}

/**
 * Retrieves the region.json file and initializes
 * the application
 */ 

jQuery(document).ready(function () {
  $.getJSON(config.fileName, function (data) {
    init(data);

    // Load other application state immediately if link contains hash elements
    // Currently using BBQ's hashchange plugin for this functionality.
    // Bind hashchange event to window
    /*
    $(window).hashchange(function () {
        loadHash();
    });
    // Trigger hashchange immediately
    $(window).hashchange();
*/
    render();
  });
});

