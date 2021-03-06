////////////////////////////////////////////////////////////////
// The navbar object allows the user to navigate through  	  //
// content.  When a field, subject, course is clicked, the    //
// navigation bar is changed appropriately.  When a lesson is //
// clicked, it is loaded. 									  //
////////////////////////////////////////////////////////////////

$(document).ready(function()
{
	// Add images to navigation links
	navigationBar = new navbar();
});
    
navbar.prototype.fields = false;
navbar.prototype.lessons = false;
navbar.prototype.courses = false;
navbar.prototype.readyToProcess=true;
navbar.prototype.currentPosition=null;

// DESC: fills the navbar with content and calls the display function
// PARAMETER: navBarTitle is the title of the new nav bar
// PARAMETER: backLocation is the location the user will be taken to if they hit the navbar back button
// PARAMETER: navBarLinks is the links that will be added to the new navbar
// RETURNS: void
navbar.prototype.fill = function(navBarTitle, backLocation, navbarLinks)
{
    var navbarObject = this;
    $('nav#coursenav>div').fadeOut('fast',
        function()
        {
            $('#coursenav>div>div>h2').remove();
            $('#coursenav>div>div').prepend("<h2>"+navBarTitle+"</h2>");

            $('#upToPreviousNavLevel').remove();

            if(!navbarObject.fields&!navbarObject.lessons)
            {
                $('#coursenav>div>div>h2').after('<div id="upToPreviousNavLevel" data-link="'+backLocation+'"><img src="img/back_button.png" /></div>');
            }
            else if(navbarObject.lessons)
            {
                if(navbarObject.currentPosition.search(/^\/data\/material\//g)>-1)
                {
                    var backArray = navbarObject.currentPosition.replace(/^\/data\/material\/|\/$/g,'').split('/');
                    $('#coursenav>div>div>h2').after('<a id="backToCourseButton" href="index.php?field='+backArray[0]+'&subject='+backArray[1]+'&course='+backArray[2]+'"><img src="img/back_button.png" /></a>');
                }
                else
                {
                    backArray = navbarObject.currentPosition.replace(/^\/data\/lessonplan\/|\/$/g,'').split('/');
                    $('#coursenav>div>div>h2').after('<a id="backToCourseButton" href="index.php?type=lessonPlan&id='+backArray[0]+'"><img src="img/back_button.png" /></a>');
                }
            }

            $('#coursenav>div>ul').remove();
            $('#coursenav>div').append('<ul></ul>');

            if(navbarObject.lessons)
            {
                $('nav#coursenav').addClass('lessonNav');
                for(i=0;i<navbarLinks.length;i++)
                {
                    $('#coursenav>div>ul').append('<li>'+navbarLinks[i]["name"]+'</li>');
                    $('#coursenav>div>ul>li:last-of-type').append('<ul></ul>');
                    if(navbarObject.currentPosition.search(/^\/data\/material\//g)>-1)
                    {
                        for(j=0;j<navbarLinks[i].lessons.length;j++)
                        {
                            var linkArray = navbarLinks[i].lessons[j]['link'].replace(/^\/data\/material\/|\/$/g,'').split('/');
                            var navPosition = {lesson:linkArray[4],section:linkArray[3], course:linkArray[2], subject:linkArray[1],field:linkArray[0]};

                            var linkLocation = "index.php?field="+navPosition.field+"&subject="+navPosition.subject+"&course="+navPosition.course+"&section="+escape(navPosition.section)+"&lesson="+escape(navPosition.lesson);
                            $('#coursenav>div>ul>li:last-of-type>ul').append('<li><a href="'+linkLocation+'">'+eval(j+1)+'. '+navbarLinks[i].lessons[j]["name"]+'</a></li>');
                        }
                    }
                    else
                    {
                        for(j=0;j<navbarLinks[i].lessons.length;j++)
                        {
                            var linkArray = navbarLinks[i].lessons[j]['link'].replace(/^\/data\/lessonplan\/|\/$/g,'').split('/');
                            var navPosition = {lesson:linkArray[2], section:linkArray[1],lessonplanId:linkArray[0]};

                            var linkLocation = "index.php?type=lessonPlan&id="+navPosition.lessonplanId+"&section="+navPosition.section+"&lesson="+navPosition.lesson;
                            $('#coursenav>div>ul>li:last-of-type>ul').append('<li><a href="'+linkLocation+'">'+eval(j+1)+'. '+navbarLinks[i].lessons[j]["name"]+'</a></li>');
                        }
                    }
                }
            }
            else if(navbarObject.courses)
            {
                $('#coursenav').removeClass('lessonNav');
                for(i=0;i<navbarLinks.length;i++)
                {
                    var linkArray = navbarLinks[i]['link'].replace(/^\/data\/material\/|\/$/g,'').split('/');
                    
                    var navPosition = {course:linkArray[2], subject:linkArray[1],field:linkArray[0]};
                    var linkLocation = "index.php?field="+navPosition.field+"&subject="+navPosition.subject+"&course="+navPosition.course;
                    $('#coursenav>div>ul').append('<li data-img="'+navbarLinks[i]['img']+'"><a href="'+linkLocation+'">'+navbarLinks[i]["name"]+'</a></li>');
                }
            }
            else
            {
                $('#coursenav').removeClass('lessonNav');
                for(i=0;i<navbarLinks.length;i++)
                {
                    $('#coursenav>div>ul').append('<li data-img="'+navbarLinks[i]['img']+'" data-link="'+navbarLinks[i]['link']+'">'+navbarLinks[i]["name"]+'</li>');
                }
            }

            navbarObject.display();
        }			
     );
}

// DESC: adds images to the newly added navbar and fades it in
// RETURNS: void
navbar.prototype.display = function()
{
    var navbarObject = this;
    var navlinks = $('nav#coursenav ul li');

    if(!navbarObject.lessons)
    {
        for(i=0;i<navlinks.length;i++)
        {
            if(navbarObject.courses)
            {
                $(navlinks[i]).children('a').prepend('<img data-loaded="false" src=img/navIcons/'+$(navlinks[i]).attr('data-img')+".png />");
            }
            else
            {
                $(navlinks[i]).prepend('<img data-loaded="false" src=img/navIcons/'+$(navlinks[i]).attr('data-img')+".png />");
            }
        }

        navlinks.find('img').load(function()
        {
            if($(this).parents('li').first().siblings().find('img[data-loaded=false]').size()==0)
            {
                $('nav#coursenav>div').fadeIn('fast',function()
                {
                    navbarObject.readyToProcess=true;	
                });
            }
            else
            {
                $(this).attr('data-loaded',"true");
            }
        });
    }
    else
    {
        $('nav#coursenav>div').fadeIn('fast', function()
        {
            navbarObject.readyToProcess=true;	
        });
    }
}

// DESC: Uses the navigation bar location to get and fill the links associated with that location
// PARAMETER: navBarLocation is the the slash-separated level of navigation
// RETURNS: void
navbar.prototype.processPosition = function(navBarLocation)
{
    var navbarObject = this;
    navbarObject.currentPosition=navBarLocation;

    if(this.readyToProcess)
    {
        this.readyToProcess=false;
        if(navBarLocation.search(/^\/data\/material\//g)>-1)
        {
            var linkArray = navBarLocation.replace(/^\/data\/material\/|\/$/g,'').split('/');
            var navPosition = {lesson:linkArray[4],section:linkArray[3], course:linkArray[2], subject:linkArray[1],field:linkArray[0]};
            
            $.ajax({url : 'resources/getCourseNav.php', type: 'GET', data: navPosition,success: function(data)
            {
                var backLocation = '/data/material/';
                var dataArray = $.parseJSON(data);

                var currentPath = dataArray['path'];

                if(currentPath!==null)
                {
                    var backLocationArray = currentPath.split('/');
                    backLocationArray.splice(backLocationArray.length-2,1);
                    var backLocation = backLocationArray.join('/');
                }

                var newNavBarLinks = new Array();
                var newNavBarTitle = dataArray['name']==null ? 'Fields' : dataArray['name'];

                navbarObject.fields = false;
                navbarObject.courses = false;
                navbarObject.lessons = false;

                // Current Path is subject level
                if(currentPath.split('/').length==6)
                {
                    navbarObject.courses = true;
                }

                // Current Path is course level
                if(currentPath.split('/').length==7)
                {
                    navbarObject.fields = false;
                    navbarObject.lessons = true;

                    if(getJSONArrayLength(dataArray['children'])>0)
                    {
                        for(i=0;i<getJSONArrayLength(dataArray['children']);i++)
                        {
                            newNavBarLinks.push({link:dataArray['children'][i]['path'],name:dataArray['children'][i]['name'],lessons:new Array()});
                            var sectionLinkArray = newNavBarLinks[i].link.replace(/^\/data\/material\/|\/$/g,'').split('/');
                            var sectionNavPosition = {section:sectionLinkArray[3], course:sectionLinkArray[2], subject:sectionLinkArray[1],field:sectionLinkArray[0]};

                            function processAjax(index)
                            {
                                return function(innerData)
                                {
                                    innerDataArray = $.parseJSON(innerData);

                                    for(j=0;j<getJSONArrayLength(innerDataArray['children']);j++)
                                    {
                                        newNavBarLinks[index].lessons.push({link:innerDataArray['children'][j]['path'],name:innerDataArray['children'][j]['name']});
                                    }

                                    if(index==getJSONArrayLength(dataArray['children'])-1)
                                    {
                                        navbarObject.fill(newNavBarTitle, backLocation, newNavBarLinks);
                                    }
                                }
                            }

                            $.ajax({url: 'resources/getCourseNav.php',type:'GET',data:sectionNavPosition,success:processAjax.call(this,i)});
                        }
                    }
                    else
                    {
                        navbarObject.fill(newNavBarTitle, backLocation, newNavBarLinks);
                    }
                }
                else
                {
                    if(currentPath=='/data/material/')
                    {
                        navbarObject.fields = true;
                    }
                    else
                    {
                        navbarObject.fields = false;
                    }
                    navbarObject.lessons = false;

                    for(i=0;i<getJSONArrayLength(dataArray['children']);i++)
                    {
                        newNavBarLinks.push({link:dataArray['children'][i]['path'],name:dataArray['children'][i]['name'],img:$.trim(dataArray['children'][i]['name']).replace(/ /g,'_')});
                    }

                    navbarObject.fill(newNavBarTitle, backLocation, newNavBarLinks);
                }

                $('#coursenav').attr('data-navPosition',navBarLocation);
            }});
        }
        else
        {
            navbarObject.fields = false;
            navbarObject.lessons = true;
            
            linkArray = navBarLocation.replace(/^\/data\/lessonplan\/|\/$/g,'').split('/');
            navPosition = {moduleId:linkArray[0]};
            $.ajax({url : 'resources/getModuleNav.php', type: 'GET', data: navPosition,success: function(data)
            {
                var jsonArray = $.parseJSON(data);
                
                var newNavBarTitle = jsonArray['name'];
                var backLocation = navBarLocation;
                var newNavBarLinks = new Array();
                
                for(i=0;i<jsonArray.children.length;i++)
                {
                    var lessonplanId = jsonArray.children[i].path.replace(/^\/data\/lessonplan\/|\/$/g,'').split('/')[0];
                    var sectionName = jsonArray.children[i].path.replace(/^\/data\/lessonplan\/|\/$/g,'').split('/')[1];
                    newNavBarLinks.push({link:jsonArray.children[i]['path'],name:jsonArray.children[i]['name'],lessons:new Array()});
                    for(j=0;j<jsonArray.children[i].lessons.length;j++)
                    {
                        var lessonName = jsonArray.children[i].lessons[j].path.replace(/^\/data\/material\/|\/$/g,'').split('/')[4];
                        var lessonPath = "/data/lessonplan/"+lessonplanId+"/"+sectionName+"/"+lessonName+"/";
                        newNavBarLinks[i].lessons.push({link:lessonPath,name:jsonArray.children[i].lessons[j].name});
                    }
                }
                
                navbarObject.fill(newNavBarTitle, backLocation, newNavBarLinks);
            }});
        }
    }
}

// DESC: navigates to the next navigation level after the user clicks on an icon
// PARAMETER: navBarLocation is new location to navigate to
// RETURNS: void
navbar.prototype.navigateToNextLevel = function(navBarLocation)
{
    if(this.readyToProcess)
    {
        if(!this.lessons && !this.courses)
        {
            if(navBarLocation.search(/^\/data\/material\//g)>-1)
            {
                //this.processPosition(navBarLocation);
                var linkArray = navBarLocation.replace(/^\/data\/material\/|\/$/g,'').split('/');
                var navPosition = {lesson:linkArray[4],section:linkArray[3], course:linkArray[2], subject:linkArray[1],field:linkArray[0]};
                window.location = "index.php?field="+navPosition.field+"&subject="+navPosition.subject+"&course="+navPosition.course;
            }
            else
            {
                linkArray = navBarLocation.replace(/^\/data\/lessonplan\/|\/$/g,'').split('/');
                navPosition = {moduleId:linkArray[0]};
                window.location = "index.php?type=lessonPlan&id="+navPosition.moduleId;
            }
        }
    }
}

// DESC: navigates to a lesson
// PARAMETER: navBarLocation is the lesson to load
// RETURNS: void
navbar.prototype.navigateToLesson = function(navBarLocation)
{
    if(this.readyToProcess)
    {
        var linkArray = navBarLocation.replace(/^\/data\/material\/|\/$/g,'').split('/');
        var navPosition = {lesson:linkArray[4],section:linkArray[3], course:linkArray[2], subject:linkArray[1],field:linkArray[0]};

        window.location = "index.php?field="+navPosition.field+"&subject="+navPosition.subject+"&course="+navPosition.course+"&section="+escape(navPosition.section)+"&lesson="+escape(navPosition.lesson);
    }
}

function navbar()
{
    var navbarObject = this;
    
    this.processPosition($('#coursenav').attr('data-navPosition'));

    $(document).on('click','#coursenav>div>ul>li',function(e)
    {
        if($(this).attr('data-link')=="/data/material/CHW_Training/Manager_Training/"||$(this).attr('data-link')=="/data/material/CHW_Training/Supervisor_Training/")
        {
            new Message("Still incomplete...");
        }
        else
        {
            navbarObject.navigateToNextLevel($(this).attr('data-link'));
        }
    });

    $(document).on('click', 'nav#coursenav>div>div#upToPreviousNavLevel',function(e)
    {
        navbarObject.processPosition($(this).attr('data-link'));
    });
}