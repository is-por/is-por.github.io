
//Global variables
var user_name = "@erispor1";
var display_name = "Eris (shits not working)";
var config_file = "config/config.json";
var current_date = Date.now();
var tweets = [];

//Main execution cycle
$( document ).ready(function() 
{
	//console.log("document.onload");
	carga_config();
	
	format_date(document);
	
	birthday_count();
	
	$("#bottom_menu").load("./bot-menu.html");
	$("#container_left").load("./left-menu.html"); 
	$("#container_right").load("./right-menu.html", function(){
		generate_trends();
	
		//engagement del perfil/tendencias
		generate_engagement(document);
	});
});

