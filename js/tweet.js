//Overwrite function
/*
function carga_config()
{
	fetch(config_file).then(function(response)
	{
		return response.json();
	}).then(function(json) {
		
		display_name = json.display_name;
		user_name = json.user_name;
		
		update_username(document);
		
		

		carga_tuits_drive();
	})
	.catch(function(error){console.log(error);});
}*/

//Overwrite function
function carga_tuits_drive()
{
	let url = window.location.href;
	url = url.split("#").slice(-1).toString();
	
	let tweets_storage = JSON.parse(sessionStorage.getItem('tweets_alt'))
	if(tweets_storage != null && tweets_storage.length > 0){
		tweets_alt = tweets_storage;
	}
	
	if(tweets.length > 0)
	{
		let tuit = getTweetById(tweets, url)
		carga_tuits(tuit[0]);
		document.getElementById("loading_block").remove();
	}else{
		let tweets_storage = JSON.parse(sessionStorage.getItem('tweets'))
		if(tweets_storage != null && tweets_storage.length > 0){
			tweets = tweets_storage;
			carga_tuits_drive();
		}else{		
			fetch(sheetURL).then(function(response)
			{
				return response.json();
			}).then(function(json) {
				tweets = json;
				
				carga_tuits_drive();
			})
			.catch(function(error){console.log(error);});
		}
	}
}
/*
function carga_tuits(file)
{
	//var modified;
	fetch(file).then(function(response)
	{
		//modified = response.headers.get('Last-Modified');
		return response.json();
	}).then(function(json) {
		let texto = json.texto;

		let all_blocks = document.getElementsByClassName("post_block");
		let plantilla = all_blocks[all_blocks.length-1];
		//let plantilla = orig.cloneNode(true);
		
		let identifier = file;
		if(identifier.includes("/"))
		{
			identifier = identifier.split("/").slice(-1).toString();
		}
		identifier = identifier.split(".")[0];
		plantilla.id = identifier;
		
		plantilla.href = "tweet.html#"+identifier;

		let tweet = plantilla.getElementsByClassName("tweet_content")[0];

		//replace endl with <br/> tag
		texto = texto.replace(/(?:\r\n|\r|\n)/g, "<br/>");
		tweet.innerHTML = texto;
		
		//images
		let image_block = plantilla.getElementsByClassName("tweet_images")[0];
		for(let i = 0; i < json.imagenes.length; i++)
		{
			let img = document.createElement("img");
			img.src = json.imagenes[i];
			image_block.appendChild(img);
		}
		
		generate_engagement(plantilla);
		
		//date
		let tweet_date = plantilla.getElementsByClassName("date")[0];
		tweet_date.innerHTML = json.fecha;
		format_date(plantilla)
		
		//insert tweet
		//let tl = document.getElementById("timeline");
		//tl.insertBefore(plantilla, tl.children[0]);
		
	})
	.catch(function(error){
		console.log(error);
	});

}*/
function carga_tuits(file)
{
	let texto = file.texto;

	let all_blocks = document.getElementsByClassName("post_block");
	let plantilla = all_blocks[all_blocks.length-1];
	
	let identifier = file.id;
	plantilla.id = identifier;	
	plantilla.href = "tweet#"+identifier;

	let tweet = plantilla.getElementsByClassName("tweet_content")[0];

	//replace endl with <br/> tag
	texto = texto.replace(/(?:\r\n|\r|\n)/g, "<br/>");
	tweet.innerHTML = texto;
	
	//quotes
	if(file.respuesta != null && (file.respuesta.length > 0 || typeof(file.respuesta) == "number"))
	{
		//console.log("file has response "+file.respuesta)
		let right_block = plantilla.getElementsByClassName("post_right_block")[0];
		let quote = plantilla.cloneNode(true);
		quote.id = file.respuesta;
		right_block.insertBefore(quote, plantilla.getElementsByClassName("footer_post")[0]);
		
		let found = getTweetById(tweets_alt, file.respuesta)
		if(found.length > 0)
		{
			format_quote(carga_tuits(found[0], true));
		}else
		{
			wait_for_quote(file.respuesta);
		}
	}
	
	//tags
	let tags = plantilla.getElementsByClassName("tweet_tags")[0];
	if(file.tags != null && (file.tags.length > 0))
	{
		let tag_list = document.createElement("p");
		tags.appendChild(tag_list);
		let tags_array = file.tags.replace(/\s/g, '').split(",");
		for(let i = 0; i < tags_array.length; i++)
		{
			let tag = document.createElement("a");
			tag.innerHTML = "#"+tags_array[i]+" ";
			tag.href = ".#"+tags_array[i];
			tag_list.appendChild(tag);
		}
	}
	
	//images
	let image_block = plantilla.getElementsByClassName("tweet_images")[0];
	let images_fix = file.imagenes.replace(/\s/g, '');
	let image_array = images_fix.split(",");
	
	for(let i = 0; i < image_array.length; i++)
	{
		let img = document.createElement("img");
		img.src = image_array[i];
		img.onclick=function() {window.open(image_array[i])};
		img.style="cursor: pointer";
		image_block.appendChild(img);
	}
	
	generate_engagement(plantilla);
	
	//date
	let tweet_date = plantilla.getElementsByClassName("date")[0];
	tweet_date.innerHTML = format_date(file.fecha);
	
	plantilla.style.display = "inherit";
	
	//insert tweet
	//let tl = document.getElementById("timeline");
	//tl.insertBefore(plantilla, tl.children[0]);
	
	return plantilla;
	
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

