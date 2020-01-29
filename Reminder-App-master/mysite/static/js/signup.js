$(function()
{
});
 
// ajax submission
$("#form_signup").submit(function(e)
{
	e.preventDefault(); // prevent the default submission
	if ($(".pw").val() != $(".pw2").val())	// password confirmation
	{
		alert("Password not matching!");
		return;
	}
	var form = $(this);
	var url = form.attr('action');
	$.ajax({
			type: "POST",
			url: url,
			data: form.serialize(),
			success: function(response)
			{
				if (!response.success)
				{
					alert('Sign up failed!');
				}
				else
				{
					auth_user_id = response.user_id;
					loadFrame("notes");
				}
			}
	});
});