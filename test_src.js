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
    var theDiv = document.getElementById("tab_list");
    chrome.tabs.getSelected(null,function(tab) {
        var tablink = tab.url;
        //var theDiv = document.getElementById("tab_list");
        var content = document.createTextNode(tablink);
        theDiv.appendChild(content);

    });
}  

document.addEventListener('DOMContentLoaded', function () {
    var test = document.createTextNode("Script Succeeded");
    
    open_tab.addEventListener('click', function() {
        createTab();
    });

    list_tabs.addEventListener('click', function(){
        listTabs();
    });

    document.body.appendChild(test);

});