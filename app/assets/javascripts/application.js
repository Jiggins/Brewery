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

$(document).ready(function() {
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


// calculator code

window.onload = function() {

var current,
    screen,
    output,
    limit,
    zero,
    period,
    operator;
    
    screen = document.getElementById("totalDisplay");

var elem = document.querySelectorAll(".num");
    
      var len = elem.length;
    
      for(var i = 0; i < len; i++ ) {
        
        elem[i].addEventListener("click",function() {
                  
            num = this.value;
                     
            output = screen.innerHTML +=num;
                  
            limit = output.length;
         
         if(limit > 16 ) {
        
         alert("Sorry no more input is allowed");
             
       }
       
     },false);
        
    } 

    document.querySelector(".zero").addEventListener("click",function() {
        
        zero = this.value;
        
        if(screen.innerHTML === "") {
            
           output = screen.innerHTML = zero;  
        }
        
        else if(screen.innerHTML === output) {
            
         output = screen.innerHTML +=zero;
            
        }
          
    },false);
    
    document.querySelector(".period").addEventListener("click",function() {
        
        period = this.value;
        
        if(screen.innerHTML === "") {
            
         output = screen.innerHTML = screen.innerHTML.concat("0.");
            
         }
    
        else if(screen.innerHTML === output) {
        
          screen.innerHTML = screen.innerHTML.concat(".");
            
        }
        
    },false);
    
    
    document.querySelector("#eqn-bg").addEventListener("click",function() {
        
      if(screen.innerHTML === output) {
          
        screen.innerHTML = eval(output);
      }
        
      else {
            screen.innerHTML = "";
      }
          
    },false);
    
 document.querySelector("#delete").addEventListener("click",function() {
        
        screen.innerHTML = "";
        
    },false);
    
   
     var elem1 = document.querySelectorAll(".operator");
    
      var len1 = elem1.length;
    
      for(var i = 0; i < len1; i++ ) {
        
        elem1[i].addEventListener("click",function() {
         
        operator = this.value;
         
         if(screen.innerHTML === "") {
            
            screen.innerHTML = screen.innerHTML.concat("");
            
        }
        
        else if(output) {
        
            screen.innerHTML = output.concat(operator);
            
        }
           
    },false);
          
      }   
}
