//Global variables
var user_name = "@erispor1";
var display_name = "Eris (shits not working)";
var config_file = "config/config.json";
var current_date = Date.now();
var tweets = [];


function button_switcher(element)
{
	let pressed = element.classList.contains("pressed");	
	pressed ? element.classList.remove("pressed") : element.classList.add("pressed");
	pressed ? element.classList.add("not-pressed") : element.classList.remove("not-pressed");
	return !pressed;
}

function follow_button(element)
{
	let texts = element.getElementsByTagName("p");

	texts[0].innerHTML = button_switcher(element) ? "Seguir" : "Siguiendo";
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

	
//Carga txt


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
		
		let identifier = file;
		if(identifier.includes("/"))
		{
			identifier = identifier.split("/").slice(-1).toString();
		}
		identifier = identifier.split(".")[0];
		plantilla.id = identifier;

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

function load_all_tweets(index)
{
	//load one tweet at a time to ensure correct order
	if(index < tweets.length)
	{
		carga_tuits(tweets[index], index)
	}
}


function carga_config()
{
	fetch(config_file).then(function(response)
	{
		return response.json();
	}).then(function(json) {
		
		display_name = json.display_name;
		user_name = json.user_name;
		
		update_username(document);
		
		tweets = json.tweets;
		
		load_all_tweets(0);

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

function format_date(root_elm)
{
	let date_fields = root_elm.getElementsByClassName("date");
	for(let i = 0 ; i < date_fields.length; i++)
	{	
		let date_text = date_fields[i].innerHTML;
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
		date_fields[i].innerHTML = format_date;
	}
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