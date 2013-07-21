/*
	Variable
*/
var debug;
//var storage;

function displayDate()
{
  document.getElementById("demo").innerHTML=Date();
}

function tabs_save(){
  var open_tabs = [];

  chrome.tabs.query({currentWindow: true}, function(tabs){
    for(var i=0; i<tabs.length; i++)
    {
      //console.log(tabs[i].url);
      open_tabs.push({
        active: tabs[i].active,
        url: tabs[i].url
      });
    }

    var cur_session = { name: Date(), tab_info: open_tabs};
    //cur_session.tab_info = open_tabs;

    //console.log(JSON.stringify(cur_session));
    //var to_store = JSON.stringify(cur_session);

    var storage = chrome.storage.local;
    storage.set({'saved_session': JSON.stringify(cur_session)}, function() {
      console.log("data saved");
    });

    storage.get('saved_session', function(items) {
      if (items.saved_session) {
        console.log(items.saved_session);
      }
      else {
        console.log("FAILED!!!");
      }
    });


    
/*
    var cur_session = { name: Date(), tab_info: open_tabs};
    //cur_session.tab_info = open_tabs;

    console.log(JSON.stringify(cur_session));
    var to_store = JSON.stringify(cur_session);
    storage.set({'last_saved': to_store});

    storage.get('last_saved', function(result){
      var infoDiv = document.getElementById("cur_info_box");
      if(!result) 
      {
        console.log("** Found session -- "+result);
      }
      else
      {
        console.log("Session was not saved!");
      }
    });

*/
    //console.log(open_tabs.length);
    //console.log(JSON.stringify(open_tabs));
    //debug.innerHTML+="<br>"+JSON.stringify(open_tabs);
  }); //chrome.tabs.query
} //tabs_save

function tabs_load(){
  
}

function createTab()
{
  chrome.tabs.create({url:"chrome://newtab"});
}


document.addEventListener('DOMContentLoaded', function () {
  var test = document.createTextNode("Script Succeeded");
 	debug = document.getElementById("debugging");   
  storage = chrome.storage.local; 
  b_load.addEventListener('click', function() {
    tabs_load();
  });

  b_save.addEventListener('click', function(){
	  tabs_save();
  });


  /*
  storage.get('cur_session', function(result){
    var infoDiv = document.getElementById("cur_info_box");
    if(!result) 
    {
      infoDiv.innerHTML = result.name;
    }
    else
    {
      infoDiv.innerHTML = "No stored session";
    }
  });
  */

  debug.appendChild(test);

});