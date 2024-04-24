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
	console.log(url)
	fetch(sheetURL).then(function(response)
	{
		return response.json();
	}).then(function(json) {
		tweets = json;
		console.log(tweets)
		let tuit = getTweetById(url)
		console.log(tuit[0])
		
		carga_tuits(tuit[0]);
	})
	.catch(function(error){console.log(error);});
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
	console.log(file)
	let texto = file.texto;

	let all_blocks = document.getElementsByClassName("post_block");
	let orig = all_blocks[all_blocks.length-1];
	let plantilla = orig.cloneNode(true);
	
	let identifier = file.id;
	plantilla.id = identifier;	
	plantilla.href = "tweet.html#"+identifier;

	let tweet = plantilla.getElementsByClassName("tweet_content")[0];

	console.log(texto)
	//replace endl with <br/> tag
	texto = texto.replace(/(?:\r\n|\r|\n)/g, "<br/>");
	tweet.innerHTML = texto;
	
	//images
	let image_block = plantilla.getElementsByClassName("tweet_images")[0];
	let images_fix = file.imagenes.replace(/\s/g, '');
	let image_array = images_fix.split(",");
	
	for(let i = 0; i < image_array.length; i++)
	{
		let img = document.createElement("img");
		img.src = image_array[i];
		image_block.appendChild(img);
	}
	
	generate_engagement(plantilla);
	
	//date
	let tweet_date = plantilla.getElementsByClassName("date")[0];
	tweet_date.innerHTML = file.fecha;
	format_date(plantilla)
	
	//insert tweet
	let tl = document.getElementById("timeline");
	tl.insertBefore(plantilla, tl.children[0]);
	
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

