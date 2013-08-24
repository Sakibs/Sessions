/* GLOBAL VARIABLES */
var storage;
var id_active;

var sessionData;
var activeTabs;
/********************/

// Helper functions
function is_empty(obj) {
    var hasOwnProperty = Object.prototype.hasOwnProperty;
    // null and undefined are empty
    if (obj == null) return true;
    // Assume if it has a length property with a non-zero value
    // that that property is correct.
    if (obj.length && obj.length > 0)    return false;
    if (obj.length === 0)  return true;

    for (var key in obj) {
        if (hasOwnProperty.call(obj, key))    return false;
    }

    // Doesn't handle toString and toValue enumeration bugs in IE < 9

    return true;
}

// End Helper

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

function tabs_save(sessionName){
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

    var d = new Date();
    var cur_session = { ID: d.getTime(), name: sessionName, tabInfo: open_tabs };

    storage.get('sessionData', function(items) {
      if (items.sessionData) {
        sessionData = JSON.parse(items.sessionData);
        // push new session data into the varaible and set it back in sessionData
        sessionData.saved_sessions.push(cur_session);

        storage.set({'sessionData' : JSON.stringify(sessionData)}, function() {
          console.log("tabs_save: overwrote sessionData");

          // if storage successfully set, add entry to table
          addRowToTable(cur_session);
        });
      }
      else {
        console.log("Save Error: local session data not found.");
      }
    });
  }); //chrome.tabs.query
} //tabs_save


function saveOpenTabs() {
  var sessionName = document.getElementById("input_name").value;
  if(sessionName == "") {
    //display errors
    alert("Name field empty");
  } else {
    tabs_save(sessionName);
  }
}

function tabs_load(){
  load_data();
} //tabs_load

// load open tabs to variable for access
function loadOpenTabs() {
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

    fillActiveInfo(open_tabs);

    //console.log("Open Tabs:\n" + JSON.stringify(activeTabs));
  });
}

function fillActiveInfo(activeTabs) {
  console.log("In active Info");
  var active_info = document.getElementById("active_data");

  var info_box_html = "<ul>";
  for(var i=0; i<activeTabs.length; i++) {
    var li_elem = "<li>" + activeTabs[i].title + "</li> \n";
    info_box_html += li_elem;
  }
  info_box_html += "</ul>";

  active_info.innerHTML = "";
  active_info.innerHTML += info_box_html;
}

function closeAllAndActivate(newtabs){
  chrome.tabs.query({currentWindow: true}, function(tabs){
    console.log("Total tabs: " + tabs.length);

    //create array to hold tab Ids and push all currrent tab ids from query in.
    var tabIdArr = []
    for(var i=0; i<tabs.length; i++)
    {
      tabIdArr.push(tabs[i].id);
    }

    if(is_empty(newtabs)) {
      chrome.tabs.create({url:"chrome://newtab"});
    } else {
      for(var i=0; i<newtabs.length; i++) {
        chrome.tabs.create({url:newtabs[i].url, active:newtabs[i].active})
      }
    }

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


// function to render html for saved sessions
function loadSavedSessions(saved_sessions) {
  var savedSessionsTable = document.getElementById("saved_container");

  for (var i=0; i<saved_sessions.length; i++) {
    var row = savedSessionsTable.insertRow(-1);
    row.id = saved_sessions[i].ID;
    createRowForEntry(row, saved_sessions[i]);
  }
}

function addRowToTable(newSession) {
  var savedSessionsTable = document.getElementById("saved_container");
  var row = savedSessionsTable.insertRow(-1);
  row.id = newSession.ID;
  createRowForEntry(row, newSession);
}

function createRowForEntry(row, session) {
  var closeCell = row.insertCell(0);
  var loadCell = row.insertCell(1);
  var infoCell = row.insertCell(2);

  var closeButton = document.createElement('button');
  closeButton.className = "b_remove";
  closeButton.innerHTML = 'x';
  closeButton.onclick = function(){ removeSession(session.ID); };
  closeCell.appendChild(closeButton);

  var loadButton = document.createElement('button');
  loadButton.className = "b_load";
  loadButton.innerHTML = 'load';
  loadButton.onclick = function(){ loadSession(session.ID); };
  loadCell.appendChild(loadButton);

  var seshName = document.createElement("h4");
  seshName.innerHTML = session.name;

  var seshTabsList = createListFromTabs(session.tabInfo);
  infoCell.appendChild(seshName);
  infoCell.appendChild(seshTabsList);

}

function createListFromTabs (tabInfo) {
  var tabsList = document.createElement("ul");

  for(var i=0; i<tabInfo.length; i++) {
    var tabsListItem = document.createElement("li");
    tabsListItem.innerHTML = tabInfo[i].title;
    tabsList.appendChild(tabsListItem);
  }
  return tabsList;
}

function temp_loadSessions() {
  storage.get('sessionData', function(items) {
    if (items.sessionData) {
      console.log("** About to load sessions");
      var data = JSON.parse(items.sessionData);
      loadSavedSessions(data.saved_sessions);
    } else {
      console.log("Failed to load data");
    }
  });
}

function onPopupLoad() {
  storage.get('sessionData', function(items) {
    if (items.sessionData) {
      sessionData = JSON.parse(items.sessionData);

      console.log("got session data: "+items.sessionData);
      //sessionData = items.sessionData;
      console.log(sessionData.saved_sessions);
      if(is_empty(sessionData.active_session)) {
        console.log("No Active Session, listing open tabs");
        loadOpenTabs();
      }

      //then load saved sessions      
      if(!is_empty(sessionData.saved_sessions)) {
        loadSavedSessions(sessionData.saved_sessions);
      }
      
      
    } else {
      console.log("No SessionData Setting Everything Up!!!");
      init_setup();
    }
  }); //storage.get
}

//Initial setup function
//called when extension first started or if local data is cleared
function init_setup(){
  var init_active = {};
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

function loadSession(id) {
  console.log("** Session to load: "+id);
    storage.get('sessionData', function(items) {
    if (items.sessionData) {
      sessionData = JSON.parse(items.sessionData);
      var saved = sessionData.saved_sessions;
      var i = 0;
      
      for (i=0; i<saved.length; i++) {
        if(id == saved[i].ID) {
          closeAllAndActivate(saved[i].tabInfo);
          break;
        }
      }
    } else {
      console.log("loadSession: error loading sessionData");
    }
  });
}


function removeSession(id) {
  console.log("** Session to Remove: "+id);
  storage.get('sessionData', function(items) {
    if (items.sessionData) {
      sessionData = JSON.parse(items.sessionData);
      var saved = sessionData.saved_sessions;
      var i = 0;
      // remove from table
      var table = document.getElementById("saved_container");
      while (row=table.rows[i]) {
        if(row.id == id)
          table.deleteRow(i);
        i++;
      }
      // remove from sessions data structure
      for (i=0; i<saved.length; i++) {
        if(id == saved[i].ID) {
          // remove only one element with splice
          saved.splice(i, 1);
          break;
        }
      }
      sessionData.saved_sessions = saved;

      storage.set({'sessionData': JSON.stringify(sessionData)}, function() {
        console.log("Updated sessionData after removing element");
      });
      
    } else {
      console.log("removeSession: error loading sessionData");
    }
  });

}


document.addEventListener('DOMContentLoaded', function () {
  var test = document.createTextNode("Script Succeeded");
 	debug = document.getElementById("debugging");   
  storage = chrome.storage.local; 

  b_saveAs.addEventListener('click', function() {
    saveOpenTabs();
  });

  b_new.addEventListener('click', function() {
    closeAllAndActivate([]);
  });
  
  //init_setup();
  onPopupLoad();
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