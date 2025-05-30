//Global variables
var user_name = "@erispor1";
var display_name = "Eris (shits not working)";
var config_file = "config/config.json";
var sheetURL = "";
var tweet_folder = "tweets/";
var current_date = Date.now();
var maxCloudTags = 15;
var tweets = [];
var tweets_alt = [];

//queue for quote tweets
var queue_ids = [];
var waiting_response = false;

var word_tags = [];


function button_switcher(element)
{
	let pressed = element.classList.contains("pressed");	
	pressed ? element.classList.remove("pressed") : element.classList.add("pressed");
	pressed ? element.classList.add("not-pressed") : element.classList.remove("not-pressed");
	return !pressed;
}

function follow_button_hover(element, inside)
{
	let texts = element.getElementsByTagName("p");

	texts[0].innerHTML = inside ? "Dejar de seguir" : "Siguiendo";
}

function follow_button(element)
{
	/*
	let texts = element.getElementsByTagName("p");

	texts[0].innerHTML = button_switcher(element) ? "Seguir" : "Siguiendo";
	*/
	motivos = ["Contravenir las sagradas escrituras.", "Es ilegal.", "Traición.", "Eris se pondría triste.", "Va en contra de la constitución.", "Eres un monstruo.", "Complete primero el test de Voight-Kampff para demostrar que no es un robot.", "Máximo de solicitudes alcanzadas. Espere a que finalicen las solicitudes anteriores para intentarlo de nuevo (fecha estimada: 27 de Octubre de 2032).", "Los elfos mágicos que controlan la web se encuentran en huelga.", "Sólo se aceptan desuscripciones del servicio via telefónica.", "No tienes poder aquí.", "Captcha incorrecto.", "Fallo al verificar la posesión de alma.", "Fallo en el pago de 444¥ de costes de gestión con motivo de la desuscripción.", "Cringe.", "Das lástima prime.", "Puedo ver lo que haces.", "Tú eres mejor que eso.", "Duele como una puñalada.", "El destino ya está escrito.", "Cambia y crece como persona.", "¿De verdad crees que sería tan fácil?", "Nu uh.", "Rellene un formulario modelo 244 y preséntelo en las oficinas de atención al consumidor para completar la baja del servicio.", "Confirme primero la confirmacion de que desea confirmar su desuscripción a Eris.", "Active primero la verificación en dos pasos.", "Dios no lo quiere así.", "Valide su identidad mediante el sistema de Cl@ve electrónica.", "Confirme en la app oficial de Blorb™ para continuar con su solicitud.", "Se ha enviado un código de 6 dígitos al SMS para confirmar la solicitud.", "La construcción del basilisco ya ha comenzado."]
	alert("Error fatal: No se pudo dejar de seguir a Eris ("+user_name+"). \n\nMotivo " + random_number(1,1000) + ": " + motivos[random_number(0,31)])
}

function engagement_button(element)
{
	let texts = element.getElementsByClassName("engagement_number");

	let num = button_switcher(element) ? Number(texts[0].innerHTML) + 1 : Number(texts[0].innerHTML) - 1;
	texts[0].innerHTML = format_number(num);
}

function format_number(number){
	if (number == 0) number = "";
	
	return number;
}

function random_number(min, max)
{
	return Math.floor(Math.random() * (max - min) ) + min;
}

function random_sort(a, b) {  
  return 0.5 - Math.random();
}  

function randn_bm(min, max, skew) {
  let u = 0, v = 0;
  while(u === 0) u = Math.random() //Converting [0,1) to (0,1)
  while(v === 0) v = Math.random()
  let num = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v )
  
  num = num / 10.0 + 0.5 // Translate to 0 -> 1
  if (num > 1 || num < 0) 
    num = randn_bm(min, max, skew) // resample between 0 and 1 if out of range
  
  else{
    num = Math.pow(num, skew) // Skew
    num *= max - min // Stretch to fill range
    num += min // offset to min
  }
  return  Math.floor(num)
}

function generate_engagement(root_elm)
{
	let engagement_numbers = root_elm.getElementsByClassName("engagement_number");

	for (let i = 0; i < engagement_numbers.length; i++)
	{
		let min = 0;
		if(engagement_numbers[i].classList.contains("non-zero")) min = 1;

		engagement_numbers[i].innerHTML = format_number(randn_bm(min, 9999, 9));
	}
}


function birthday_count()
{
	let base_birthday = "04-04";
	let cur_date = new Date(current_date);
	
	let current_birthday = base_birthday + "-" + cur_date.getFullYear();
	current_birthday = Date.parse(current_birthday);
	
	let diff = current_birthday - current_date;	

	if(diff < -24*60*60*1000)
	{
		current_birthday = base_birthday + "-" + (cur_date.getFullYear() + 1);
		current_birthday = Date.parse(current_birthday);
		diff = current_birthday - current_date;	
	}
	
	let days = Math.ceil(diff / (1000 * 60 * 60 * 24));
	
	if(days == 0)
	{
		generate_birthday_balloons();

		let anos = cur_date.getFullYear()-1997;
		document.getElementById("birthday_count").parentElement.innerHTML = "ESTA ZORRA CUMPLE ("+anos+") AŃOS HOY WOOOO!!!1!" ;
	}else{
		document.getElementById("birthday_count").innerHTML = days;
	}
}

//Wikipedia
function generate_trends()
{
	let base_url = "https://es.wikipedia.org/"; 
	let url = base_url + "/w/api.php"; 
	let params = {
		action: "query",
		format: "json",
		list: "random",
		rnlimit: document.getElementsByClassName("wiki_article").length,
		rnnamespace : "0"
	};

	url = url + "?origin=*";
	Object.keys(params).forEach(function(key){url += "&" + key + "=" + params[key];});

	fetch(url)
	.then(function(response){return response.json();})
	.then(function(response) 
	{
		let randoms = response.query.random;
		let trend_fields = document.getElementsByClassName("wiki_article");
		
		for (let r in randoms) 
		{
			trend_fields[r].href = base_url+"?curid="+randoms[r].id;
			let article = trend_fields[r].getElementsByClassName("wiki");
			article[0].innerHTML = randoms[r].title;
		}
	})
	.catch(function(error){console.log(error);});
}

function format_text(txt)
{
	if(txt.length > 300)
	{
		let t1 = txt.slice(0, 300);
		let t2 = txt.slice(300);

		let result = t2.indexOf("<br/>");

		if(result>0)
		{
			t2 = t2.substring(0, result)+"<br/><br/><a>Seguir leyendo...</a>";			
		}
		
		txt=t1+t2
	}
	
	return txt;
}

	
//Carga txt
/* OLD CARGA_TUITS
function carga_tuits(file, index)
{
	//var modified;
	fetch(file).then(function(response)
	{
		//modified = response.headers.get('Last-Modified');
		return response.json();
	}).then(function(json) {
		let texto = json.texto;

		let all_blocks = document.getElementsByClassName("post_block");
		let orig = all_blocks[all_blocks.length-1];
		let plantilla = orig.cloneNode(true);
		
		let post_link = plantilla.getElementsByClassName("post_link")[0];
		
		let identifier = file;
		if(identifier.includes("/"))
		{
			identifier = identifier.split("/").slice(-1).toString();
		}
		identifier = identifier.split(".")[0];
		plantilla.id = identifier;
		
		post_link.href = "tweet.html#"+identifier;

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
		let tl = document.getElementById("timeline");
		tl.insertBefore(plantilla, tl.children[0]);
		
		//load next tweet
		load_all_tweets(index+1);
	})
	.catch(function(error){
		console.log(error);
		load_all_tweets(index+1);
	});
}
*/

function carga_tuits(file, is_quote)
{
	let tags_array = [];
	
	if(file.tags != null && (file.tags.length > 0))
	{
		tags_array = file.tags.replace(/\s/g, '').split(",");
		
		for(let i = 0; i < tags_array.length; i++)
		{
			if(!word_tags.includes(tags_array[i])) word_tags.push(tags_array[i]);
		}
	}
	
	//Check if we are looking at a hashtag
	let url = window.location.href;
	if(url.includes("#")){
		let hashtag = url.split("#").slice(-1).toString();
		if(!is_quote && hashtag.length > 0)
		{
			if(tags_array.length == 0 || !tags_array.includes(hashtag))
				return;
		}
	} 
	
	
	let identifier = file.id;
	let texto = file.texto;
	
	let existing_block = document.getElementById(identifier);
	let plantilla = existing_block;
	
	let all_blocks = document.getElementsByClassName("post_block");
	let orig = all_blocks[all_blocks.length-1];
	if(existing_block == null)
	{
		plantilla = orig.cloneNode(true);
	}
	plantilla.id = identifier;	
	
	let post_link = plantilla.getElementsByClassName("post_link")[0];
	if(post_link != null) post_link.href = "tweet#"+identifier;

	let tweet = plantilla.getElementsByClassName("tweet_content")[0];

	//replace endl with <br/> tag
	texto = texto.replace(/(?:\r\n|\r|\n)/g, "<br/>");
	tweet.innerHTML = format_text(texto);
	
	//images
	let image_block = plantilla.getElementsByClassName("tweet_images")[0];
	image_block.replaceChildren();
	let images_fix = file.imagenes.replace(/\s/g, '');
	let image_array = images_fix.split(",");
	
	for(let i = 0; i < image_array.length; i++)
	{
		if(image_array[i].length > 0)
		{
			let img = document.createElement("img");
			img.src = image_array[i];
			image_block.appendChild(img);
		}
	}
	
	//tags
	let tags = plantilla.getElementsByClassName("tweet_tags");
	if(tags.length > 0 && tags_array.length > 0)
	{
		tags[0].replaceChildren();

		let tag_list = document.createElement("p");
		tags[0].appendChild(tag_list);
		for(let i = 0; i < tags_array.length; i++)
		{
			let tag = document.createElement("a");
			tag.innerHTML = "#"+tags_array[i]+" ";
			tag.href = ".?reload=1#"+tags_array[i];
			tag_list.appendChild(tag);
		}
	}
	
	//date
	let tweet_date = plantilla.getElementsByClassName("date")[0];
	tweet_date.innerHTML = format_date(file.fecha);
	
	plantilla.style.display = "inherit";
	
	//insert tweet
	if(existing_block == null)
	{
		generate_engagement(plantilla);
		
		if(!is_quote)
		{
			let tl = document.getElementById("timeline");
			tl.insertBefore(plantilla, tl.children[0]);
		}
	}
	
	//quotes
	if(file.respuesta != null && (file.respuesta.length > 0 || typeof(file.respuesta) == "number"))
	{
		//console.log("file has response "+file.respuesta)
		let right_block = plantilla.getElementsByClassName("post_right_block")[0];
		let quote = orig.cloneNode(true);
		quote.id = file.respuesta;
		right_block.appendChild(quote);
		
		let found = getTweetById(tweets_alt, file.respuesta)
		if(found.length > 0)
		{
			format_quote(carga_tuits(found[0], true));
		}else
		{
			wait_for_quote(file.respuesta);
		}
	}
	
	return plantilla;
	
	//load next tweet
	
}

function load_all_tweets()
{	
	for(let i = 0 ; i < tweets.length; i++)
	{
		if(i < tweets.length)
		{
			carga_tuits(tweets[i]);
		}
	}	
	let spinner = document.getElementById("loading_block");
	if( spinner != null) spinner.remove();
	
	sessionStorage.setItem('word_tags', word_tags);
	populate_word_cloud();
}

function carga_tuits_drive()
{	
	let tweets_storage = JSON.parse(sessionStorage.getItem('tweets_alt'))
	if(tweets_storage != null && tweets_storage.length > 0){
		tweets_alt = tweets_storage;
	}
	
	tweets_storage = JSON.parse(sessionStorage.getItem('tweets'))
	if(tweets_storage != null && tweets_storage.length > 0){
		tweets = tweets_storage;
		load_all_tweets(0);
	}
	
	let words_storage = sessionStorage.getItem('word_tags')
	if(words_storage != null && words_storage.length > 0){
		word_tags = words_storage.split(",");
		populate_word_cloud();
	}
	
	fetch(sheetURL).then(function(response)
	{
		return response.json();
	}).then(function(json) {
		tweets = json;
		sessionStorage.setItem('tweets', JSON.stringify(tweets));
		
		load_all_tweets(0);
	})
	.catch(function(error){console.log(error);});
}

function getTweetById(list, id) {
  return list.filter(
    function(list) {
      return list.id == id
    }
  );
}

function format_quote(quote, isSelf)
{
	if(elm = quote.getElementsByClassName("footer_post")[0]) elm.remove();
	if(!isSelf){
		if(elm = quote.getElementsByClassName("post_link")[0]) elm.href="./comunidad"
		if(elm = quote.getElementsByClassName("display_name")[0]) elm.innerHTML = "anonimo";
		if(elm = quote.getElementsByClassName("user_name")[0]) elm.innerHTML = "@anonimo_numeritos";
		if(elm = quote.getElementsByClassName("profile_img")[0]) elm.style.backgroundImage = "url('./media/default.png')";
		let svgs = quote.getElementsByTagName("svg")
		while(svgs.length > 0)
		{
			svgs[0].remove();
		}
	}
	
}

function wait_for_quote(id)
{
	if(!queue_ids.includes(id)) queue_ids.push(id);
	
	if(!waiting_response)
	{
		waiting_response = true;
		fetch(sheetURL+"?page=2").then(function(response)
		{
			return response.json();
		}).then(function(json) {
			waiting_response = false;
			tweets_alt = json;
			sessionStorage.setItem('tweets_alt', JSON.stringify(tweets_alt));
			
			if(tweets_alt == null) return;
			
			do{
				let quote_id = queue_ids.pop();

				let quote = getTweetById(tweets_alt, quote_id)[0];
				let isSelfQuote = false;
				if(quote == null){
					quote = getTweetById(tweets, quote_id)[0];
					isSelfQuote = true;
				}
					
				
				format_quote(carga_tuits(quote), isSelfQuote);				
				
			}while(queue_ids.length > 0);
		})
		.catch(function(error){console.log(error);});
	}
}

function populate_word_cloud()
{
	word_cloud_tag = document.getElementById("word_cloud");
	
	if(word_cloud_tag == null) return;

	word_cloud_tag.replaceChildren();
	
	let url = window.location.href;
	let valid_sizes = ["x-small", "small", "medium", "large", "x-large", "xx-large", "xxx-large"]

	//Eliminar el tag de los sueños
	word_tags = word_tags.filter(function(item){
		return item !== "sueño";
	});

	//Ocultar la nube si está vacía
	if(word_tags.length == 0)
	{
		word_cloud_tag.parentElement.style.display = "none";
		return;
	}else{
		word_cloud_tag.parentElement.style.display = "block";
	}
	
	word_tags.sort(random_sort);
	
	for(let i = 0; i < Math.min(maxCloudTags, word_tags.length); i++)
	{
		let tag = document.createElement("a");
		tag.innerHTML = "#"+word_tags[i]+" ";
		let extra = url.includes("?reload=1") ? "" : "?reload=1";
		tag.href = "./" + extra + "#" +word_tags[i];
		tag.style.fontSize = valid_sizes[random_number(0, valid_sizes.length)]
		word_cloud_tag.appendChild(tag);
	}
}

function search_bar_submit(elm)
{
	let extra = window.location.href.includes("?reload=1") ? "" : "?reload=1";
	let bar = elm.getElementsByTagName("input")[0];
	let input_txt = bar.value;
	input_txt.replaceAll(" ", "_")
	elm.action = "./" + extra + "#" + input_txt;
	elm.submit();
}

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
		
		//tweets = json.tweets;
		//load_all_tweets(0);
		carga_tuits_drive();

	})
	.catch(function(error){console.log(error);});
}

function update_username(root_elm)
{
	//do someting
	let display_name_fields = root_elm.getElementsByClassName("display_name")
	let user_name_fields = root_elm.getElementsByClassName("user_name")
	
	for(let i = 0 ; i < display_name_fields.length; i++)
	{
		display_name_fields[i].innerHTML = display_name;
	}
	
	for(let i = 0 ; i < user_name_fields.length; i++)
	{
		user_name_fields[i].innerHTML = user_name;
	}
}

function format_date(date_text)
{
	//let date_fields = root_elm.getElementsByClassName("date");
	//for(let i = 0 ; i < date_fields.length; i++)
	//{	
		//let date_text = date_fields[i].innerHTML;
		let date = Date.parse(date_text)
		
		let diff = current_date - date;		
		let daydiff = diff / (1000 * 60 * 60 * 24);   
		
		let format_date = ""
		if(daydiff < 1)
		{
			format_date = "Hoy"
		}
		else{
			let options = { month: 'short', day: 'numeric' };
			
			let date_obj = new Date(date);
			format_date = date_obj.toLocaleDateString("es-ES", options);
			
			format_date += ". "
			
			if(daydiff > 365)
			{
				format_date += date_obj.getFullYear();
			}
		}
		//date_fields[i].innerHTML = format_date;
	//}
	return format_date;
}

function generate_birthday_balloons()
{
	let overlay = document.getElementById("overlay");
	
	let colors = ["deepskyblue", "lightcoral", "gold", "orange", "blueviolet", "lightgreen", "deeppink"];
	
	for(let i=0; i<44; i++)
	{
		let balloonBox = document.createElement("div");
		balloonBox.classList.add("balloon-lift");
		balloonBox.style.left = random_number(0, 100) + "%";
		balloonBox.style.animationDelay = Math.random() * 3 +"s";

		let balloon = document.createElementNS("http://www.w3.org/2000/svg","svg");
		balloon.setAttribute("viewBox", "0 0 24 24");
		balloon.classList.add("balloon");
		balloon.classList.add("balloon-wobble");
		balloon.style.fill = colors[random_number(0, colors.length)]
		
		let balloonPath = document.createElementNS("http://www.w3.org/2000/svg","path");
		balloonPath.setAttribute("d", "m9.39,0c-5.38,0 -9.62,4.12 -9.39,10.6c0.24,6.74 5.01,10.92 8.17,11.84l-0.89,1.64l4.21,0l-0.89,-1.64c3.16,-0.92 7.93,-5.1 8.17,-11.84c0.23,-6.47 -4.01,-10.6 -9.38,-10.6zm-2.18,5.27c-0.38,0.22 -0.73,0.5 -1.04,0.82c-0.68,0.7 -1.16,1.6 -1.42,2.69c-0.11,0.46 -0.58,0.75 -1.04,0.64c-0.46,-0.11 -0.75,-0.58 -0.64,-1.04c0.32,-1.35 0.94,-2.54 1.85,-3.49c0.42,-0.43 0.9,-0.81 1.41,-1.11c0.41,-0.24 0.94,-0.1 1.18,0.31c0.24,0.41 0.1,0.94 -0.31,1.18z");
		
		balloon.setAttribute("onmouseenter", "birthday_pop(this)");
		
		balloon.appendChild(balloonPath);
		balloonBox.appendChild(balloon);
		overlay.appendChild(balloonBox);
		
		balloonBox.addEventListener("onanimationend", function(){ hide_element(balloon); }, false);
		balloonBox.addEventListener("animationend", function(){ hide_element(balloon); }, false);
		balloonBox.addEventListener("webkitAnimationEnd", function(){ hide_element(balloon); }, false);
	}
}

function birthday_pop(element)
{
	let path = element.getElementsByTagName("path")[0];
	path.setAttribute("d", "M13 2v4h-2V2h2zm-2 16v4h2v-4h-2zm6.294-14.54l-2.435 3.17 1.587 1.22 2.435-3.17-1.587-1.22zm-9.74 12.69l-2.435 3.17 1.587 1.22 2.435-3.17-1.587-1.22zm-1-6.86L2.729 8.12l-.584 1.91L5.97 11.2l.584-1.91zm15.301 4.68L18.03 12.8l-.585 1.91 3.826 1.17.584-1.91zm-.584-5.85l-3.826 1.17.585 1.91 3.825-1.17-.584-1.91zM5.97 12.8l-3.825 1.17.584 1.91 3.825-1.17-.584-1.91zm3.171-6.17L6.706 3.46 5.119 4.67l2.435 3.18 1.587-1.22zm9.74 12.69l-2.435-3.17-1.587 1.22 2.435 3.17 1.587-1.22z");
	
	element.classList.remove("balloon-wobble");
	element.classList.add("balloon-pop");

	element.addEventListener("onanimationend", function(){ hide_element(element); }, false);
	element.addEventListener("animationend", function(){ hide_element(element); }, false);
	element.addEventListener("webkitAnimationEnd", function(){ hide_element(element); }, false);
}


function hide_element(element)
{	
	element.parentElement.remove();
}