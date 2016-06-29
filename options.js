document.addEventListener("DOMContentLoaded", function(){
	subreddit = document.getElementById("subreddit");
	sort = document.getElementById("sort");
	save = document.getElementById("save");
	position = document.getElementById("position");
	size = document.getElementById("size");
	color = document.getElementById("color");
	minScore = document.getElementById("minScore");
	
	save.addEventListener("click", saveSettings);
	
	chrome.storage.sync.get(undefined, function(items){
		nsfw = document.getElementById(items.nsfw);
		gif = document.getElementById(items.gif);
		
		subreddit.value = items.subreddit;
		minScore.value = parseInt(items.minScore);
		document.getElementById(items.sort).selected = "selected";
		document.getElementById(items.position).selected = "selected";
		document.getElementById(items.size).selected = "selected";
		color.value = items.color;
		nsfw.setAttribute("checked", "");
		gif.setAttribute("checked", "");
	});
});

function saveSettings(){
	console.log("Saved");
	chrome.storage.sync.set({
		"subreddit": subreddit.value,
		"sort": getId("s", sort),
		"position": getId("p", position),
		"size": getId("z", size),
		"color": color.value,
		"minScore": minScore.value,
		"gif": document.querySelector('input[name="gif"]:checked').id,
		"nsfw": document.querySelector('input[name="nsfw"]:checked').id},
		function(){
			var status = document.getElementById('status');
			status.textContent = 'Options saved.';
			setTimeout(function() {
				status.textContent = '';
			}, 1750);
		}
	);	
}

function getId(letter, list){
	for (i = 0; i < list.children.length; i++) {
		if (list.children[i].textContent == list.value) return letter+(i+1);
	}
}