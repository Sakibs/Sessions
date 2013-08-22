/* GLOBAL VARIABLES */
var storage;
var id_active;

var sessionData;
/********************/

function load_data(){
  storage.get('saved_session', function(items) {
    if (items.saved_session) {
      console.log(items.saved_session);
      var session_data = JSON.parse(items.saved_session);
      var name_box = document.getElementById("cur_name_box");
      var info_box = document.getElementById("cur_info_box");


      var tab_info = session_data.tab_info;
      var info_box_html = "<ul>";
      for(var i=0; i<tab_info.length; i++) {
        var li_elem = "<li>" + tab_info[i].title + "</li> \n";
        info_box_html += li_elem;
      }
      info_box_html += "</ul>";

      name_box.innerHTML = "";
      name_box.innerHTML += session_data.name;
      info_box.innerHTML = "";
      info_box.innerHTML += info_box_html;
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
      open_tabs.push({
        active: tabs[i].active,
        url: tabs[i].url,
        title: tabs[i].title
      });
    }

    var cur_session = { name: Date(), tab_info: open_tabs };

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
  load_data();
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
    chrome.tabs.remove(tabIdArr);   
  });
}

function saveSessionData() {
  storage.get('session_data', function(items) {
    if (items.saved_session) {
      console.log(items.saved_session);
    }
    else {
      console.log("No SessionData Setting Everything Up!!!");
    }
  });
}

function loadSavedSessions() {
  
}

function onPopupLoad() {
  storage.get('sessionData', function(items) {
    if (items.sessionData) {
      console.log(items.sessionData);
      sessionData = items.sessionData;
    }
    else {
      console.log("No SessionData Setting Everything Up!!!");
      init_setup();
    }
  });

  if(sessionData.active_session == "") {
    console.log("No Active Session, listing open tabs"); 
  }

  //then render saved sessions


}

//Initial setup function
//called when extension first started or if local data is cleared
function init_setup(){
  var init_active = "";
  var init_saved = [];

  sessionData = {active_session: init_active, saved_sessions: init_saved};
  console.log(JSON.stringify(sessionData));

  storage.set({'sessionData': JSON.stringify(sessionData)}, function() {
      console.log("Initial data successfully saved.");
  });

}

//returns object that has all currently open tabs
function currentOpenTabs(){

}

document.addEventListener('DOMContentLoaded', function () {
  var test = document.createTextNode("Script Succeeded 2");
 	debug = document.getElementById("debugging");   
  storage = chrome.storage.local; 

  init_setup();
  /*
  b_load.addEventListener('click', function() {
    tabs_load();
  });

  b_save.addEventListener('click', function(){
	  tabs_save();
  });

  b_closeAll.addEventListener('click', function(){
    tabs_closeAll();
  });

  load_data();
  */

  debug.appendChild(test);

});