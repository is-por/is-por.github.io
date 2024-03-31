
//Global variables
var user_name = "@erispor1";
var display_name = "Eris (shits not working)";
var config_file = "config/config.json";
var current_date = Date.now();
var tweets = [];

//Main execution cycle
window.onload = (event) =>
{
	
	//console.log("document.onload");
	carga_config();
	
	generate_trends();
	
	//engagement del perfil/tendencias
	generate_engagement(document);
	
	format_date(document);
	
	birthday_count();
	
}

