// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or any plugin's vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file. JavaScript code in this file should be added after the last require_* statement.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require jquery_ujs
//= require bootstrap-sprockets
//= require Chart.bundle
//= require chartkick
//= require moment
//= require bootstrap-datetimepicker
//= require turbolinks
//= require_tree .

var products = {};
var list = [];
var countLoyalty =1;
var tabsArray = ["tab-CoffeeTakeOut","tab-TeaTakeOut","tab-CoffeeSitIn","tab-TeaSitIn","tab-ColdDrink","tab-Food","tab-Retail"];

$(document).on('turbolinks:load', function() {
  // Only load if on till page.
  if (window.location.pathname == '/till') {

    // let all the tabs height equal the height of the second tab
    var biggestHeight = $('.tab2').height();
    $('.tabs').css({'height':biggestHeight});

    //onload show first tab contents
    $('.tab-content').hide();
    $('#CoffeeTakeOut').show();

    // Add a Click function to each tab
    $('.tabs').each(function() {
      $(this).click(function() {
        $('.tabs').removeClass('greyBack');
        $('.tab-content').hide();
        // Use the id of `this` and remove the 'tab-' prefix
        var tabContent = $(this).attr('id').substring(4);
        $('#' + tabContent).show();
        $(this).addClass('greyBack');
      });
    });

    //MANAGER FUNCTIONS
    $('#prodIntentory').click(function(){
      window.location='/products';
    });
    $('#prodSales').click(function(){
      window.location='/sales';
    });
    $('#resetTransaction').click(function(){
      //reset to empty till transaction
      $('#tillList1').html('');
      $('#tillTotal').html('');
    });
  }
});

// GET JSON FILE CONTENTS
function getProducts() {
  return $.ajax({
    type: "GET",
    dataType: "json",
    url: '/products.json',
    success: function(data) {
      products = data;
    },
    error: function(jqXHR, textStatus, errorThrown) {
      $('#notice').show();
      $('#error-list').append('<li>Unable to get product list</li>');
      $('#error-list').append('<li>Server responded with error code: ' + jqXHR.status + ": " + jqXHR.statusText + '</li>');
      $('#error-list').append('<li>' + jqXHR.responseText  + '</li>');
    }
  });
}

//Swipe to next tab functionality (works for swiping on tabs only right now)
var prevX = -1;
 function myFunction(event) {
   //console.log($( "div" ).find(".greyBack").attr("id"));

 var tabPosition = event.target.id;
 // console.log(event.clientY)

  if(prevX == -1) {
        prevX = event.pageX;    
        return false;
    }
  if( event.pageX !=0 && prevX > event.pageX && prevX !=0) { // dragged LEFT

     for(var i =0; i<tabsArray.length; i++){
          $('.tabs').removeClass('greyBack');
          $('.tab-content').hide();

          if(tabPosition == tabsArray[tabsArray.length-1]){
            var tabContent = tabPosition.substring(4);
            $('#' + tabContent).show();
        }

        else if(tabPosition == tabsArray[i]){
          // console.log("left");
          tabPosition = tabsArray[i+1];
          var tabContent = tabPosition.substring(4);
          $('#' + tabContent).show();
          $('#tab-' + tabContent).addClass('greyBack');
          break;
        }
      }
    }
    else if(prevX < event.pageX && event.pageX !=0 && prevX !=0) { // dragged RIGHT
       for(var i =0; i<tabsArray.length; i++){
          $('.tabs').removeClass('greyBack');
          $('.tab-content').hide();

          if(tabPosition == tabsArray[0]){
            var tabContent = tabPosition.substring(4);
            $('#' + tabContent).show();
        }
        else if(tabPosition == tabsArray[i]){
          // console.log("right");
          tabPosition = tabsArray[i-1];
          var tabContent = tabPosition.substring(4);
          $('#' + tabContent).show();
          $('#tab-' + tabContent).addClass('greyBack');
          break;
        }
      } 
    }
  }

// POST record of sale
// Valid parameters:
//    cash, credit, loyalty_card
function postSale(payment_method) {
  $.ajax({
    type: "POST",
    url: "sales.json",
    data: {"sale": {"ids": list, "payment_method": payment_method}},
    dataType: "json",
    success: function(sale) {
      $('html').one('click', function() {
        // Clear list on next click
        $('#tillList1').html('');
        $('#tillTotal').html('');
      });
    },
    error: function(jqXHR, textStatus, errorThrown) {
      $('#notice').show();
      $('#error-list').append('<li>Could not record sale</li>');
      $('#error-list').append('<li>Server responded with error code: ' + jqXHR.status + ": " + jqXHR.statusText + '</li>');
      $('#error-list').append('<li>' + jqXHR.responseText  + '</li>');
    }
  });
}

$.when(getProducts()).done(function() {
  //FUNCTION TO ADD & SUBTRACT ALL ITEMS IN THE TILL LIST 

  var adding =0;
  var till =0;
  var count =1;
  var screenTotal =0;
  var listTotal =0;
  var i = 0;

  $('#minus').click(function() {
    if (list.length !== 0) {
      till = Number($('#tillTotal').text()); //get value of till total
      count++;
    }
  });

  $('.tillThing').click(function(){
    var productID = $(this).attr('id');
    var price = products[productID].price;
    var name = products[productID].name;

    if(count % 2 === 0){
      //subtract item value from total
      if ($.inArray(productID, list) !== -1) {
        list.splice($.inArray(productID, list), 1);

        till = Number($('#tillTotal').text());
        till -= price;

        if(till<0){
          $('#tillTotal').html("0.00");
        }
        else{
          $('#tillTotal').html(till);
        }

        //mark item as removed from list
        $('#tillList1').append("- " + name + '<span class="righPrice">€' + price +'</span><br/>');
      }

      count++;
    }
    else {
      //fist add the item to the list
      $('#tillList1').append( name + '<span class="righPrice">€' + price +'</span><br/>'); //change the html for this to display
      list.push(productID);

      //then add together the totals
      var add =  products[productID].price;
      till = Number($('#tillTotal').text()); 
      till += add;
      $('#tillTotal').html(till);
    }
  });

  //ENTER CASH TO TILL SCREEN
  $('.num').click(function(){
    $('#tillScreen').append($(this).text());
  });

  $('#cBtn').click(function(){
    screenTotal = $('#tillScreen').text();
    var out = '';
    $('#tillScreen').html(out);
  });

  //CALCULATE THE CHANGE TO BE GIVEN TO CUSTOMER
  $('#cashBtn').click(function(){
    if (list.length !== 0) {
      screenTotal = Number($('#tillScreen').text());
      listTotal = Number($('#tillTotal').text());
      difference = screenTotal - listTotal;

      if (screenTotal === 0) {
        $('#tillTotal').html("SALE: " + listTotal.toFixed((2)));
      }
      else {
        $('#tillTotal').html("CHANGE: " + difference.toFixed(2));
      }
      //
      //POST record of sale to server
      postSale('cash');
    }
  });

  $('#credit-button').click(function(){
    if (list.length !== 0) {
      listTotal = Number($('#tillTotal').text());
      $('#tillTotal').html("Credit: " + listTotal.toFixed(2));

      //POST record of sale to server
      postSale('credit');
    }
  });

  $('#5euro').click(function(){
    if (list.length !== 0) {
      screenTotal = 5.00;
      listTotal = Number($('#tillTotal').text());
      listTotal = screenTotal - listTotal;
      $('#tillTotal').html("CHANGE: " + listTotal.toFixed(2));

      postSale('cash');
    }
  });

  $('#10euro').click(function(){
    if (list.length !== 0) {
      screenTotal = 10.00;
      listTotal = Number($('#tillTotal').text());
      listTotal = screenTotal - listTotal;
      $('#tillTotal').html("CHANGE: " + listTotal.toFixed(2));

      postSale('cash');
    }
  });

  $('#20euro').click(function(){
    if (list.length !== 0) {
      screenTotal = 20.00;
      listTotal = Number($('#tillTotal').text());
      listTotal = screenTotal - listTotal;
      $('#tillTotal').html("CHANGE: " + listTotal.toFixed(2));

      postSale('cash');
    }
  });

  // LOYALTY CARD USED TO PAY
  $('#loyalty-button').click(function(){
    if (list.length !== 0) {
      //POST record of sale to server
      $('#tillTotal').html("Loyalty Card!");

      postSale('loyalty_card');
    }
  });
});



