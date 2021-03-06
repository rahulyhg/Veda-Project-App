// DESC: Called by LessonPlanTrainingManual to create teacher functionality in Training Manual
// RETURNS: void
function addTeacherFunctionality()
{
    $("#trainingmanuallink").append('<ul></ul>');
    function addTrainingCheckbox(boxtype,boxtypeName)
    {
        if($('[data-infoboxtype='+boxtype+']').size()>0)
        {
            $("#trainingmanuallink ul").append('<li><input type="checkbox" id="show'+boxtype+'" /><label for="show'+boxtype+'">Show '+boxtypeName+'</label></li>');

            if($('[data-infoboxtype='+boxtype+']').is(':visible'))
            {
                $('#trainingmanuallink ul #show'+boxtype).attr('checked','checked')
            }

            $("#show"+boxtype).bind("click",function()
            {
                if($(this).is(':checked'))
                {
                    $('[data-infoboxtype='+boxtype+']').show();
                }
                else
                {
                    $('[data-infoboxtype='+boxtype+']').hide();
                }
            })
        }
    }
    /*
    addTrainingCheckbox("roleplay","Roleplay");
    addTrainingCheckbox("jobaide","Job Aide");
    addTrainingCheckbox("studentparticipation","Student Participation");
    addTrainingCheckbox("discussion","Discussion");
    */
    $('.infoBox').each(function()
    {
        addTrainingCheckbox($(this).attr('data-infoboxtype'),$(this).attr('data-infoboxtype'));
    })
    
    $('footer').prepend('<div id="pagenav"><ul><li id="submitContent"><a>Submit</a></li></ul></div>');
    
    $('#submitContent').click(function()
    {
        var payload = {path:$('#content').attr('data-location')};
        $('#trainingmanuallink ul li input').each(function()
        {
            payload[$(this).attr('id')] = $(this).is(':checked');
        });
        
        $.ajax({url:'resources/submitLessonPlanTrainingManual.php', data:payload, type:'POST', success: function(data)
        {
            new Message(data);
        }});
    });
}