
$("input[type='checkbox']").change(function(){
	save_options();
});

$("select").change(function(){
	save_options();
});

$('input[type=text]').keyup(function(){
	save_options();
});

var settings=null;
chrome.storage.local.get("settings",function(data){
	if(data)
	{
		settings = data.settings;
	}
	else{
		default_options();
		console.log("Troubles Karl");
	}
});
var settingsInterval = setInterval(function(){
	console.log('settings interval');
	if(settings==null)
	{
		return;
	}
	clearInterval(settingsInterval);

	console.log(settings);

	$("#autoaccepttrade").prop("checked",settings.autoaccepttrade);
	$("#tryingFailWithdraw").prop("checked",settings.tryingFailWithdraw);
	$("#opskinsBtn").prop("checked",settings.opskinsBtn);
	$("#Key-analistic").val(settings.analistycKey);

},10)
// console.log(settings.autoaccepttrade);