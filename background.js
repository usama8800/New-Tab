chrome.runtime.onInstalled.addListener(function(details){
	chrome.storage.sync.get(undefined, function(items){
		if (!items.subreddit || !items.sort || !items.nsfw || !items.position || !items.cover || !items.color || !items.gif || !items.minScore){
			chrome.storage.sync.set({
				"subreddit": items.subreddit?items.subreddit:"wallpapers",
				"sort": items.sort?items.sort:"s1",
				"nsfw": items.nsfw?items.nsfw:"nsfwNo",
				"position": items.position?items.position:"p1",
				"size": items.size?items.size:"z1",
				"gif": items.gif?items.gif:"gifYes",
				"minScore": items.minScore?items.minScore:"1",
				"color": items.color?items.color:"#333333"});
		}
	});
});