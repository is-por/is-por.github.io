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
	
	let current_birthday = base_birthday + "-" + new Date(current_date).getFullYear();
	current_birthday = Date.parse(current_birthday);
	
	let diff = current_birthday - current_date;	
	if(diff < 0)
	{
		current_birthday = base_birthday + "-" + (new Date(current_date).getFullYear() + 1);
		current_birthday = Date.parse(current_birthday);
		diff = current_birthday - current_date;	
	}
	
	document.getElementById("birthday_count").innerHTML = Math.floor(diff / (1000 * 60 * 60 * 24));
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

		let tweet = plantilla.getElementsByClassName("tweet_content")[0];

		//replace endl with <br/> tag
		texto = texto.replace(/(?:\r\n|\r|\n)/g, "<br>");
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
	console.log("load_all_tweets "+index)
	load_all_tweets(tweets.length)
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
		/*
		for(let i in json.tweets)
		{
			carga_tuits(json.tweets[i])
		}
		*/
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
