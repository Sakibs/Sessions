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
  if (obj.length && obj.length > 0) return false;
  if (obj.length === 0)  return true;

  for (var key in obj) {
    if (hasOwnProperty.call(obj, key)) return false;
  }

  // Doesn't handle toString and toValue enumeration bugs in IE < 9
  return true;
}

// End Helper

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
  var sessionName = document.getElementById("input_name");
  if(sessionName.value != "") {
    tabs_save(sessionName.value);
    //sessionName.value = "";
  }
} // saveOpenTabs

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

    // set the default name in name textfield
    // format is first tab name + # open tabs
    var currentTitle = open_tabs[0].title;
    if(currentTitle.length > 20)
      currentTitle = currentTitle.substring(0,20)+"... + "+(open_tabs.length-1)+" others";
    else
      currentTitle = currentTitle+" + "+(open_tabs.length-1)+" others";
    document.getElementById("input_name").value = currentTitle;

    fillActiveInfo(open_tabs);
  });
}

function fillActiveInfo(activeTabs) {
  var title = document.createElement("h4");
  title.appendChild(document.createTextNode("Currently Open: "+activeTabs.length+" tabs"));
  title. onclick = function () {
     $(this).parent().find('ul').slideToggle('fast');
  }
  var active_info = document.getElementById("active_data");
  active_info.appendChild(title);

  var info_box_html = document.createElement("ul");
  for(var i=0; i<activeTabs.length; i++) {
    var li_elem = document.createElement("li");
    li_elem.appendChild(document.createTextNode(activeTabs[i].title));
    info_box_html.appendChild(li_elem);
  }
  active_info.appendChild(info_box_html)
}

function loadLastOpenTabs(previous){
  if(!is_empty(previous)) {
    var lastOpenTable = document.getElementById("last_open_data");
    var row = lastOpenTable.insertRow(0);

    var loadCell = row.insertCell(0);
    var infoCell = row.insertCell(1);

    var loadButton = document.createElement('button');
    loadButton.className = "b_load";
    loadButton.onclick = function(){ loadSession(0); };
    loadCell.appendChild(loadButton);

    var title = document.createElement("h4");
    title.innerHTML = "Previous tabs: " + previous.tabInfo.length +" tabs";
    title.onclick = function() {
      $(this).parent().find('ul').slideToggle('fast');
    } 

    var lastTabsList = createListFromTabs(previous.tabInfo);
    infoCell.appendChild(title);
    infoCell.appendChild(lastTabsList);
  }
}

// This function stores open tabs, closes the open tabs,
// and opens the requested session
function saveLastOpenTabs(id, tabs, newtabs, remove_ids) {
  storage.get('sessionData', function(items) {
    if (items.sessionData) {
      var lastTabs = {
        ID: id,
        tabInfo: tabs
      }

      sessionData = JSON.parse(items.sessionData);
      sessionData.previous_tabs = lastTabs;

      storage.set({'sessionData' : JSON.stringify(sessionData)}, function() {
        console.log("saveLastOpenTabs: overwrote sessionData");
      });


      if(is_empty(newtabs)) {
        chrome.tabs.create({url:"chrome://newtab"});
      } else {
        for(var i=0; i<newtabs.length; i++) {
          chrome.tabs.create({url:newtabs[i].url, active:newtabs[i].active});
        }
      }
      chrome.tabs.remove(remove_ids);

    }
    else {
      console.log("saveLastOpenTabs: getting sessionData failed. Major error");
    }
  });
}

function closeAllAndActivate(newtabs){
  chrome.tabs.query({currentWindow: true}, function(tabs){
    console.log("Total tabs: " + tabs.length);

    //create array to hold tab Ids and push all currrent tab ids from query in.
    var tabIdArr = [];
    var open_tabs = [];
    for(var i=0; i<tabs.length; i++)
    {
      tabIdArr.push(tabs[i].id);
      open_tabs.push({
        active: tabs[i].active,
        url: tabs[i].url,
        title: tabs[i].title
      });
    }
    saveLastOpenTabs(0, open_tabs, newtabs, tabIdArr);    
    
    //MOVE THIS CODE TO saveLastOpenTabs
    /*
    if(is_empty(newtabs)) {
      chrome.tabs.create({url:"chrome://newtab"});
    } else {
      for(var i=0; i<newtabs.length; i++) {
        chrome.tabs.create({url:newtabs[i].url, active:newtabs[i].active})
      }
    }
    chrome.tabs.remove(tabIdArr);
    */
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
  closeButton.onclick = function(){ removeSession(session.ID); };
  closeCell.appendChild(closeButton);

  var loadButton = document.createElement('button');
  loadButton.className = "b_load";
  loadButton.onclick = function(){ loadSession(session.ID); };
  loadCell.appendChild(loadButton);

  var seshName = document.createElement("h4");
  seshName.innerHTML = session.name + " - " + session.tabInfo.length + " tabs";
  seshName.className = "sn_instance_name";
  seshName.onclick = function() {
    $(this).parent().find('ul').slideToggle('fast');
  }  

  var seshTabsList = createListFromTabs(session.tabInfo);
  infoCell.appendChild(seshName);
  infoCell.appendChild(seshTabsList);

}

function createListFromTabs (tabInfo) {
  var tabsList = document.createElement("ul");
  tabsList.className = "sn_instance_tabs";

  for(var i=0; i<tabInfo.length; i++) {
    var tabsListItem = document.createElement("li");
    var link = document.createElement('a');
  
    link.setAttribute('href', tabInfo[i].url);
    link.innerHTML = tabInfo[i].title;
    link.onclick = function() {
      //console.log(link.getAttribute('href'));
      chrome.tabs.create({url:link.getAttribute('href')});
    }
    tabsListItem.appendChild(link);
    //tabsListItem.appendChild(document.createTextNode(tabInfo[i].title));
    tabsList.appendChild(tabsListItem);
  }
  return tabsList;
}

function onPopupLoad() {
  storage.get('sessionData', function(items) {
    if (items.sessionData) {
      sessionData = JSON.parse(items.sessionData);

      console.log("got session data: "+items.sessionData);
      //sessionData = items.sessionData;
      console.log(sessionData.saved_sessions);
      loadOpenTabs();

      loadLastOpenTabs(sessionData.previous_tabs);
      console.log("loaded last open");
      //then load saved sessions      
      if(!is_empty(sessionData.saved_sessions)) {
        loadSavedSessions(sessionData.saved_sessions);
      }
      
    } else {
      console.log("No SessionData Setting Everything Up!!!");
      init_setup();
      loadOpenTabs();
    }
  }); //storage.get
}

//Initial setup function
//called when extension first started or if local data is cleared
function init_setup(){
  // TODO: Manage active sessions over different windows
  var init_active = {};
  var last_open = {};
  var init_saved = [];

  sessionData = {
    active_session: init_active, 
    saved_sessions: init_saved, 
    previous_tabs: last_open,
  };
  console.log(JSON.stringify(sessionData));

  storage.set({'sessionData': JSON.stringify(sessionData)}, function() {
      console.log("Initial data successfully saved.");
  });

}

function loadSession(id) {
  console.log("** Session to load: "+id);
  
  storage.get('sessionData', function(items) {
    if (items.sessionData) {
      sessionData = JSON.parse(items.sessionData);
      
      if(id == 0) {
        //var activeID = sessionData.active_info.ID;        
        var previous = sessionData.previous_tabs;
        closeAllAndActivate(previous.tabInfo);
      } else {
        var saved = sessionData.saved_sessions;
        var i = 0;
        
        for (i=0; i<saved.length; i++) {
          if(id == saved[i].ID) {
            closeAllAndActivate(saved[i].tabInfo);
            break;
          }
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
  
  // handle save when user clicks enter
  document.getElementById('input_name').onkeydown = function () {
    if(event.keyCode == 13){
      saveOpenTabs();
    }
  }

  onPopupLoad();
});