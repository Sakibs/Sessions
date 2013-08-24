$(document).ready(function(){
  $("#test").html("Foo!");
  $( "#test" ).on( "mouseover", function() {
    $( this ).css( "color", "red" );
  });
});