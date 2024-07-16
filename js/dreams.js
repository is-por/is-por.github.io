//Override
function format_text(txt)
{	
	return txt;
}

//Override
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
		
		//carga_tuits_drive();

	})
	.catch(function(error){console.log(error);});
}

function carga_tuits_drive()
{	
	let spinner = document.getElementById("loading_block");
	spinner.style.display = "inherit";
	
	let password_block = document.getElementById("password");
	password_block.style.display = "none";
	
	let text_input = document.getElementById("password_text");
	fetch(sheetURL+"?tag=sueño"+"&pass="+text_input.value).then(function(response)
	{
		return response.json();
	}).then(function(json) {
		console.log(json)
		if(json.length == 0)
		{
			password_block.style.display = "inherit";
			spinner.style.display = "none";
		}else{
			tweets = json;
			
			load_all_tweets();
		}
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
		generate_trends();
	
		//engagement del perfil/tendencias
		generate_engagement(document);
	});
	
	const submit_button = document.getElementById("password_submit")
	submit_button.addEventListener('click', carga_tuits_drive);
	
	/*
	
	const form = document.getElementById("post_form")
    const submitButton = document.getElementById("submit_blorb")
  
    form.addEventListener('submit', e => {
	//e.preventDefault();
	  if (sheetURL == null ) return;
      submitButton.disabled = true
	  let text_input = form.getElementsByTagName("textarea")[0];
	  text_input.value = text_input.value.replace(/</g, "&lt;").replace(/>/g, "&gt;");
	  if(text_input.value[0] == '=') text_input.value = "'"+text_input.value;
      let requestBody = new FormData(form)
      fetch(sheetURL, { method: 'POST', body: requestBody})
        .then(response => {
           //alert('Success!', response)
           submitButton.disabled = false
          })
        .catch(error => {
        //alert('Error!', error.message)
        submitButton.disabled = false
		
  
        })
    })*/	
}

