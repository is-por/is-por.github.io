//Override
function carga_config()
{
	fetch(config_file).then(function(response)
	{
		return response.json();
	}).then(function(json) {
		
		display_name = "anonimo";
		user_name = "@anonimo_numeritos";
		sheetURL = json.sheet_url;
		
		update_username(document);

		carga_tuits_drive(true);
	})
	.catch(function(error){console.log(error);});
}

function carga_tuits_drive()
{	
	fetch(sheetURL+"?page=2").then(function(response)
	{
		return response.json();
	}).then(function(json) {
		tweets = json;
		
		load_all_tweets();
	})
	.catch(function(error){console.log(error);});
}

//Main execution cycle
window.onload = (event) =>
{
	//console.log("document.onload");
	carga_config();
	
	format_date(document);
	
	$("#container_left").load("./left-menu.html"); 
	$("#container_right").load("./right-menu.html", function(){
		generate_trends();
	
		//engagement del perfil/tendencias
		generate_engagement(document);
	});
	
	const form = document.getElementById("post_form")
    const submitButton = document.getElementById("submit_blorb")
  
    form.addEventListener('submit', e => {
	//e.preventDefault();
	  if (sheetURL == null ) return;
      submitButton.disabled = true
	  let text_input = form.getElementByTagName("textarea");
	  text_input.value = text_input.value.replace(/</g, "&lt;").replace(/>/g, "&gt;");
	  if(text_input.value[0] == '=') = "'"+text_input.value;
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
    })
	
}

