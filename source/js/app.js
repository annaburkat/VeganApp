// Initialize Firebase
var config = {
  apiKey: "AIzaSyCsX8OmdPD54oWeExLlGI9ITk0SerULE3E",
  authDomain: "mapa-5d72f.firebaseapp.com",
  databaseURL: "https://mapa-5d72f.firebaseio.com",
  storageBucket: "mapa-5d72f.appspot.com",
  messagingSenderId: "846434792681"
};

var app = firebase.initializeApp(config);

//RESTAURANTS
var map_restaurants, markers_restaurants = [];
function addPlace(lat, lon, txt) {
  var optionMarker = {
    position: new google.maps.LatLng(lat, lon),
    map: map_restaurants,
    icon: txt.icon != undefined ? "assets/images/" + txt.icon + ".png" : "assets/images//blue_MarkerA.png",
    animation: google.maps.Animation.DROP,
  }

  var marker_restaurant = new google.maps.Marker(optionMarker);
  marker_restaurant.txt = txt;
  //creat variable 'popup' to put some information into it
  var popup = new google.maps.InfoWindow({
    maxWidth: 200
  });

  //after click open popup  with information
  google.maps.event.addListener(marker_restaurant, "click", function() {
    popup.setContent('<div class="popup"><p class="js-restaurant-name popup__name">' + txt.title + '</p><i class="popup__pointer fa fa-hand-pointer-o" aria-hidden="true"></i><p class="popup__details">' + txt.address + '</p><p class="popup__details">' + txt.hours + '</p><img class="popup__icon" src=' + "assets/images/" + txt.icon + ".png>" + '</img><span class="popup__type '+ txt.color +'">' + txt.cat + '</span></div>');
    popup.open(map_restaurants, marker_restaurant);
    //scroll to right part of the website
    var popup_restaurant = $('.js-restaurant-name');
    var profile_restaurant = $('.js-restaurant-title');
    //after click open popup with information
    popup_restaurant.on('click', function() {
      for (var i = 0; i < profile_restaurant.length; i++) {
        if ($(this).text() == (profile_restaurant[i].innerHTML)) {
          $('html, body').animate({
            scrollTop: $(profile_restaurant[i]).offset().top
          }, 2000);
        }
      }
    })
  });
  //add markers to array
  markers_restaurants.push(marker_restaurant);
}

//SHOPS
var map_shops, markers_shops = [];
function addStore(lat, lon, txt) {
  var optionMarker2 = {
    position: new google.maps.LatLng(lat, lon),
    map: map_shops,
    icon: txt.icon != undefined ? "assets/images/" + txt.icon + ".png" : "assets/images/blue_MarkerA.png",
    animation: google.maps.Animation.DROP,
  }
  //create marker
  var marker_shop = new google.maps.Marker(optionMarker2);
  marker_shop.txt = txt;
  //creat variable 'popup' to put some information into it
  var popup2 = new google.maps.InfoWindow();
  //after click open popup with information
  google.maps.event.addListener(marker_shop, "click", function() {
    popup2.setContent('<div class="popup"><p class="popup__name js-shop-name">' + txt.title + '</p><i class="fa fa-hand-pointer-o" aria-hidden="true"></i><p class="popup__details">' + txt.address + '</p><p class="popup__details">' + txt.hours + '</p><img class="popup__icon src=' + "assets/images/" + txt.icon + ".png>" + '</img><span>' + txt.cat + '</span></div>');
    popup2.open(map_shops, marker_shop);

    //scroll to right part of the website
    var popup_shop = $('.js-shop-name');
    var profile_shop = $('.js-shop-title');

    popup_shop.on('click', function() {
      for (var i = 0; i < profile_shop.length; i++) {
        if ($(this).text() == (profile_shop[i].innerHTML)) {
          $('html, body').animate({
            scrollTop: $(profile_shop[i]).offset().top
          }, 2000);
        }
      }
    })
  });
  //add markers to array
  markers_shops.push(marker_shop);
}


// Initialize google maps
var krakow = {
  lat: 50.06465,
  lng: 19.94498
};

function initMap() {
  var mapOption = {
    zoom: 14,
    center: krakow,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };

  map_restaurants = new google.maps.Map(document.getElementById('map_restaurants'), mapOption);
  map_shops = new google.maps.Map(document.getElementById('map_shops'), mapOption);
}

document.addEventListener('DOMContentLoaded', function() {

  // slider //
  var myIndex = 0;

  function carousel() {
    var i;
    var x = $('.js-slider__img');
    for (i = 0; i < x.length; i++) {
      x[i].style.display = "none";
    }
    myIndex++;
    if (myIndex > x.length) {
      myIndex = 1
    }
    x[myIndex - 1].style.display = "block";
    setTimeout(carousel, 5000);
  }
  carousel();
  // END slider //

  //random colors for letters
  var colours = ["#69368D", "#D37E47", "hotpink", "#2D8775", "#B2466E", "#A1C14C", "#C9923D"]

  $(function() {
    var letters = $('#js-logo-subtitle');
    var chars = letters.text().split('');
    letters.html('');
    for (var i = 0; i < chars.length; i++) {
      idx = Math.floor(Math.random() * colours.length);
      var span = $('<span>' + chars[i] + '</span>').css("color", colours[idx]);
      letters.append(span);
    }
  });
  // END random colors for letters

  //tabs from bootstrap
  $('#js-tab').click(function(e) {
    e.preventDefault();
    $(this).tab('show');
  });

  //load a map after change of tabs
  $(".nav-tabs").on('shown.bs.tab', function() {
    /* Trigger map resize event */
    google.maps.event.trigger(map_restaurants, 'resize');
    google.maps.event.trigger(map_shops, 'resize');
    //center map to position
    map_shops.setCenter(krakow);
  });


  ////////////////////////////RESTAURANTS///////////////////////////////////
  //checkboxes & show checked places
  function getPlaces(data) {
    //checkboxes asigne to variables and check if they are checked
    var vegan = $("input[name='vegan']").is(':checked');
    var vegetarian = $("input[name='vegetarian']").is(':checked');
    var friendly = $("input[name='friendly']").is(':checked');

    var arr = [];
    $.each(data, function(index, item) {
      if (vegan && item.cat === 'vegan') {
        arr.push(item);
      }
      if (vegetarian && item.cat === 'vegetarian') {
        arr.push(item);
      }
      if (friendly && item.cat === 'vegan-friendly') {
        arr.push(item);
      }
    });
    return arr;
  }

  // create restaurant profile //
  function creatProfile(data) {
    var profile = $('<div>');
    $(profile).addClass('profile__item col-md-6 col-12');
    profile.html('<h2 class="js-restaurant-title profile__title">' + data.title + '</h2><p class="profile__details">' + data.address + '</p><p class="profile__details">' + data.hours + '</p><img class="profile__img" src=' + data.img + '></img><div class="profile__description">' + data.desc + '</div>');

    if (data.cat === 'vegan') {
      $('.js-kind-vegan').append(profile);
    }
    if (data.cat === 'vegetarian') {
      $('.js-kind-vegetarian').append(profile);
    }
    if (data.cat === 'vegan-friendly') {
      $('.js-kind-friendly').append(profile);
    }
    return profile;
  }
  // END create restaurant profile //

  function changeHeight() {
    var profileBox = $('.profile__item');
    var max = 0;
    profileBox.each(function() {
      if (max < $(this).outerHeight()) {
        max = $(this).outerHeight();
      }
    })
    profileBox.height(max);
  }

  // get data from firebase
  var places = app.database().ref('places');
  places.once("value").then(function(data) {
    var pl = getPlaces(data.val());
    $.each(markers_restaurants, function(i, m) {
      m.setMap(null);
    });
    $.each(pl, function(index, item) {
      addPlace(item.lat, item.lng, item);
      creatProfile(item);
      changeHeight();
    });
  });


  //event change na checkboxy
  $('input.js-checkbox').change(function() {
    $('div.profile__item').remove();
    places.once("value").then(function(data) {
      var pl = getPlaces(data.val());
      $.each(markers_restaurants, function(i, m) {
        m.setMap(null);
      });
      $.each(pl, function(index, item) {
        addPlace(item.lat, item.lng, item);
        creatProfile(item);
        changeHeight();
      })
    });
  })

  //////////////////////////STORE//////////////////////////////////////
  //get places which are choosen
  function getStore(data) {
    // asigne checkboxes to variables and check if they are checked
    var store = $("input[name='store']").is(":checked");
    var other = $("input[name='other']").is(':checked');

    var arr2 = [];
    $.each(data, function(index, item) {
      if (store && item.cat === 'store') {
        arr2.push(item);
      }
      if (other && item.cat === 'other') {
        arr2.push(item);
      }
    });
    return arr2;
  }

  //create store profile
  function createStoreProfile(data) {
    var profile2 = $('<div>');
    $(profile2).addClass('profile__item col-md-6 col-12');
    profile2.html('<h2 class="js-shop-title profile__title">' + data.title + '</h2><p class="profile__details">' + data.address + '</p><p class="profile__details">' + data.hours + '</p><img class="profile__img" src=' + data.img + '></img><div class="profile__description">' + data.desc + '</div>');

    if (data.cat === 'store') {
      $('.js-kind-store').append(profile2);
    }
    if (data.cat === 'other') {
      $('.js-kind-other').append(profile2);
    }
    return profile2;
  }

  //get data from firebase
  var stores = app.database().ref('stores');

  stores.once("value").then(function(data) {
    var st = getStore(data.val());
    $.each(markers_shops, function(i, m) {
      m.setMap(null);
    });
    $.each(st, function(index, item) {
      addStore(item.lat, item.lng, item);
      createStoreProfile(item);
      changeHeight();
    })
  });

  //event change na checkboxy
  $('input.js-checkbox').change(function() {
    $('div.profile__item').empty();
    stores.once("value").then(function(data) {
      var st = getStore(data.val());
      $.each(markers_shops, function(i, m) {
        m.setMap(null);
      });
      $.each(st, function(index, item) {
        addStore(item.lat, item.lng, item);
        createStoreProfile(item);
        changeHeight();
      })
    });
  })



});
