/*
	Background by Links
*/

function getImageURL(items, callback){
	var xmlr = new XMLHttpRequest();
	xmlr.open("GET", "http://www.reddit.com/r/"+items.subreddit+"/"+getSort(items.sort));
	xmlr.responseType = 'json';
	xmlr.onload = function() {
		var response = xmlr.response;
		if (!response) {
			console.error("No response");
			return;
		}
		var children = response.data.children;
		for(i=0; i<children.length; i++){
			var child = children[i].data;
			var allowedExts = ['gif', 'png', 'jpg'];
			var ext = child.url.replace(/.+\.(.+?)$/, "$1"); //find out extention
			var gfy = child.url.search(/.+?gfycat\.com\/.+/)==0; //find out if link is from gfycat
			var imgi = child.url.search(/^.+?imgur.com\/.{7}$/)==0; //find out if link is from imgur
			var gifv = ext=='gifv';
			if(gifv){					//if gifv then act as gif and imgur link
				ext = "gif";
				imgi = true;
			}
			var pic = allowedExts.indexOf(ext)!=-1; //find out if url is a picture
			console.log("EXT: "+ext+", URL:"+child.url);
			if( ((ext=='gif'||gfy||imgi)&&items.gif=="gifNo") || ((ext!='gif'&&imgi&&!gfy)&&items.gif=="gifOnly") || (child.over_18&&items.nsfw=="nsfwNo") 
					|| (!child.over_18&&items.nsfw=="nsfwOnly") || child.score<items.minScore || (!gfy&&!pic&&!imgi)) continue;
			if(gfy) callback(child.url, "gfy");
			if(imgi) x = callback(child.url, "imgi");
			if(pic) callback(child.url);
			break;
		}
	}
	xmlr.onerror = function() {
		console.error("Network Error");
	};
	xmlr.send();
}

function getPosition(code){
	switch(parseInt(code.substring(1))){
		case 1:
			return "center center";
		case 2:
			return "center top";
		case 3:
			return "center bottom";
		case 4:
			return "left center";
		case 5:
			return "right center";
		case 6:
			return "left top";
		case 7:
			return "right top";
		case 8:
			return "left bottom";
		case 9:
			return "left right";
	}
}

function getSize(code){
	switch(parseInt(code.substring(1))){
		case 1:
			return "cover";
		case 2:
			return "contain";
		case 3:
			return "100% 100%";
		case 4:
			return "auto";
	}
}

function getSort(code){
	switch(parseInt(code.substring(1))){
		case 1:
			return "new/.json";
		case 2:
			return "hot/.json";
		case 3:
			return "rising/.json";
		case 4:
			return "gilded/.json";
		case 5:
			return "top/.json?sort=top&t=hour";
		case 6:
			return "top/.json?sort=top&t=day";
		case 7:
			return "top/.json?sort=top&t=week";
		case 8:
			return "top/.json?sort=top&t=month";
		case 9:
			return "top/.json?sort=top&t=year";
		case 10:
			return "top/.json?sort=top&t=all";
		case 11:
			return "controversial/.json?sort=controversial&t=hour";
		case 12:
			return "controversial/.json?sort=controversial&t=day";
		case 13:
			return "controversial/.json?sort=controversial&t=week";
		case 14:
			return "controversial/.json?sort=controversial&t=month";
		case 15:
			return "controversial/.json?sort=controversial&t=year";
		case 16:
			return "controversial/.json?sort=controversial&t=all";
	}
}

function convertGfyLink(imageURL, callback){
	var xmlr = new XMLHttpRequest();
	xmlr.open("GET", imageURL.replace(/.+?gfycat\.com\/(\w+)/, "http://gfycat.com/cajax/get/$1"));
	xmlr.responseType = 'json';
	xmlr.onload = function() {
		var response = xmlr.response;
		if (!response) {
			console.error("No response");
			return;
		}
		callback(response.gfyItem.gifUrl);
	}
	xmlr.onerror = function() {
		console.error("Network Error");
	};
	xmlr.send();
}

function convertImgiLink(imageURL, callback){
	var xmlr = new XMLHttpRequest();
	xmlr.open("GET", "https://api.imgur.com/3/image/"+imageURL.replace(/.+?imgur.com\/(.{7})\.?\w{0,4}/, "$1"));
	xmlr.setRequestHeader("Authorization", "Client-ID f006fbd7a2c13fb", false);
	xmlr.responseType = 'json';
	xmlr.onload = function() {
		var response = xmlr.response;
		if (!response) {
			console.error("No response");
			return;
		}
		console.log(response);
		callback(response.data.link);
	}
	xmlr.onerror = function() {
		console.error("Network Error");
	};
	xmlr.send();
}

function start(){
	chrome.storage.sync.get(undefined, function(items){
		document.body.style.backgroundColor = items.color;
		getImageURL(items, function(imageURL, getNewLink){			
			if(getNewLink=="gfy"){
				convertGfyLink(imageURL, function(newURL){
					setBackground(items, newURL);
				});
			}else if(getNewLink=="imgi"){
				convertImgiLink(imageURL, function(newURL){
					newURL = newURL.replace(/\.gifv/,".gif");
					setBackground(items, newURL);
				});
			}else setBackground(items, imageURL);
		});
	});
}

function setBackground(items, imageURL){
	console.log(imageURL);
	document.body.style.backgroundImage = "url("+imageURL+")";
	document.body.style.backgroundSize = getSize(items.size);
	document.body.style.backgroundPosition = getPosition(items.position);
}

start();