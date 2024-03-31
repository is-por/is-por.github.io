//Overwrite function
function carga_config()
{
	console.log("wiwo")
	fetch(config_file).then(function(response)
	{
		return response.json();
	}).then(function(json) {
		
		display_name = json.display_name;
		user_name = json.user_name;
		
		update_username(document);
		/*
		tweets = json.tweets;
		
		load_all_tweets(0);
		*/
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
}

