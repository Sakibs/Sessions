function debug()
{
    var debugDiv = document.getElementById("debugging");
    debugDiv.innerHTML+="Debugging<br>";
    
}

function displayDate()
{
    document.getElementById("demo").innerHTML=Date();
}

function createTab()
{
    // Statement 1
    //document.getElementById("demo").innerHTML=Date();
    chrome.tabs.create({url:"chrome://newtab"});
    // Statement 2
    // chrome.tabs.update({url:"http://en.wikipedia.org"});

}

function listTabs()
{
    var theDiv = document.getElementById("debugging");
    /*chrome.tabs.getSelected(null,function(tab) {
        var tablink = tab.url;
        //var theDiv = document.getElementById("tab_list");
        var content = document.createTextNode(tablink);
        theDiv.appendChild(content);
    });
    */
    chrome.tabs.query({}, function(tabs){
        //var jsonString = JSON.stringify(current: tabs);
        //var j = JSON.stringify(tabs);
        var debugDiv = document.getElementById("debugging");
        //debugDiv.innerHTML+=j;

        debugDiv.innerHTML += "2<br>";
        
        var channels = "Testing";

        var storage = chrome.storage.local;

		var myTestVar = 'myVariableKeyName';

		var obj= {};

		obj[myTestVar] = 'my test var';

		storage.set(obj);
		debugDiv.innerHTML += "3<br>";

		storage.get(myTestVar,function(result){
			//console.log("hel");
		  //debugDiv.innerHTML+=myTestVar;
		  console.log(myTestVar,result);
		  //console output = myVariableKeyName {myTestVar:'my test var'}
		});

        
    
        debugDiv.innerHTML += "4<br>";

        /*
        for(var i=0; i<tabs.length; i++)
        {
            var br = document.createElement("br");
            var content = document.createTextNode(tabs[i].url);

            theDiv.appendChild(content);
            theDiv.appendChild(br); 

        }
        */
  });
}  

document.addEventListener('DOMContentLoaded', function () {
    var test = document.createTextNode("Script Succeeded");
    
    b_new_sesh.addEventListener('click', function() {
        createTab();
    });

    b_save_as.addEventListener('click', function(){
        listTabs();
    });

    debug();

    document.body.appendChild(test);

});