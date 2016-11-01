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

$(document).ready(function() {
    // $('#tillScreen').text('till screen');
	// let all the tabs height equal the height of the second tab
    var biggestHeight = $('.tab2').height();
    $('.tab1').css({'height':biggestHeight});
    $('.tab3').css({'height':biggestHeight});
    $('.tab4').css({'height':biggestHeight});
    $('.tab5').css({'height':biggestHeight});
    $('.tab6').css({'height':biggestHeight});



    //change the color of clicked tabs
    $(".tab1").click(function(){
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
    url: 'http://localhost:3000/products.json',
    success: function(data) {
      products = data;
    },
    failure: function(data) {
      console.log('failure');
      products = data;
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
      till = parseFloat($('#tillTotal').text()); //get value of till total
      count++;

      $('div').click(function(){
        if(count % 2 == 0){

          if($(this).hasClass('tillThing')){

            //subtract item value from total
            var sub = parseFloat($(this).text());
            till = parseFloat($('#tillTotal').text());
            till -= sub;

            if(till<0){
              $('#tillTotal').html("0.00");
            }
            else{
              $('#tillTotal').html(till.toFixed(2));
            }

            count++;

            //mark item as removed from list
            $('#tillList').append("- " + $(this).attr('name') + "<br/>");
          }
        }

      });
    }

    else if($(this).hasClass('tillThing') && (count % 2 != 0)){ //add function

      //fist add the item to the list
      $('#tillList').append($(this).attr('name') + "<br/>");

      //then add together the totals
      var add = parseFloat($(this).text());
      till = parseFloat($('#tillTotal').text()); 
      till += add;
      $('#tillTotal').html(till.toFixed(2));
    }
  });
  //ENTER CASH TO TILL SCREEN
  $('div').click(function(){
    if($(this).hasClass('num')){
      // alert('num');
      $('#tillScreen').append($(this).text());
    }
  });

  //CALCULATE THE CHANGE TO BE GIVEN TO CUSTOMER
  $('.cashBtn').click(function(){
    screenTotal = parseFloat($('#tillScreen').text());
    listTotal = parseFloat($('#tillTotal').text());
    listTotal = screenTotal - listTotal;
    $('#tillTotal').html("CHANGE: " + listTotal.toFixed(2));
  });
});
