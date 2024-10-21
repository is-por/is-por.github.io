var downloads_file = "config/downloads.json";
var downloads = [];

function carga_downloads()
{
	fetch(downloads_file).then(function(response)
	{
		return response.json();
	}).then(function(json) {
		
		downloads = json.downloads;
		
		let downloads_block = document.getElementById("downloads_block");
		let orig = downloads_block.getElementsByClassName("download_item")[0];
		if(orig == null)
		{
			console.log("Can't populate downloads. Missing template")
			return;
		}	
		
		for(let i = 0; i < downloads.length; i++)
		{
			let template = orig.cloneNode(true);
			
			let dwn_name = downloads[i].name;
			let dwn_path = downloads[i].path;
			let dwn_img = downloads[i].image;
			
			template.getElementsByClassName("download_title")[0].innerHTML = dwn_name;
			
			template.style.backgroundImage = "url('"+ dwn_img +"')";
			template.style.display = "";
			
			template.onclick = function(){window.open(dwn_path);}
			
			
			
			downloads_block.appendChild(template);
		}

	})
	.catch(function(error){console.log(error);});
}

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
	
	carga_downloads();
	
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

