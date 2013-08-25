$(document).ready(function(){
	/*
  $("#test").html("Foo!");
  $( "#test" ).on( "mouseover", function() {
    $( this ).css( "color", "red" );
  });
	*/

  $(".b_remove").hover(
    function(){$(this).fadeIn()}
    ,function(){$(this).fadeOut()}
	);

  $(".sn_instance_name").hover(function(){
	  $("p").css("background-color","yellow");
	  },function(){
	  $("p").css("background-color","pink");
	});


  // This function did not work.
  $(".sn_instance_name").click(function() {
  	console.log("clicked header");
    $(this).parent().find('ul').toggle();
  });

});
