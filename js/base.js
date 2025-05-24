//override
function carga_config()
{
	fetch(config_file).then(function(response)
	{
		return response.json();
	}).then(function(json) {
		
		display_name = json.display_name;
		user_name = json.user_name;
		sheetURL = json.sheet_url;
		
		update_username(document);

	})
	.catch(function(error){console.log(error);});
}

//Main execution cycle
window.onload = (event) =>
    {
        //console.log("document.onload");
        carga_config();
        
        format_date(document);	
        
        $("#bottom_menu").load("./bot-menu.html");
        $("#container_left").load("./left-menu.html"); 
        $("#container_right").load("./right-menu.html", function(){
            let words_storage = sessionStorage.getItem('word_tags')
            if(words_storage != null && words_storage.length > 0){
                word_tags = words_storage.split(",");
                populate_word_cloud();
            }
            
            generate_trends();
        
            //engagement del perfil/tendencias
            generate_engagement(document);
        });
        
    }