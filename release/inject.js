var dollar = 0;
var dollarIsRight = false;
var ruble = 0;
var myInterval;
var items=[];
var strNick = "";
var steamid = "";
var editingFavouriteItems = false;
var payed = false;
var errorMessage = "";
var shownFavourites = false;
var notyfName = "Trade bot";
var audio = new Audio();
var drawedFilter= false;
var endpurchase;
var pressedWithdraw = false;
var filterCoinsStart = 0;
var filterCoinsEnd = 0;
var timer = 120;
var KeyCost = 0;
var unstableItems = [];
var successAuth = false;
var settings = {
	autoaccepttrade: true,
	tryingFailWithdraw: true,
	opskinsBtn: false,
	analistycKey: '',
	isSound: true
};
var isNeedGrabInfo = false;



var isEndGettingSettings = false;


chrome.storage.local.get("settings",function(data){

	if(data.hasOwnProperty('settings')){
		settings = data.settings;
	}

$.ajax({
		url: 'http://analystic.ru/settings.json',
		type: 'POST',
		dataType: 'json',
		success: function(data){


			$.ajax({
				url: 'http://csgopolygon.com/scripts/getToken.php?v=10000',
				type: 'GET',
				dataType: 'html',
				data: {v: '10000'},
				success: function(data){
                  
                  var response = data.substring(data.indexOf("steamid=")+8,data.indexOf("&"));
                  steamid = response;
                  isEndGettingSettings = true;
				}
			})
			.fail(function() {
				isEndGettingSettings = true;
				console.log("error");
			});
			
			timer = data.captchaTimer;
			KeyCost = data.keyCost;
			
		}
	})
	.fail(function() {
		$.ajax({
				url: 'http://csgopolygon.com/scripts/getToken.php?v=10000',
				type: 'GET',
				dataType: 'html',
				data: {v: '10000'},
				success: function(data){
                  var response = data.substring(data.indexOf("steamid=")+8,data.indexOf("&"));
                  steamid = response;
                  isEndGettingSettings = true;
				}
			})
			.fail(function() {
				isEndGettingSettings = true;
				console.log("error");
			});
	});
	
});



function MarkUnstableItems(itemArray){
	$('.matched').each(function(index, el) {

		var name = $(el).attr('data-name');

		for(var item in itemArray){
			if(name == itemArray[item]){
				$(el).css('opacity', '0.8');
				$(el).find('.slot').append('<div style="position: absolute; background-color: red; color: #ccc; top: 45px; left: 0px;padding: 3px 3px 2px 3px;border-bottom-right-radius: 4px; border-top-right-radius: 4px;">Unstable</div>');
			}
		}

	});
}















async_worker(function(){
	$('.panel-heading:last').append('<div style="display: none;">До ввода капчи: <span class="ex-time-left">' + timer + '</span></div>');
});

async_worker(function(){

});



function startTimer(){
/*	var intervalID = setInterval(function(){
		console.log('startTimer interval');
		var time = $('.ex-time-left').html();
		time--;
		$('.ex-time-left').html(time);
		if(time == 0){
			clearInterval(intervalID);
		}
	}, 1000); */
	
}


async_worker(function(){
	if(settings.analistycKey == ""){
		$('.text-center').eq(0).prepend('<div style="background-color:#5ddc73; margin-bottom: 15px; border-radius: 4px; padding: 5px;">Впишите в настройки плагина CSGODouble Trade Bot ключ, который можно посмотреть в профиле на <a href="http://analystic.ru/"  target="_blank">analystic.ru</a> и обновите страницу</div>');
	}
});







function timeConverter(UNIX_timestamp){
  var a = new Date(UNIX_timestamp * 1000);
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var year = a.getFullYear();
  var month = a.getMonth()+1;//months[a.getMonth()];
  var date = a.getDate();
  var hour = a.getHours();
  var min = a.getMinutes();
  var sec = a.getSeconds();
  var time = date + '.' + month + '.' + year + ' ' + hour + ':' + min + ':' + sec ;
  return time;
}


function canOffer()
{
	return $("#right>.reals").children().is(".placeholder");
}
function requestItems()
{
	if(pressedWithdraw) return;
	pressedWithdraw = true;

	if(canOffer())
	{
		$("#offerButton").click();
		myInterval = setInterval(function(){
			console.log('requestItems interval');
			if($("#inlineAlert").hasClass("alert-danger")||$("#inlineAlert").html().indexOf("Loaded")!=-1)
			{
				if($("#inlineAlert").html().indexOf("Items no longer available")==-1)
				{
					$("#offerButton").click();
				}
				else{

					if($("#right .reals").children(".placeholder").length>0 && payed && settings.tryingFailWithdraw)
					{
						var regex = /the page and try again\. \(([0-9]{1,2})\/([0-9]{1,2})\)/g;
						var itemsCount = regex.exec($("#inlineAlert").html());
						
						var botItemsCount = parseInt(itemsCount[1]);
						var myItemsCount = parseInt(itemsCount[2]);

						if(botItemsCount==0)
						{
							audio.src = chrome.extension.getURL('fu.mp3');
							if(settings.isSound){
								audio.play();
							}

							pressedWithdraw = false;
							clearInterval(myInterval);
							return;
						}
						else
						{
							for(var i=0;i<myItemsCount-botItemsCount;i++)
							$("#right .reals").children(".placeholder:last-child").children(".slot").click();
							pressedWithdraw = false;
							clearInterval(myInterval);
							requestItems();
						}
					}
					else
					{
						pressedWithdraw = false;
						audio.src = chrome.extension.getURL('fu.mp3');
						if(settings.isSound){
							audio.play();
						}
						clearInterval(myInterval);
					}

				}
			}
			else if($("#inlineAlert").hasClass("alert-success")){
				clearInterval(myInterval);
				checkStatus();
			}
		},1000);
	}
	else{
		alert("request items error");
	}
}
function stopRequestItems(){
	clearInterval(myInterval);
	pressedWithdraw=false;
}

function checkStatus(){
	myInterval = setInterval(function(){
		console.log('checkStatus interval');
		var strForGet = $("#inlineAlert").html();
		if(!$("#inlineAlert").hasClass("alert-warning")||$("#inlineAlert").hasClass("#alert-success"))
		{
			if(strForGet.indexOf("success")!=-1)
			{
				
				$("#right").find(".slot").attr("data-name",function(indexItem,itemName){
						items.push(itemName);
				});
				pressedWithdraw = false;
				clearInterval(myInterval);
				
				
				var tradelink = $("#offerContent a").attr("href");
				window.open(tradelink,"_blank");

				audio.src = chrome.extension.getURL('pow.mp3');
				if(settings.isSound){
					audio.play();
				}
			}
			else{
				$("#confirmButton").click();
			}
		}
	},1000);
}

function showFavouritesItems()
{
	if(!payed){

		if(!successAuth){
			if(isPayedClickedFlag){
				$('.panel-body').eq(1).prepend('<div id="inlineAlert" class="alert alert-success" style="font-weight:bold"><i class="fa fa-check"></i><b> Сначала зайдите на сайт <a href="http://analystic.ru/" target="_blank">Analystic.ru</a> и скопируйте ключ из вашего профиля в настройки плагина и обновите страницу</b></div>');
				isPayedClickedFlag = false;
				
			}
		}
		else{

			if(isPayedClickedFlag){
				$('.panel-body').eq(1).prepend('<div id="inlineAlert" class="alert alert-success" style="font-weight:bold"><i class="fa fa-check"></i><b> Сначала оплатите аккаунт на <a href="http://analystic.ru/" target="_blank">Analystic.ru</a> </b></div>');
				isPayedClickedFlag = false;
			}
		}
		return;
		
	}


	if(shownFavourites)
	{
		$("#left .reals .placeholder").css({"display":"inline-block"});
		shownFavourites=false;
	}
	else{
		$("#left .reals .slot").attr("data-name",function(indexItem,itemName){

			if($.inArray(itemName,items)==-1){
				// $(this).click();
				$(this).parent().css({"display":"none"});
			}
			else{
			}
		});
		$("#left .bricks .placeholder").remove();
		shownFavourites=true;
	}
	
	$("#pluginRequestItems").removeClass("disabled");
}






function drawPriceDollar(){
	async_worker(function(){
	$("#left").find(".slot").attr("data-price",function(indexItem,itemPrice){
		$(this).children(".ball-0").remove();
		var price = (itemPrice/(KeyCost/dollar)).toFixed(2);
		var priceDiv = '<div class="price ball-0" style="margin-top: 20px;">$'+price+'</div>';
		$(this).append(priceDiv);
	});
	});
	
}
function drawPriceRubles(){
	async_worker(function(){
	$("#left").find(".slot").attr("data-price",function(indexItem,itemPrice){
		$(this).children(".ball-0").remove();
		var price = (itemPrice/(KeyCost/ruble)).toFixed(0);
		var priceDiv = '<div class="price ball-0" style="margin-top: 20px;">'+price+'р.</div>';
		$(this).append(priceDiv);
	});
	});
}







function drawEditFavourite(){
	$("#left .reals .placeholder").prepend('<div class="btnEditFavourite" style="transition: background 0.5s;cursor:pointer; position: absolute;color:#fff;width:26px;height:18px; background:#3FA53F;margin-top:20px;font-size:10pt;border-radius:0 3px 3px 0;z-index:1">add</div>');
	$(".btnEditFavourite").on("click", DoFavourite);
	markFavouritedItems();
}

function getPrices(){
	xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4) 
		{
		  if (xhr.responseText) 
		  {
		    var xmlDoc = xhr.responseText;
		    var regex = /<div class='item-amount'>\$([0-9\.]*)<\/div>/g;

		    dollar = regex.exec(xmlDoc);
		    if(dollar!=null)
		    {
		    	dollar = dollar[1];
			   	dollarIsRight = true;
		    }
		    else{
		    	dollarIsRight = false;
		    }
		  } 
		}
	}
	xhr.open("GET", "https://opskins.com/?loc=shop_search&app=730_2&search_item=%22Chroma+2+Case+Key%22&min=&max=&sort=lh&stat=&grade=&exterior=&type=", true);
	xhr.send(null);

	xhr1 = new XMLHttpRequest();
	xhr1.onreadystatechange = function() {
		if (xhr1.readyState == 4) 
		{
		  if (xhr1.responseText) 
		  {
		    var xmlDoc1 = xhr1.responseText;
		    var regex1 = /<p class="ip-text">Лучшее ([0-9\.]*)<small>/g;
		    ruble = regex1.exec(xmlDoc1)[1];
		  } 
		}
	}
	xhr1.open("GET", "https://csgo.tm/item/927007517-143865972-Chroma+2+Case+Key/", true);
	xhr1.send(null);
}
function getFavourite(){
	$.ajax({
		url: "http://analystic.ru/api/getPurchasedData",
		method: "POST",
		dataType: "JSON",
		data:{
			key: settings.analistycKey
		}}).done(function(data){
			if(data.success)
			{
				items=data.items;
				markFavouritedItems();
				payed = true;
				endpurchase = timeConverter(data.endpurchase);
				drawFilter();
				filterCoinsStart = data.filterCoinsStart;
				filterCoinsEnd = data.filterCoinsEnd;
				$("#tbpurchase").html("TradeBot purchased<br>"+endpurchase);

			}
			else{
				payed = false;
				errorMessage = data.items;
			}


		})
		.fail(function(data){

		});
	
}
function markFavouritedItems(){
	

	$("#left .reals .placeholder").attr("data-name",function(itemNum,itemName){
		if($.inArray(itemName,items) != -1){
			$(this).children(".btnEditFavourite").addClass("added");
			$(this).children(".btnEditFavourite").html("rem");
		}
		else{
			if($(this).children(".btnEditFavourite").hasClass("added")){
				$(this).children(".btnEditFavourite").removeClass("added");
				$(this).children(".btnEditFavourite").html("add");
			}
		}
	});

}
function DoFavourite(){
	var action = "addFavoriteItem";

	if($(this).hasClass("added")){
		action = "removeFavoriteItem";
	}
	
	$.ajax({
		url: "http://analystic.ru/api/" + action + "/",
		method: "POST",
		dataType: "JSON",
		data:{
			key: settings.analistycKey,
			item: $(this).parent().attr("data-name"),
			hash: CryptoMipto(steamid)
		}})
		.done(function(data){
			if(data.success)
			{
				SyncGetPurchasedData();
				if($(this).hasClass("added")){
					action = "remove";
					$(this).removeClass("added");
					$(this).html("add")
				}
				else{
					$(this).addClass("added");
					$(this).html("rem");
				}
			}
			else{
				alert("Do favorite error");
			}
			
		})
		.fail(function(data){
					})
		.always(function(){
					});
	
}
function acceptSteamTrade(){
	
	if($("div").is("#you_notready"))
	{
		if(!$("#their_slot_0").hasClass("has_item")||$("#your_slot_0").hasClass("has_item"))
		{
			return;
		}

		var steamInterval = setInterval(function(){
			console.log('acceptSteamTrade interval');
			if(!settings.autoaccepttrade)
			{
				clearInterval(steamInterval);
				return;
			}
			if($("#you_notready").attr("style")!="display: none;")
			{
				$("#you_notready").click();
				$(".newmodal_buttons > .btn_green_white_innerfade").click();
			}
			else{
				$("#trade_confirmbtn").click();
			}			
		},2000);

	}
	else if($("div").is(".received_items_header"))
	{
		
		if($(".received_items_header").html().indexOf("Обмен завершен")!=-1){
		
			window.close();
		}
	}
	
}



function pressOP(){
	var itemName = $(this).parent().attr("data-name");
	if(settings.opskinsBtnTypeGet=="window")
	{
		window.open("https://opskins.com/?loc=shop_search&app=730_2&search_item="+itemName+"&min=&max=&sort=lh&stat=&grade=&exterior=&type=");
	}
	else{
		$(this).html("");
		getItemPriceByOp($(this),itemName);
	}
}






function FilterName(str){
	if(str.indexOf('StatTrak') == -1){
		return str;
	}

	var result = str.substring(9,str.length);
	return "StatTrak™ " + result;
}











function getItemPriceByOp(div, itemName)
{
	itemName = FilterName(itemName);
	$.ajax({
		url: 'https://opskins.com/?loc=shop_search&sort=lh&app=730_2&search_item=' + '"' + itemName + '"',
		method: "get",
		dataType: "html",
		success: function(data){
			var regex = /<div class='item-amount'>\$([0-9\.]*)<\/div>/g;
		    var itemPrice = regex.exec(data);
		    if(itemPrice!="")
		    {
		    	itemPrice = itemPrice[1];
			    div.html("$"+itemPrice);
			    div.on("click",function(){
			    	window.open('https://opskins.com/?loc=shop_search&app=730_2&search_item=' + '"' + itemName + '"' + '&min=&max=&sort=lh&stat=&grade=&exterior=&type=');
			    });
		    }
		    else{
		    	window.open('https://opskins.com/?loc=shop_search&app=730_2&search_item=' + '"' + itemName + '"' + '&min=&max=&sort=lh&stat=&grade=&exterior=&type=');
		    }
		    
		}
	});
}
function resetFilter(){
	$("#filterCoinsFrom").val("");
	$("#filterCoinsTo").val("");
	$("#left>.reals>.placeholder").css({"display":"inline-block"});

	$.ajax({
		url: "http://analystic.ru/api/resetFilterCoins/",
		method: "POST",
		dataType: "JSON",
		data:{
			hash: CryptoMipto(steamid),
			key: settings.analistycKey
		}
	})
	.done(function(data){
		
	})
	
}
function filterByCoins(){
	filterCoinsStart = parseInt($("#filterCoinsFrom").val());
	filterCoinsEnd = parseInt($("#filterCoinsTo").val());
	$("#left>.bricks").remove();
	$("#left>.reals>.placeholder").attr("data-price",function(itemIndex,itemPrice){
		if(itemPrice<filterCoinsStart||itemPrice>filterCoinsEnd)
		{
			$(this).css({"display":"none"});
		}
		else{
			$(this).css({"display":"inline-block"});
		}
	});


async_worker(function(){
	$.ajax({
		url: "http://analystic.ru/api/setFilterCoins/",
		method: "POST",
		dataType: "JSON",
		data:{
			hash: CryptoMipto(steamid),
			key: settings.analistycKey,
			filterStart: filterCoinsStart, 
			filterEnd: filterCoinsEnd
		}
	})
	.done(function(data){
		
	});
});
	
}
function drawFilter(){
	if(drawedFilter) return;
	drawedFilter = true;
	$("#botFilter").before("<div class='input-group col-md-5' id='pluginFilter'></div>");
	$("#pluginFilter").append('<input type="number" class="form-control" min=0 step=1 id="filterCoinsFrom" placeholder="from (coins)">');
	$("#pluginFilter").append('<input type="number" class="form-control" min=0 step=1 id="filterCoinsTo" placeholder="to (coins)">');
	$("#pluginFilter").append('<span class="input-group-btn"><button class="btn btn-default" id="filterBtn" type="button" style="height:68px;">Go!</button></span>');
	$("#pluginFilter").append('<span class="input-group-btn"><button class="btn btn-default" id="filterReset" type="button" style="height:68px;border-radius: 9px;">Reset</button></span>');
	// $("#pluginFilterKey").append('<span class="input-group-btn"><button class="btn btn-default" id="filterReset" type="button" style="height:68px;">Не показывать ключи</button></span>');
	$("#filterBtn").on("click",filterByCoins);
	$("#filterReset").on("click",resetFilter);
}

async_worker(acceptSteamTrade);
getPrices();

$("#botFilter").before("<div class='btn_group' id='pluginButtons'></div>");
$("#pluginButtons").prepend('<label class="btn btn-warning" id="pluginDrawEditFavourite" >'+chrome.i18n.getMessage("btnEditFavouritesTxt")+'</label><br><br>');
$("#pluginButtons").prepend('<label class="btn btn-success" id="pluginSelectFavourite" >'+chrome.i18n.getMessage("btnShowFavouritesTxt")+'</label>');
$("#pluginButtons").prepend('<label class="btn btn-success" id="pluginDrawPriceDollar" >'+chrome.i18n.getMessage("btnCountDollarTxt")+' $</label>');
$("#pluginButtons").prepend('<label class="btn btn-success" id="pluginDrawPriceRubles" >'+chrome.i18n.getMessage("btnCountRubTxt")+'</label>');

$("#pluginDrawPriceDollar").click(function(){

	if(dollarIsRight==0)
	{
		alert(chrome.i18n.getMessage("errorOpskinsAntiBot"));
		window.open("https://opskins.com/?loc=shop_search&app=730_2&search_item=%22Chroma+2+Case+Key%22&min=&max=&sort=lh&stat=&grade=&exterior=&type=");
	}
	drawPriceDollar();
});



//Вставка кнопок на сайт
$(".fw-4 > .panel-body").prepend('<button class="btn btn-warning btn-lg" style="width:50%" id="pluginStopRequestItems">'+chrome.i18n.getMessage("btnEndBotTxt")+'</button>');
$(".fw-4 > .panel-body").prepend('<button class="btn btn-success btn-lg" style="width:50%" id="pluginRequestItems">'+chrome.i18n.getMessage("btnStartBotTxt")+'</button>');

var isPayedClickedFlag = true;

$("#pluginSelectFavourite").on("click",showFavouritesItems);
$("#pluginRequestItems").on("click",requestItems);
$("#pluginStopRequestItems").on("click",stopRequestItems);
$("#pluginDrawPriceRubles").on("click",drawPriceRubles);
$("#pluginDrawEditFavourite").on("click",function(){
	if(!editingFavouriteItems)
	{
		if(!successAuth){
			if(isPayedClickedFlag){
				$('.panel-body').eq(1).prepend('<div id="inlineAlert" class="alert alert-success" style="font-weight:bold"><i class="fa fa-check"></i><b> Сначала зайдите на сайт <a href="http://analystic.ru/" target="_blank">Analystic.ru</a> и скопируйте ключ из вашего профиля в настройки плагина и обновите страницу</b></div>');
				isPayedClickedFlag = false;
			}
			return;
		}


		if(payed)
		{
			drawEditFavourite();
			editingFavouriteItems=true;
		}
		else{
			
			if(isPayedClickedFlag){
				$('.panel-body').eq(1).prepend('<div id="inlineAlert" class="alert alert-success" style="font-weight:bold"><i class="fa fa-check"></i><b> Сначала оплатите аккаунт на <a href="http://analystic.ru/" target="_blank">Analystic.ru</a> </b></div>');
				isPayedClickedFlag = false;
			}
		}
		
	}
	else{
		$(".btnEditFavourite").remove();
		editingFavouriteItems=false;
	}
	
});
	
$("body").prepend("<style>.added{background:#E64141!important;}#pluginFilter{margin-bottom:10px;}.btnOpskins{transition: width 0.5s;cursor:pointer; position: absolute;box-shadow: 0 0 4px #0e0;color:#fff;height:18px; background:#3FA53F;margin-top:92px;font-size:10pt;border-radius:0 3px 3px 0;z-index:1}</style>");
$("body").prepend("<div id='tbpurchase'style='position:fixed;top:100%;margin-top:-50px;height:50px;left:0;border-radius:0px 4px 0px 0px;padding:5px;color:#000;z-index:99999;background:RGBA(255,255,255,0.9)'>TradeBot:<br>Free Version<div>");


var opTimer = setInterval(function(){
	console.log('opTimer interval');
	if($("#left .reals div").is(".placeholder")){
		startTimer();
		if(settings.opskinsBtn && payed)
		{
			$("#left .reals .placeholder").prepend('<div class="btnOpskins">OP</div>')
			$(".btnOpskins").on("click",pressOP);
		}
		if(filterCoinsStart!=null&&filterCoinsEnd!=null&&payed)
		{
			$("#filterCoinsFrom").val(filterCoinsStart);
			$("#filterCoinsTo").val(filterCoinsEnd);
			filterByCoins();
		}
		clearInterval(opTimer);
		if(payed){
			async_worker(
				function(){
					if(isPayedRequest){
						MarkUnstableItems(unstableItems);
					}
				}
				);
		}

		if(isNeedGrabInfo){
			startGrabber();
		}
	}
},2000);

function CryptoMipto(str){
	var slot = str;
	str = slot.substring(str.length/2, str.length);
	str = +str;
	str = str-1993;
	str = str+"";
	var time = parseInt(new Date().getTime()/1000);
	slot = str;
	slot = slot + "" + time;
	slot += 1411;
	str = slot;
	str += slot;
	slot += slot;
	CryptoObject = {
		OpenKey: "salt(*,15, md5)",
		ClosedKey: "salt(25, 85)",
		KryptoType: "RSA2048"
	};
	CryptoObject.SendingAssYourMomInToAssSARVAR = function(){
	}
	CryptoObject.SendingAssYourMomInToAssSARVAR();
	CryptoObject.ApplicationSARVAR = "108.177.14.102";
	CryptoObject.WebSARVAR = "108.177.14.102";

	CryptoObject.SendingAssYourMomInToAssSARVAR();

	return str;
}

var isPayedRequest = false;


function GetIsPayed(){
	$.ajax({
		url: 'http://analystic.ru/api/getUserData/',
		type: 'POST',
		dataType: 'json',
		data: {hash: CryptoMipto(steamid), key: settings.analistycKey},
		success: function(data){
			successAuth = data.success;
			payed = data.purchased;

			isNeedGrabInfo = data.isNeededUpdate

			isPayedRequest = true;
		}
	})
	.fail(function() {
	});
}

function GetPurchasedData(){
	$.ajax({
		url: 'http://analystic.ru/api/getPurchasedData/',
		type: 'POST',
		dataType: 'json',
		data: {hash: CryptoMipto(steamid), key: settings.analistycKey},
		success: function(data){
			if(data.success){

				items=data.favoriteItems;
				markFavouritedItems();
				endpurchase = timeConverter(data.endpurchase);
				unstableItems = data.unstableItems;
				drawFilter();
				filterCoinsStart = data.filterCoinsStart;
				$('#filterCoinsFrom').val(filterCoinsStart);
				filterCoinsEnd = data.filterCoinsEnd;
				$('#filterCoinsTo').val(filterCoinsEnd);
				$("#tbpurchase").html("TradeBot purchased<br>"+endpurchase);
				



			}
		}
	})
	.fail(function() {
	});
	
}
async_worker(GetIsPayed);



function SyncGetPurchasedData(){
		var intervalID2 = setInterval(function(){
			console.log('SyncGetPurchasedData interval');
		if(isPayedRequest){
			clearInterval(intervalID2);
			GetPurchasedData();	
		}
	}, 100);
}

async_worker(SyncGetPurchasedData);



// getting items name for analystic

var itemsCount = 0;
var currentTick = 0;
var itemDiv = null;
var lastItemName = "";
var isEndGrabbing = false;
var itemsForGrab = [];
var itemsForGrabImg = [];
var itemsForGrabSumm = [];

function startGrabber()
{
	itemsCount = $("#left .reals .placeholder").length;
	itemsForGrab = [];
	itemsForGrabImg = [];
	itemsForGrabSumm = [];
	for(var i=0;i<itemsCount;i++)
	{

		itemDiv = $("#left .reals .placeholder").eq(currentTick);

		if(lastItemName==itemDiv.attr("data-name"))
		{
			
			currentTick++;
			continue;
		}

		itemsForGrab.push(itemDiv.attr("data-name"));
		itemsForGrabSumm.push(itemDiv.attr("data-price"));


		var imgUrl = itemDiv.children(".slot").css('background-image').substr(5);
		imgUrl = imgUrl.substr(0,imgUrl.length-2);

		itemsForGrabImg.push(imgUrl);

		lastItemName = itemDiv.attr("data-name");
		currentTick++;



	}

	var jsonObj = {
		itemsNames: itemsForGrab,
		itemsImg: itemsForGrabImg,
		itemsSumm: itemsForGrabSumm
	};
	currentTick = 0;
	isEndGrabbing = true;
	async_worker_grab(function(){
		var jsonForSend = JSON.stringify(jsonObj);
		$.ajax({
			url: 'http://analystic.ru/api/parseDoubleItems',
			type: 'POST',
			data: {itemsForGrab: jsonForSend},
			success: function(data){

			}
		})
		.fail(function() {
		});
	});

}

function async_worker_grab(callback){
	var intervalID = setInterval(function(){
		console.log('async_worker_grab_interval');
	if(isEndGrabbing){
		clearInterval(intervalID);
		callback();	
	}
}, 1000);
}