$( document ).ready(function() {

  $( "#showclearence" ).click(function() {

var value = $('#txtHash').val();
    if(value && value != '')
    readData(value);
  });

});

function readData(hash){
  readObjectFromTangle(hash, function(data){
    console.log(data);
    $('#checkResult').text(data);
    showClearenceBoard();
  })
}

function showClearenceBoard(){

  var movies = [
	  { Name: "The Red Violin", ReleaseYear: "1998" },
	  { Name: "Eyes Wide Shut", ReleaseYear: "1999" },
	  { Name: "The Inheritance", ReleaseYear: "1976" }
	  ];

	var markup = "<li><b>${Name}</b> (${ReleaseYear})</li>";

	/* Compile the markup as a named template */
	$.template( "movieTemplate", markup );

	/* Render the template with the movies data and insert
	   the rendered HTML under the "movieList" element */
	$.tmpl( "movieTemplate", movies )
	  .appendTo( "#clearenceScreen" );

  $('#startScreen').fadeOut(0);
  $('#clearenceScreen').fadeIn(300);
}
