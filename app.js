$.urlParam = function(name){
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results==null){
       return null;
    }
    else{
       return results[1] || 0;
    }
}

var settings = {"padServer":"", "padRoot": ""};
var questions = [
	{"text":"D. Why do you want to carry out this project? What are its objectives? How does it link to the objectives of the Erasmus+ programme and this specific key action? What are the issues and needs are you seeking to address through this project?", "status":"open"},
	{"text":"D. How did you choose your project partners? What experiences and competences will they bring to the project? Please also describe how the project meets the needs and objectives of your partners.", "status":"open"},
	{"text":"E. Please describe for each planned activity the background and needs of the participants involved and how these participants have been or will be selected.", "status":"open"},
	{"text":"E. Please provide for each planned activity, general information on the age of participants and describe how you will ensure gender balance in the main activities carried out in your project.", "status":"open"},
	{"text":"E.2. Which competences (i.e. knowledge, skills and attitudes/behaviours) are to be acquired/improved by participants in each planned activity of your project?", "status":"open"},
	{"text":"E.2. Are you planning to use any national instrument/certificate? If so, which one?", "status":"open"},
	{"text":"E.2. How will you use the European/national instrument(s)/certificate(s) selected? How will you ensure an awareness and reflection of the participants on their learning process and competences developed in the project? Please remember to include the methods that support reflection and documentation of the learning outcomes in the daily timetable of each activity.", "status":"open"},
	{"text":"F.1. How will the practical and logistic matters of each planned activity be addressed (e.g. travel, accommodation, insurance, safety and protection of participants, visa, social security, mentoring and support, preparatory meetings with partners etc.)?", "status":"open"},
	{"text":"F.2. How will you address quality and management issues (e.g. setting up of agreements with partners, learning agreements with participants, etc.)?", "status":"open"},
	{"text":"F.3. Which kind of preparation will be offered to participants (e.g. task-related, intercultural, linguistic, risk-prevention etc.)? Who will provide such preparatory activities?", "status":"open"},
	{"text":"G. Please explain the context and objectives of the activities you are planning and in which way they meet the objectives of the project.", "status":"open"},
	{"text":"G. What are the basic elements of those activities? For each activity, remember to describe at the very least all of the following: type of activity, venue(s), planned dates, working methods used, countries involved and the role of each project partner in the activity.", "status":"open"},
	{"text":"G. If applicable, how do you intend to cooperate and communicate with your project partners and/or consortium members and other relevant stakeholders?", "status":"open"},
	{"text":"G. If applicable, please explain the need for accompanying persons.", "status":"open"},
	{"text":"H.1. What is the expected impact on the participants, participating organisation(s) and target groups?", "status":"open"},
	{"text":"H.1. What is the desired impact of the project at the local, regional, national, European and/or international levels?", "status":"open"},
	{"text":"H.2. Which activities will you carry out in order to share the results of your project outside your organisation/consortium and partners? What will be the target groups of your dissemination activities?", "status":"open"},
	{"text":"H.3. Which activities will you carry out in order to assess whether, and to what extent, your project has reached its objectives and results?", "status":"open"},
	{"text":"J. Project Summary", "status":"open"},
	{"text":"J. Project Summary translated to English", "status":"open"}
];

if (readCookie("padserver")) { settings.padServer = readCookie("padserver"); }
if (readCookie("padroot")) { settings.padRoot = readCookie("padroot"); }

if ($.urlParam("padserver")) { settings.padServer = $.urlParam("padserver"); }
if ($.urlParam("padroot")) { settings.padRoot = $.urlParam("padroot"); }

createCookie("padserver", settings.padServer, 30);
createCookie("padroot", settings.padRoot, 30);

$("#padServer").val(settings.padServer);
$("#padRoot").val(settings.padRoot);

var questionIndex = 0;
var questionCountClosed = 0;

questions.forEach(function(entry) {
	var questionDiv = $("<div>", {class: "question", id: questionIndex, status: entry.status});

	switch(entry.status) {
		case "open":
			var questionText = $('<h2 class="questionTitle linkish"><span class="openDot">&#9679; </span>'+entry.text+"</h2>");
			break;
		case "closed":
			var questionText = $('<h2 class="questionTitle linkish"><span class="closedDot">&#9679; </span>'+entry.text+"</h2>");
			questionCountClosed++;
			break;
		default:
			var questionText = $('<h2 class="questionTitle linkish"><span class="defaultDot">&#9679; </span>'+entry.text+"</h2>");
			break;
	}

	
	questionDiv.append(questionText);
	$("#main").append(questionDiv);

	questionIndex++;
	$("#countClosed").html(questionCountClosed);
	$("#countTotal").html(questionIndex);
});

$(".questionTitle").click(function() {
	var clickedDiv = $(this).parent();
	var clickedId = clickedDiv.attr("id");
	var clickedStatus = clickedDiv.attr("status");
	var clickedPadStatus = clickedDiv.attr("loaded");

	if (clickedPadStatus === "pad" || clickedPadStatus === "text") {
		clickedDiv.children(".loadedItem").toggle();
	} else if ((settings.padServer === "" || settings.padRoot === "") && clickedPadStatus !== "warning") {
		clickedDiv.append('<p class="alert alert-warning">Please go to the settings and enter the project details</p>');
		clickedDiv.attr("loaded", "warning");
	} else if ((settings.padServer === "" || settings.padRoot === "") && clickedPadStatus === "warning") {
		clickedDiv.children(".alert").toggle();
	} else if (clickedStatus === "open") {
		var questionPad = $('<iframe class="loadedItem" name="embed_readwrite" src="'+settings.padServer+'/p/'+settings.padRoot+clickedId+'?showControls=true&showChat=false&showLineNumbers=true&useMonospaceFont=false"></iframe>');
		clickedDiv.append(questionPad);
		clickedDiv.attr("loaded", "pad");
	} else if (clickedStatus === "closed") {
		$.ajax({
			url: settings.padServer+"/p/"+settings.padRoot+clickedId+"/export/txt",
			dataType: "text",
			success: function (data) {
				clickedDiv.append('<p class="loadedItem well">'+data+"</p>");
			}
		});
		clickedDiv.attr("loaded", "text");
	} else {
		console.error("showing/toggling content failed");
	}

});

$("#selectWhatsthis").click(function() {
	$("#main").hide();
	$("#whatsthis").show();
});

$("#selectSettings").click(function() {
	$("#main").hide();
	$("#settings").show();
});

$("#padServer").blur(function() {
	settings.padServer = $("#padServer").val();
	createCookie("padserver", settings.padServer, 30);
	resetLoaded(".question");
});

$("#padRoot").blur(function() {
	settings.padRoot = $("#padRoot").val();
	createCookie("padroot", settings.padRoot, 30);
	resetLoaded(".question");
});


$(".back").click(function() {
	$("#main").show();
	$("#whatsthis").hide();
	$("#settings").hide();
});

function resetLoaded(obj) {
	$(obj).each(function () {
		$(this).attr("loaded", "");
		$(this).children("p, iframe").remove();
	});
}

function createCookie(name, value, days) {
    var expires;

    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toGMTString();
    } else {
        expires = "";
    }
    document.cookie = encodeURIComponent(name) + "=" + encodeURIComponent(value) + expires + "; path=/";
}

function readCookie(name) {
    var nameEQ = encodeURIComponent(name) + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
    }
    return null;
}