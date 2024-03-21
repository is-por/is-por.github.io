function button_switcher(element)
{
	var pressed = element.classList.contains("pressed");	
	pressed ? element.classList.remove("pressed") : element.classList.add("pressed");
	pressed ? element.classList.add("not-pressed") : element.classList.remove("not-pressed");
	return !pressed;
}

function follow_button(element)
{
	var texts = element.getElementsByTagName("p");

	texts[0].innerHTML = button_switcher(element) ? "Seguir" : "Siguiendo";
}

function engagement_button(element)
{
	var texts = element.getElementsByClassName("engagement_number");

	var num = button_switcher(element) ? Number(texts[0].innerHTML) + 1 : Number(texts[0].innerHTML) - 1;
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


window.onload = (event) =>
{
	console.log("document.onload");
	var engagement_numbers = document.getElementsByClassName("engagement_number");
	
	for (let i in engagement_numbers)
	{
		engagement_numbers[i].innerHTML = format_number(randn_bm(0, 9999, 9));
	}
}



var base_url = "https://es.wikipedia.org/"; 
var url = base_url + "/w/api.php"; 
var params = {
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
    .then(function(response) {
		console.log(response);
        var randoms = response.query.random;
		var trend_fields = document.getElementsByClassName("wiki_article");
        for (var r in randoms) {
            console.log(randoms[r]);
			trend_fields[r].href = base_url+"?curid="+randoms[r].id;
			var article = trend_fields[r].getElementsByClassName("wiki");
			article[0].innerHTML = randoms[r].title;
        }
    })
    .catch(function(error){console.log(error);});
	
