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


function carga_tuits(file)
{
	fetch(file).then(function(response)
	{
		console.log(response)
		console.log(response.headers.get('Last-Modified'));
		return response.text();
	}).then(function(data) {
		let orig = document.getElementsByClassName("post_block")[0];
		let plantilla = orig.cloneNode(true);

		let tweet = plantilla.getElementsByClassName("tweet_content")[0];
		
		//replace endl with <br/> tag
		data = data.replace(/(?:\r\n|\r|\n)/g, "<br>");

		tweet.innerHTML = data;
		
		generate_engagement(plantilla);
		
		//insert tweet
		let tl = document.getElementById("timeline");
		tl.insertBefore(plantilla, tl.children[0]);
	})
	.catch(function(error){console.log(error);});

}


function carga_config()
{
	
	fetch(config_file).then(function(response)
	{
		console.log(response)
		return response.json();
	}).then(function(json) {
		console.log(json)
		
		display_name = json.display_name;
		user_name = json.user_name;
		
		update_username(document);
		
		for(let i in json.tweets)
		{
			console.log(json.tweets[i])
			carga_tuits(json.tweets[i])
		}
	})
	.catch(function(error){console.log(error);});
	
	/*
	let response = '{	"display_name":"Eris (cansada de vuestras mierdas)",	"user_name":"@ispor1",	"tweets":	[		"prueba.txt", "prueba2.txt"	]}';
	
	console.log(response)
	let json = JSON.parse(response);
	
	console.log(json)
	
	display_name = json.display_name;
	user_name = json.user_name;
	
	update_username(document);
	
	for(let i in json.tweets)
	{
		console.log(json.tweets[i])
		carga_tuits(json.tweets[i])
	}*/
}

function update_username(root_elm)
{
	//do someting
	console.log(user_name)
	console.log(display_name)
}


//Global variables
var user_name = "@erispor1";
var display_name = "Eris (esto es una prueba)";
var config_file = "config/config.json";

//Main execution cycle
window.onload = (event) =>
{
	
	//console.log("document.onload");
	carga_config();
	
	generate_trends();
	
	//WIP: hacer solo cuando hayan cargado los tweets
	generate_engagement(document);
}
