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
var loyalty = false;
var countLoyalty =1;
var paySuccessful = false;

$(document).on('turbolinks:load', function() {
  // Only load if on till page.
  if (window.location.pathname == '/') {

    // let all the tabs height equal the height of the second tab
    var biggestHeight = $('.tab2').height();
    $('.tabs').css({'height':biggestHeight});

    //onload show first tab contents
    $('.tab-content').hide();
    $('#CoffeeTakeOut').show();

    // Add a click function to each tab
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
      paySuccessful = false;
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
    failure: function(data) {
      console.log('failure');
      products = data;
    }
  });
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
      paySuccessful = true;
    }
  });
}

if (window.location.pathname == '/') {
  $.when(getProducts()).done(function() {
    //FUNCTION TO ADD & SUBTRACT ALL ITEMS IN THE TILL LIST 

    var adding =0;
    var till =0;
    var count =1;
    var screenTotal =0;
    var listTotal =0;

    $('div').click(function(){
      if(paySuccessful == true){
        //reset to empty till transaction
        $('#tillList1').html('');
        $('#tillTotal').html('');
        paySuccessful = false;
      }

      if($(this).hasClass('minus')){//minus function now active

        till = Number($('#tillTotal').text()); //get value of till total
        count++;

        $('div').click(function(){
          if(count % 2 == 0){

            if($(this).hasClass('tillThing')){

              //subtract item value from total
              var productID = $(this).attr('id');
              var sub = products[productID].price;
              var prodname = products[productID].name;
              list.push(productID);


              till = Number($('#tillTotal').text());
              till -= sub;

              if(till<0){
                $('#tillTotal').html("0.00");
              }
              else{
                $('#tillTotal').html(till);
              }

              count++;

              //mark item as removed from list
              $('#tillList1').append("- " + prodname + '<span class="righPrice">€' + sub +'</span><br/>');

            }
          }

        });
      }

      else if($(this).hasClass('tillThing') && (count % 2 != 0)){ //add function

        //fist add the item to the list
        var productID = $(this).attr('id');
        var price = products[productID].price;
        var name = products[productID].name;
        $('#tillList1').append( name + '<span class="righPrice">€' + price +'</span><br/>'); //change the html for this to display
        list.push(productID);
        //alert(list);

        //then add together the totals
        var add =  products[productID].price;
        till = Number($('#tillTotal').text()); 
        till += add;
        $('#tillTotal').html(till);
      }
    });
    //ENTER CASH TO TILL SCREEN
    $('div').click(function(){
      if($(this).hasClass('num')){
        $('#tillScreen').append($(this).text());
      }
    });
    $('#cBtn').click(function(){
          screenTotal = $('#tillScreen').text();
          var out = screenTotal.substring(0,screenTotal.length-1);
          $('#tillScreen').html(out);
    });

    //CALCULATE THE CHANGE TO BE GIVEN TO CUSTOMER
    $('.cashBtn').click(function(){
      screenTotal = Number($('#tillScreen').text());
      listTotal = Number($('#tillTotal').text());
      listTotal = screenTotal - listTotal;
      $('#tillTotal').html("CHANGE: " + listTotal.toFixed(2));

      //POST record of sale to server
      postSale('cash');
      if(paySuccessful == true){
        //reset to empty till transaction
        $('#tillList1').html('');
        $('#tillTotal').html('');
        paySuccessful = false;
      }
    });

    $('.creditBtn').click(function(){
      listTotal = Number($('#tillTotal').text());
      $('#tillTotal').html("Credit: " + listTotal.toFixed(2));

      //POST record of sale to server
      postSale('credit');
    });

  $('#5euro').click(function(){
      screenTotal = 5.00;
      listTotal = Number($('#tillTotal').text());
      listTotal = screenTotal - listTotal;
      $('#tillTotal').html("CHANGE: " + listTotal.toFixed(2));
    });

    $('#10euro').click(function(){
      screenTotal = 10.00;
      listTotal = Number($('#tillTotal').text());
      listTotal = screenTotal - listTotal;
      $('#tillTotal').html("CHANGE: " + listTotal.toFixed(2));
    });

    $('#20euro').click(function(){
      screenTotal = 20.00;
      listTotal = Number($('#tillTotal').text());
      listTotal = screenTotal - listTotal;
      $('#tillTotal').html("CHANGE: " + listTotal.toFixed(2));
    });

  // LOYALTY CARD USED TO PAY
    $('.LoyaltyBtn').click(function(){
      postSale('loyalty_card');
      $('#tillTotal').html("Loyalty Card!");

      //POST record of sale to server
      if(paySuccessful == true){
        //reset to empty till transaction
        $('#tillList1').html('');
        $('#tillTotal').html('');
        paySuccessful = false;
      }
    });
  });
}


