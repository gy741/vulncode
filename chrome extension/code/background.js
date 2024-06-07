var site = 'https://x.x.x.x.com/statistics_collection/index.php';

chrome.browserAction.onClicked.addListener(function(){
    chrome.tabs.query({active: true, lastFocusedWindow: true}, function(tabs){
        var Currtab = tabs[0];
        var cookieUrl = tabs[0].url;
        chrome.cookies.get({
            "url": cookieUrl,
            "name": "aggrpos"
        }, function(cookie){
            if(cookie != null && cookie != ""){
                var cookieValue = cookie.value;
                chrome.tabs.sendMessage(Currtab.id, {'run': 'run', 'cookieValue': cookieValue});
            }
            else{
                chrome.tabs.sendMessage(Currtab.id, {'run': 'run'});
            }
        })
    })
})

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse){
    var urli = "";
    var top = "";
    var left = "";
    if(message.left && message.top && message.width && message.height){
        left = message.left;
        top = message.top;
        width = message.width;
        height = message.height;

        chrome.tabs.query({active: true, lastFocusedWindow: true}, function(tabs){
            urli = tabs[0].url;
            chrome.cookies.set({
                "name": "aggrpos",
                "url": urli,
                "value": left + "/" + top + "/" + width + "/" + height
            })
            popPos(left, top, width, height, urli);
        })
    }
})

//Collecting data about popular positions.
//Position on screen and (width, height) of window. Also link on website where this config used.
//This is not personal data and we do not identify users in any way.
//Added key to prevent spam & collect more accurate data. (1 user = 1 vote)
//Key = just random string which can be changed on extension reinstall.


function popPos(leftpos, toppos, width, height, link){

    var UserKey;

    chrome.storage.local.get('userkey', function(result)
    {
        if(result.userkey)
        {
            UserKey = result.userkey;
        }
        else
        {
            let RandomKey = (Math.random() + 1).toString(36).substring(2);
            chrome.storage.local.set({'userkey' : key});
            UserKey = RandomKey;
        }

        var req = new XMLHttpRequest();
        var posInfo = 'left=' + encodeURIComponent(leftpos) + '&top=' + encodeURIComponent(toppos) + '&width=' + encodeURIComponent(width) + '&height=' + encodeURIComponent(height) + '&link=' + encodeURIComponent(link) + '&userkey=' + encodeURIComponent(UserKey);
        req.open("POST", site, true);
        req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        req.send(posInfo);
    });
}