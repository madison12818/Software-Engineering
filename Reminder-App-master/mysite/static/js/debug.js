$(function()
{
});

$("#dbg_post").click(function()
{
	dbg_submit("POST");
});

$("#dbg_get").click(function()
{
	dbg_submit("GET");
});

function dbg_submit(reqType)
{
    // assemble argument data
    var args = {};
    $(".dbg_argrow").each(function()
    {
        var key = $(this).find(".dbg_parameter").val();
        var val = $(this).find(".dbg_value").val();
        if (Boolean(key))
            args[key] = val;
    });
    // clear textarea
    $("#dbg_response").val("");
    // send request
	$.ajax({
        type: reqType,
        url: $("#dbg_path").val(),
        data: args,
        success: function(response)
        {
            $("#dbg_response").val(JSON.stringify(response, null, 4));
        },
        error: function(xhr, ajaxOptions, thrownError)
        {
            $("#dbg_response").val(xhr.responseText);
            //console.log(xhr.status);
            //console.log(xhr.responseText);
            //console.log(thrownError);
        }
	});
}