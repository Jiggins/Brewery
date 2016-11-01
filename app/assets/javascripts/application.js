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
//= require turbolinks
//= require_tree .

var products = {};
var list = [];
var loyalty = false;

$(document).ready(function() {

	// let all the tabs height equal the height of the second tab
    var biggestHeight = $('.tab2').height();
    $('.tab1').css({'height':biggestHeight});
    $('.tab3').css({'height':biggestHeight});
    $('.tab4').css({'height':biggestHeight});
    $('.tab5').css({'height':biggestHeight});
    $('.tab6').css({'height':biggestHeight});

    //onload show first tab contents
        $('#TACoffee').show();
        $('#TATea').add('#SICoffee').add('#SITea').add('#ColdDrinks').add('#FoodRetail').hide();

    //change the color of clicked tabs
    $(".tab1").click(function(){

        //show contents of selected tab
        $('#TACoffee').show();
        $('#TATea').add('#SICoffee').add('#SITea').add('#ColdDrinks').add('#FoodRetail').hide();

        //change the color of clicked tabs
    	if($(".tab1").hasClass('greyBack')){
    	}else{	
    	$(this).toggleClass('greyBack')};
    		$('.tab2').removeClass('greyBack');
    		$('.tab3').removeClass('greyBack');
    		$('.tab4').removeClass('greyBack');
    		$('.tab5').removeClass('greyBack');
            $('.tab6').removeClass('greyBack');

	});  
	 $(".tab2").click(function(){

        //show contents of selected tab
        $('#TATea').show();
        $('#TACoffee').add('#SICoffee').add('#SITea').add('#ColdDrinks').add('#FoodRetail').hide();

        //change the color of clicked tabs
    	if($(".tab2").hasClass('greyBack')){
    	}else{	
    	$(this).toggleClass('greyBack')};
    	$('.tab1').removeClass('greyBack');
    		$('.tab3').removeClass('greyBack');
    		$('.tab4').removeClass('greyBack');
    		$('.tab5').removeClass('greyBack');
            $('.tab6').removeClass('greyBack');

	}); 
	$(".tab3").click(function(){

        //show contents of selected tab
        $('#SICoffee').show();
        $('#TACoffee').add('#TATea').add('#SITea').add('#ColdDrinks').add('#FoodRetail').hide();

        //change the color of clicked tabs
    	if($(".tab3").hasClass('greyBack')){
    	}else{	
    	$(this).toggleClass('greyBack')};
    		$('.tab1').removeClass('greyBack');
    		$('.tab2').removeClass('greyBack');
    		$('.tab4').removeClass('greyBack');
    		$('.tab5').removeClass('greyBack');
            $('.tab6').removeClass('greyBack');

	});  
	$(".tab4").click(function(){

        //show contents of selected tab
        $('#SITea').show();
        $('#TACoffee').add('#TATea').add('#SICoffee').add('#ColdDrinks').add('#FoodRetail').hide();

        //change the color of clicked tabs
    	if($(".tab4").hasClass('greyBack')){
    	}else{	
    	$(this).toggleClass('greyBack')};
    		$('.tab1').removeClass('greyBack');
    		$('.tab2').removeClass('greyBack');
    		$('.tab3').removeClass('greyBack');
    		$('.tab5').removeClass('greyBack');
            $('.tab6').removeClass('greyBack');

	}); 
	$(".tab5").click(function(){

        //show contents of selected tab
        $('#ColdDrinks').show();
        $('#TACoffee').add('#TATea').add('#SICoffee').add('#SITea').add('#FoodRetail').hide();

        //change the color of clicked tabs
    	if($(".tab5").hasClass('greyBack')){
    	}else{	
    	$(this).toggleClass('greyBack')};
    		$('.tab1').removeClass('greyBack');
    		$('.tab2').removeClass('greyBack');
    		$('.tab3').removeClass('greyBack');
    		$('.tab4').removeClass('greyBack');
            $('.tab6').removeClass('greyBack');

	}); 
        $(".tab6").click(function(){

        //show contents of selected tab
        $('#FoodRetail').show();
        $('#TACoffee').add('#TATea').add('#SICoffee').add('#SITea').add('#ColdDrinks').hide();

        //change the color of clicked tabs
        if($(".tab6").hasClass('greyBack')){
        }else{  
        $(this).toggleClass('greyBack')};
            $('.tab1').removeClass('greyBack');
            $('.tab2').removeClass('greyBack');
            $('.tab3').removeClass('greyBack');
            $('.tab4').removeClass('greyBack');
            $('.tab5').removeClass('greyBack');
    }); 
});

// GET JSON FILE CONTENTS
function getProducts() {
  return $.ajax({
    type: "GET",
    dataType: "json",
    url: 'products.json',
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
// credit = true -> Credit card transaction
// credit = false -> Cash transaction
function postSale(credit) {
  $.ajax({
    type: "POST",
    url: "sales.json",
    data: {"sale": {"ids": list, "loyalty_card": loyalty, "credit": credit}},
    dataType: "json",
    success: function(sale) {
      console.log('id: ' + sale.id);
      console.log('net_total: ' + sale.net_total);
      console.log('total: ' + sale.total);
      console.log('vat: ' + sale.vat);
      console.log('cash_or_credit: ' + sale.cash_or_credit);
      console.log('loyalty_card: ' + sale.loyalty_card);
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

  $('div').click(function(){

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
    postSale(false);
  });

  $('.creditBtn').click(function(){
    listTotal = Number($('#tillTotal').text());
    $('#tillTotal').html("Credit: " + listTotal.toFixed(2));

    //POST record of sale to server
    postSale(true);
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
        loyalty = true;
   });

//MANAGER FUNCTIONS
    $('#prodIntentory').click(function(){
        window.location='http://localhost:3000/products';
    });
    $('#prodSales').click(function(){
        window.location='http://localhost:3000/sales';
    });
});
