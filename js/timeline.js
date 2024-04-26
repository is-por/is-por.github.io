//Override
function carga_config()
{
	fetch(config_file).then(function(response)
	{
		return response.json();
	}).then(function(json) {
		
		display_name = json.display_name;
		user_name = json.user_name;
		sheetURL = json.sheet_url+"?page=2";
		
		update_username(document);

		carga_tuits_drive(true);
	})
	.catch(function(error){console.log(error);});
}

function carga_tuits_drive()
{	
	fetch(sheetURL).then(function(response)
	{
		return response.json();
	}).then(function(json) {
		tweets = json;
		
		load_all_tweets(0);
	})
	.catch(function(error){console.log(error);});
}

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

