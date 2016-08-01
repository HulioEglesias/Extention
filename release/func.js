function default_options(){
	var settings = {
		autoaccepttrade: true,
		tryingFailWithdraw: true,
		opskinsBtn: true,
		opskinsBtnTypeGet : "insert",
		isSound: true
	};

	chrome.storage.local.set({'settings':settings},function(){});
}

function load_options(){
chrome.storage.local.get("settings",function(data){
	if(data)
	{
		settings = data.settings;
	}
	else{
		default_options();
	}
	return settings;
});
}

function save_options(){

	var autoaccepttrade = $("#autoaccepttrade").is(":checked");
	var tryingFailWithdraw = $("#tryingFailWithdraw").is(":checked");
	var isSoundCh = $('#KillExtentionSound').is(":checked");
	var opskinsBtn = $("#opskinsBtn").is(":checked");
	var analistycKey = $('#Key-analistic').val();

	var settings = {
		autoaccepttrade: autoaccepttrade,
		tryingFailWithdraw: tryingFailWithdraw,
		opskinsBtn: opskinsBtn,
		analistycKey: analistycKey,
		isSound: isSoundCh
	};

	chrome.storage.local.set({'settings':settings},function(){});
}

$('.saveSettingButton').click(function(){
	save_options();
	console.log('save');
});

function async_worker(callback){
	var intervalID = setInterval(function(){
		console.log('async_worker interval');
	if(isEndGettingSettings){
		clearInterval(intervalID);
		callback();	
	}
}, 500);

}
