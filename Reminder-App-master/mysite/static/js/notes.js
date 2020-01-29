var notes;
var notesIndex;
var Months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
var Colors = [0x000000, 0x808080, 0x804040, 0xFF0000, 0xFF8000, 0xFFFF00, 0x008000, 0x00A2E8, 0x4050CC, 0xA048A0];

$(function()
{
    initDateSelects();
    initColors();
    loadNotes();
});

function initDateSelects()
{
    Months.forEach(function(val, i, array)
    {
        $('#editor_month').append("<option value=\"" + (i+1) + "\">" + val + "</option>");
    });
    for (var i = 2050; i >= 2000; i--)
        $('#editor_year').append("<option value=\"" + i + "\">" + i + "</option>");
    for (var i = 0; i <= 23; i++)
    {
        var str;
        if (i % 12 == 0)
            str = 12;
        else
            str = i % 12;
        if (i < 12)
            str += " AM";
        else
            str += " PM";
        $('#editor_hour').append("<option value=\"" + i + "\">" + str + "</option>");
    }
    for (var i = 0; i <= 59; i+=5)
        $('#editor_minute').append("<option value=\"" + i + "\">" + i + "</option>");
    $('#editor_year').change(function(e)
    {
        updateEditorDayList($(e.target).val(), $('#editor_month').val());
    });
    $('#editor_month').change(function(e)
    {
        updateEditorDayList($('#editor_year').val(), $(e.target).val());
    });
    setEditorDate(null);
}

function updateEditorDayList(year, month)
{
    var days = new Date(year, month, 0).getDate();
    var day = $('#editor_day').val();
    if (day == null)
        day = 1;
    $('#editor_day').empty();
    for (var i = 1; i <= days; i++)
        $('#editor_day').append("<option value=\"" + i + "\">" + i + "</option>");
    $('#editor_day').val(day);
    if ($('#editor_day').val() == null)
        $('#editor_day').val(1);
}

function setEditorDate(dateStr)
{
    var date;
    if (dateStr == null)
        date = new Date();
    else
        date = new Date(dateStr);
    $('#editor_year').val(date.getFullYear());
    $('#editor_month').val(date.getMonth() + 1);
    updateEditorDayList(date.getFullYear(), date.getMonth() + 1);
    $('#editor_day').val(date.getDate());
    $('#editor_hour').val(date.getHours());
    $('#editor_minute').val(Math.floor(date.getMinutes() / 5) * 5);
}

function getEditorDateUTC()
{
    var date = new Date($('#editor_year').val(), parseInt($('#editor_month').val()) - 1, $('#editor_day').val(), $('#editor_hour').val(), $('#editor_minute').val(), 0);
    return date.toISOString();
}

function initColors()
{
    Colors.forEach(function(val, i, array)
    {
        $("<div class=\"editor_coloroption\" data-value=\"" + val + "\"></div>").appendTo('#editor_color')
            .data("value", val)
            .css("background", getHTMLColor(val))
            .click(function()
            {
                if (getEditorColor() == val)
                    clearEditorColor();
                else
                    setEditorColor(val);
            });
    });
}

function getHTMLColor(color)
{
    if (color == null)
        return null;
    return "#"+("000000" + color.toString(16)).substr(-6);
}

function clearEditorColor()
{
    $(".editor_coloroption").removeClass("editor_selectedcolor");
    $("#editor_color").data("value", null);
}

function setEditorColor(color)
{
    $(".editor_coloroption").each(function()
    {
        if ($(this).data("value") == color)
            $(this).addClass("editor_selectedcolor");
        else
            $(this).removeClass("editor_selectedcolor");
    });
    $("#editor_color").data("value", color);
}

function getEditorColor()
{
    return $("#editor_color").data("value");
}

function showEditor(b, note)
{
    if (note)
    {
        var noteData = note.data("note");
        $("#editor").data("note_id", noteData.id),
        $("#editor_title input").val(noteData.title);
        setEditorDate(noteData.date_due);
        setEditorColor(noteData.color);
        $("#editor_content textarea").val(noteData.content);
        $("#editorbtn_post").css("display", "none");
        $("#editorbtn_save").css("display", "inline-block");
    }
    else
    {
        $("#editor_title input").val("");
        setEditorDate();
        setEditorColor(null);
        $("#editor_content textarea").val("");
        $("#editorbtn_post").css("display", "inline-block");
        $("#editorbtn_save").css("display", "none");
    }
    if (b)
        $("#editorbox").css("visibility", "visible");
    else
        $("#editorbox").css("visibility", "hidden");
}

$("#note_create").click(function()
{
    showEditor(true);
});

$("#editorbox").click(function(e)
{
    if (e.target !== this)
        return;
    showEditor(false);
});

// load notes
function loadNotes()
{
    if (auth_user_id == null)
        return;
	$.ajax({
			type: "GET",
			url: "\\note",
			data: {
                "user_id" : auth_user_id
            },
            cache: false,
			success: function(response)
			{
				if (!response.success)
				{
					//alert("failed!");
				}
				else
				{
                    $("#note_template").nextAll().remove();
                    notes = response.notes;
                    notesIndex = notes.length - 1;
                    showNextNote();
				}
			}
	});
}

// show next note and delay
function showNextNote()
{
    if (notes == null || notesIndex < 0)
        return;
    var noteData = notes[notesIndex];
    notesIndex--;
    createNotebox(noteData).appendTo("#notepanel");
    setTimeout(showNextNote, 50);
}
 
 // create a Notebox from template
function createNotebox(noteData)
{
	var note = $("#note_template").clone().removeAttr("id");
    // attach data object
    note.data("note", noteData);
    // initialize action bar
    note.find(".notemenu").hide();
    note.hover(function()
    {
        note.find(".notemenu").stop().fadeIn(200);
    }, function()
    {
        note.find(".notemenu").stop().fadeOut(200);
    });
    note.find(".note_edit").click(function()
    {
        editNote(note);
    });
    note.find(".note_delete").click(function()
    {
        deleteNote(note);
    });
    // fill text data
	note.find(".note_title").html(_.escape(noteData.title));
    var date = new Date(noteData.date_due);
	note.find(".note_datedue").html(date.toLocaleDateString("en-US", 
    {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    }));
    date = new Date(noteData.date_created);
	note.find(".note_datecreated").html("Created on " + date.toLocaleDateString("en-US", 
    {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    }));
    if (noteData.date_modified != null)
    {
        date = new Date(noteData.date_modified);
        note.find(".note_datemodified").html("Last modified on " + date.toLocaleDateString("en-US", 
        {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        }));
    }
    else
    {
        note.find(".note_datemodified").empty();
    }
	note.find(".note_content").html(encodeNoteContent(noteData.content));
	note.css("display", "block");
    if (noteData.color != null)
        note.find(".notebox").css("border-color", getHTMLColor(noteData.color));
    else
        note.find(".notebox").css("border-color", "");
	// move-in animation
	note.find(".notebox").css(
	{
		top : "10px",
		opacity : "0.3",
	}).animate({
		top : "0px",
		opacity : "1",
    }, 300);
    return note;
}

function encodeNoteContent(content)
{
    var str = "";
    content.split("\n").forEach(function(s)
    {
        str += "<p>" + _.escape(s) + "</p>";
    });
    return str;
}

// post new note
$("#editorbtn_post").click(function()
{
	$.ajax({
			type: "POST",
			url: "/createNote",
			data: $.param({
                user_id : auth_user_id,
                title : $("#editor_title input").val(),
                content : $("#editor_content textarea").val(),
                date_due : getEditorDateUTC(),
                color : getEditorColor()
            }),
			success: function(response)
			{
				if (!response.success)
				{
					alert("Post failed!");
				}
				else
				{
                    showEditor(false);
                    loadNotes();
				}
			}
	});
});

// edit note
$("#editorbtn_save").click(function()
{
	$.ajax({
			type: "POST",
			url: "/updateNote",
			data: $.param({
                note_id : $("#editor").data("note_id"),
                user_id : auth_user_id,
                title : $("#editor_title input").val(),
                content : $("#editor_content textarea").val(),
                date_due : getEditorDateUTC(),
                color : getEditorColor()
            }),
			success: function(response)
			{
				if (!response.success)
				{
					alert("Post failed!");
				}
				else
				{
                    showEditor(false);
                    loadNotes();
				}
			}
	});
});

function editNote(note)
{
    showEditor(true, note);
}

function deleteNote(note)
{
    if (!confirm("Are you sure you want to delete this note?"))
        return;
	$.ajax({
			type: "POST",
			url: "/deleteNote",
			data: $.param({
                user_id : auth_user_id,
                note_id : note.data("note").id
            }),
			success: function(response)
			{
				if (!response.success)
				{
					alert("Post failed!");
				}
				else
				{
                    note.remove();
				}
			}
	});
}