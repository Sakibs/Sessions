/*
	Variable
*/

//var storage;

/** Helper Functions **/
function displayDate()
{
  document.getElementById("demo").innerHTML=Date();
}

/** End Helper Functions **/
function load_data(){
  storage.get('saved_session', function(items) {
    if (items.saved_session) {
      console.log(items.saved_session);
      var session_data = JSON.parse(items.saved_session);

      document.getElementById("cur_name_box").innerHTML = "";
      document.getElementById("cur_name_box").innerHTML += session_data.name;
      document.getElementById("cur_info_box").innerHTML = "";
      document.getElementById("cur_info_box").innerHTML += session_data.tab_info;
    }
    else {
      console.log("** Load_data Failed!");
    }
  }); //storage.get
} //load_data

function tabs_save(){
  var open_tabs = [];

  chrome.tabs.query({currentWindow: true}, function(tabs){
    for(var i=0; i<tabs.length; i++)
    {
      //console.log(tabs[i].url);
      open_tabs.push({
        active: tabs[i].active,
        url: tabs[i].url,
        title: tabs[i].title
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
  }); //chrome.tabs.query
} //tabs_save

function tabs_load(){
  storage.get('saved_session', function(items) {
    if (items.saved_session) {
      console.log(items.saved_session);
      document.getElementById("cur_name_box").innerHTML = "";
      document.getElementById("cur_name_box").innerHTML += items.saved_session.name;
      document.getElementById("cur_info_box").innerHTML = "";
      document.getElementById("cur_info_box").innerHTML += items.saved_session;
    }
    else {
      console.log("LOAD FAILED!!!");
    }
  }); //storage.get
} //tabs_load

function tabs_closeAll(){
  chrome.tabs.query({currentWindow: true}, function(tabs){
    console.log("Total tabs: " + tabs.length);

    //create array to hold tab Ids and push all tab ids from query in.
    var tabIdArr = []
    for(var i=0; i<tabs.length; i++)
    {
      tabIdArr.push(tabs[i].id);
    }

    chrome.tabs.create({url:"chrome://newtab"});
    chrome.tabs.remove(tabIdArr, function(){
      console.log("All tabs closed!");
    });
    
  });
}

function createTab()
{
  chrome.tabs.create({url:"chrome://newtab"});
}



document.addEventListener('DOMContentLoaded', function () {
  var test = document.createTextNode("Script Succeeded 3");
 	debug = document.getElementById("debugging");   
  storage = chrome.storage.local; 
  b_load.addEventListener('click', function() {
    tabs_load();
  });

  b_save.addEventListener('click', function(){
	  tabs_save();
  });

  b_closeAll.addEventListener('click', function(){
    tabs_closeAll();
  });


  /*storage.get('saved_session', function(items) {
    if (items.saved_session) {
      console.log(items.saved_session);
      document.getElementById("cur_info_box").innerHTML += items.saved_session;
    }
    else {
      console.log("BEGINNING LOAD FAILED!!!");
    }
  });
  */
  load_data();

  debug.appendChild(test);

});