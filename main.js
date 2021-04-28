var commentsDisplayNo = 1;
var prevComments = [];

function sendUserMessage() {
var userCommentName = document.getElementById("userCommentName").value;
var userCommentMessage = document.getElementById("userCommentMessage").value;
if (userCommentName && userCommentMessage){
	document.getElementById("usercommentSendBtn").disabled = true;
	var guid = guidGenerator();
	var crTime = new Date().getTime();
  firebase.database().ref().child('fm/station').update({changeNow: 'false'});
  firebase.database().ref().child('fm/commentslist/' + guid).update({name: userCommentName, message:userCommentMessage, time: crTime});
	document.getElementById("userCommentMessage").value = "";
	$("#userCommentSuccess").show();

	setTimeout(function(){ 
		$("#userCommentSuccess").hide();
			document.getElementById("usercommentSendBtn").disabled = false;
	}, 30000);
	}
}
function guidGenerator() {
    var S4 = function() {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}
function bottomInfoLoader() {
if(document.getElementById("player").paused) {
document.querySelector('#bottomhelp').innerHTML = "Please click play button to listen.";
}
else {
document.querySelector('#bottomhelp').innerHTML = "Unable to Listen? <a href=javascript:void(0) onClick=reloadPlay()> Click Here</a>";
}
}

function reloadPlay() {
document.getElementById("player").load();
playAudio();
}

function playAudio() {
document.getElementById('player').play();
document.getElementById('playBtn').style.display = 'none';
document.getElementById('pauseBtn').style.display = 'block';
bottomInfoLoader();
}

function pauseAudio() {
document.getElementById('player').pause();
document.getElementById('playBtn').style.display = 'block';
document.getElementById('pauseBtn').style.display = 'none';
bottomInfoLoader();
}

function muteAudio() {
document.getElementById("player").muted = true;
document.getElementById('muteBtn').style.display = 'none';
document.getElementById('unmuteBtn').style.display = 'block';
}

function unmuteAudio() {
document.getElementById("player").muted = false;
document.getElementById('muteBtn').style.display = 'block';
document.getElementById('unmuteBtn').style.display = 'none';
}
pauseAudio();
unmuteAudio();

var volDiv = document.getElementById('volCheckBarParent');
volDiv.addEventListener('click', function (e) {
    var offset = this.getClientRects()[0];
var valueClick = e.clientX - offset.left;
if (valueClick < 21) {
document.getElementById('volCheckBar').style.width = '20%';
document.getElementById("player").volume = 0.2;
} else if (valueClick > 79) {
document.getElementById('volCheckBar').style.width = '100%';
document.getElementById("player").volume = 1;
} else if (valueClick < 41 && valueClick > 20) {
document.getElementById('volCheckBar').style.width = '40%';
document.getElementById("player").volume = 0.4;
} else if (valueClick < 61 && valueClick > 40) {
document.getElementById('volCheckBar').style.width = '60%';
document.getElementById("player").volume = 0.6;
} else if (valueClick < 81 && valueClick > 60) {
document.getElementById('volCheckBar').style.width = '80%';
document.getElementById("player").volume = 0.8;
}

}, false);


 function updateInfo(data) {
   if (data.thumb) {
 //    rjq('#thumbImageId').html('<img src="' + data.thumb + '" alt="" title="" />')
   } else {
 //    rjq('#thumbImageId').html('')
   }
 }
 function digi() {
  var date = new Date(),
      hour = date.getHours(),
      minute = checkTime(date.getMinutes()),
      ss = checkTime(date.getSeconds());

  function checkTime(i) {
    if( i < 10 ) {
      i = "0" + i;
    }
    return i;
  }

if ( hour > 12 ) {
  hour = hour - 12;
  if ( hour == 12 ) {
    hour = checkTime(hour);
  document.getElementById('localTimeId').innerHTML = hour+":"+minute+":"+ss+" AM";
  }
  else {
    hour = checkTime(hour);
    document.getElementById('localTimeId').innerHTML = hour+":"+minute+":"+ss+" PM";
  }
}
else {
  document.getElementById('localTimeId').innerHTML = hour+":"+minute+":"+ss+" AM";;
}
var time = setTimeout(digi,1000);
}
digi();

var sc_project=11952565; 
var sc_invisible=1; 
var sc_security="7d8c418e";

var showData = {};
var songsData = {};
var stationData = {};
var ref = firebase.database().ref().child('fm');;
var count = 0;
ref.child('station').on("value", function(snapshot){
	stationData = JSON.parse(JSON.stringify(snapshot.val(), null, 2));
	if (count === 0 && stationData.isDefault === 'false' && stationData.stationUrl) {
		document.getElementById("player").setAttribute('src', stationData.stationUrl);
		document.getElementById("player").load();
		bottomInfoLoader();
	} else if (count === 0) {
		document.getElementById("player").setAttribute('src', stationData.defaultUrl);
		document.getElementById("player").load();
		bottomInfoLoader();
	} else if (count > 0 && stationData.isDefault === 'false' && stationData.stationUrl && stationData.changeNow === 'true' ) {

		if(document.getElementById("player").paused) {
			document.getElementById("player").setAttribute('src', stationData.stationUrl);
			document.getElementById("player").load();
			pauseAudio();
		} else {
			document.getElementById("player").pause();
			document.getElementById("player").setAttribute('src', stationData.stationUrl);
			document.getElementById("player").load();
			playAudio();
		}

	} else if (count > 0 && stationData.changeNow === 'true') {

		if(document.getElementById("player").paused) {
			document.getElementById("player").setAttribute('src', stationData.defaultUrl);
			document.getElementById("player").load();
			pauseAudio();
		} else {
			document.getElementById("player").pause();
			document.getElementById("player").setAttribute('src', stationData.defaultUrl);
			document.getElementById("player").load();
			playAudio();
		}
	}
	count = count + 1;
})

ref.child('show').on("value", function(snapshot){
	showData = JSON.parse(JSON.stringify(snapshot.val(), null, 2));
		if (showData && showData.rj && !showData.rjUrl) {
		document.querySelector('#rjNameDiv').innerHTML  = showData.rj + " ON AIR";
	} else if (showData && showData.rj && showData.rjUrl) {
		document.querySelector('#rjNameDiv').innerHTML  = "<a target=_blank href="+showData.rjUrl+">"+showData.rj+"</a>" + " ON AIR";
	} else {
	document.querySelector('#rjNameDiv').innerHTML  = "ON AIR";
	}
	
	if (showData && showData.isLiveShow && showData.isLiveShow === 'true') {
	$("#liveImgId").show();
	} else {
	$("#liveImgId").hide();
	}
	
		if (showData && showData.name) {
		document.querySelector('#showName').innerHTML  = showData.name;
		document.title = showData.name + " | isai.live FM";
		 $(".se-pre-con").fadeOut("slow");
	} else {
	document.querySelector('#showName').innerHTML = "NOW PLAYING";
	 $(".se-pre-con").fadeOut("slow");
	}
	
	if (showData && showData.time) {
		document.querySelector('#showTime').innerHTML  = showData.time;
	} else {
	document.querySelector('#showName').innerHTML = ""
	}

})

ref.child('songs').on("value", function(snapshot){
	songsData = JSON.parse(JSON.stringify(snapshot.val(), null, 2));
		var nowSongHTML = "";
	if (songsData.csong || songsData.cmovie || songsData.csingers) {
	var nowSongHTML = "<span class=cur-title><img height=12 width=12 src=https://1.bp.blogspot.com/-2-3Ad31vLZQ/Xrap4or3seI/AAAAAAAACa0/7jXWqqzd68YNDHw03gLGeH22FmP3t07wgCK4BGAsYHg/interface.png></img> PLAYING: </span><span class=cur-content>";
		if (songsData.csong) {
		nowSongHTML = nowSongHTML + songsData.csong;
		}
		if (songsData.cmovie) {
		nowSongHTML = nowSongHTML + " from " + songsData.cmovie;
		}
		if (songsData.csingers) {
		nowSongHTML = nowSongHTML + "; Singer(s): " + songsData.csingers;
		}
		nowSongHTML = nowSongHTML + "</span>";
		document.querySelector('#songsId').innerHTML  = nowSongHTML;
	} else {
		document.querySelector('#songsId').innerHTML = "";
	}
	
})

ref.child('request').on("value", function(snapshot){
	var reqData = JSON.parse(JSON.stringify(snapshot.val(), null, 2));
		var reqHtml = "";
  if (reqData && reqData.to && reqData.to.name) {
	var toUrl = '#';
	var toplace= "";
    if (reqData && reqData.to && reqData.to.url) {
		toUrl = reqData.to.url;
    }
    if (reqData && reqData.to && reqData.to.place) {
		toplace = ","+reqData.to.place;
    }
	reqHtml = "This song is dedicated to <a target=_blank href="+toUrl+">"+reqData.to.name+"</a>"+toplace;
  }

  if (reqData && reqData.from && reqData.from.name) {
	var fromUrl = '#';
	var fromplace= "";
    if (reqData && reqData.from && reqData.from.url) {
		fromUrl = reqData.from.url;
    }
    if (reqData && reqData.from && reqData.from.place) {
		fromplace = ","+reqData.from.place;
    }
	reqHtml = reqHtml + " By <a target=_blank href="+fromUrl+">"+reqData.from.name+"</a>"+fromplace;
  }

  if (reqData && reqData.for) {
reqHtml = reqHtml + " "+reqData.for;
  }
    document.querySelector('#dedicateId').innerHTML  = reqHtml;
	
})	

ref.child('comments').on("value", function(snapshot){
	var commentsData = JSON.parse(JSON.stringify(snapshot.val(), null, 2));
	
	if(commentsData && commentsData.count) {
		commentsDisplayNo = Number(commentsData.count);
	}
	if(commentsDisplayNo === 1) {
  prevComments = [];
} else if(1 < commentsDisplayNo) {
      prevComments = prevComments.slice(-1 * (commentsDisplayNo-1));
}

	if(commentsData && commentsData.isShow === 'true') {
	prevComments.push({name: commentsData.name, message: commentsData.message});
	var comtAllHtml = '';
	for (var pct of prevComments) {
	if(pct.name && pct.message) {
	var chdMsg = (pct.message).replace(/(<p)/igm, '<span').replace(/<\/p>/igm, '</span>');
	comtAllHtml = comtAllHtml + "<div class=commentMsgBox><span class=commentMsgNameBox>" + pct.name +": </span><span class=commentMsgContentBox>" + chdMsg +"</span></div>";
	}
	}
	$("#commentsBoxId").show();
	document.querySelector('#commentsMsg').innerHTML = comtAllHtml;
	} else {
	$("#commentsBoxId").hide();
	}
})

ref.child('usercomments').on("value", function(snapshot){
	var userCcommentsData = JSON.parse(JSON.stringify(snapshot.val(), null, 2));
		if(userCcommentsData && userCcommentsData.isShow === 'true') {
	$("#userCommentsBoxId").show();
	} else {
	$("#userCommentsBoxId").hide();
	}
})

ref.child('notification').on("value", function(snapshot){
	var notificationData = JSON.parse(JSON.stringify(snapshot.val(), null, 2));
		if(notificationData && notificationData.isShow === 'true') {
	$("#notificationId").show();
	document.querySelector('#notificationMessageId').innerHTML = notificationData.message;
	} else {
	$("#notificationId").hide();
	}
})
ref.child('schedule').on("value", function(snapshot){
	var scheduleData = JSON.parse(JSON.stringify(snapshot.val(), null, 2));
		if(scheduleData && scheduleData.isShow === 'true' && scheduleData.title && scheduleData.message) {
	$("#scheduleBoxId").show();
	var pgmArray = scheduleData.message.split('&&');
	var schHtml = "<div class=ticker-title>" + scheduleData.title +"</div><div id=ticker-roll class=ticker><ul>";
	for (var pg of pgmArray) {
	if(pg) {
	var timPg = pg.split('||');
	schHtml = schHtml + "<li><span class=sch-time>" + timPg[0] + ":</span><span class=sch-pgm>" + timPg[1] + "</span></li>";
	}
	}
	schHtml = schHtml + "</ul></div>";
	document.querySelector('#scheduleBoxId').innerHTML = schHtml;
	$(function(){
  $.simpleTicker($("#ticker-roll"),{'effectType':'roll'});
});
	} else {
	$("#scheduleBoxId").hide();
	}
})

ref.child('dynamicadv').on("value", function(snapshot){
	var advData = JSON.parse(JSON.stringify(snapshot.val(), null, 2));
		var advHtml = "";
  if(advData.type == 'text' && advData.title && advData.disc && advData.url) {
  	advHtml ="<div class=text-adv><a href="+advData.url+" target=_blank><p class=title-text>" +advData.title+ "</p><p class=desc-text>" +advData.disc+ "</p></a><a class='ad-info-box'>Adv</a></div>";
	}

 if(advData.type == 'image' && advData.image && advData.url) {
  advHtml ="<div class=image-adv><a href="+advData.url+" target=_blank><img src="+advData.image+" alt=ClickToGo </img></a><a class='ad-info-box'>Adv</a></div>"
	}

document.querySelector('#bottomAdvId').innerHTML  = advHtml;
	})

var titleInterval = 60000;
var nextTittleDuration = 20000;
setInterval(function(){ 
  
 setTimeout(function(){ 
   
	if (showData && showData.name) {
		document.querySelector('#showName').innerHTML  = showData.name;
	} else {
	document.querySelector('#showName').innerHTML = "NOW PLAYING"
	}
	
	if (showData && showData.time) {
		document.querySelector('#showTime').innerHTML  = showData.time;
	} else {
	document.querySelector('#showTime').innerHTML = "";
	}
 
 }, nextTittleDuration);
if (showData && showData.next) {
		document.querySelector('#showName').innerHTML  = "<span class=next-title-label>NEXT: </span>" + showData.next;
		document.querySelector('#showTime').innerHTML = "";
	}
}, titleInterval);

var songDetailsInterval = 90000;
var nextSongDuration = 10000;
setInterval(function(){ 
 setTimeout(function(){ 
   	var nowSongHTML = "";
	if (songsData.csong || songsData.cmovie || songsData.csingers) {
	var nowSongHTML = "<span class=cur-title><img height=12 width=12 src=https://1.bp.blogspot.com/-2-3Ad31vLZQ/Xrap4or3seI/AAAAAAAACa0/7jXWqqzd68YNDHw03gLGeH22FmP3t07wgCK4BGAsYHg/interface.png></img> PLAYING: </span><span class=cur-content>";
		if (songsData.csong) {
		nowSongHTML = nowSongHTML + songsData.csong;
		}
		if (songsData.cmovie) {
		nowSongHTML = nowSongHTML + " from " + songsData.cmovie;
		}
		if (songsData.csingers) {
		nowSongHTML = nowSongHTML + "; Singer(s): " + songsData.csingers;
		}
		nowSongHTML = nowSongHTML + "</span>";
		document.querySelector('#songsId').innerHTML  = nowSongHTML;
	} else {
		document.querySelector('#songsId').innerHTML = "";
	}
 
 }, nextSongDuration);
	var nextSongHTML = "";
	if (songsData.nsong || songsData.nmovie || songsData.nsingers) {
	var nextSongHTML = "<span class=next-title><img width=10 height=10 src=https://1.bp.blogspot.com/-Zn2F6Ee8frQ/Xrarcf0tU_I/AAAAAAAACbQ/_cvLWvqhxcgLSRv84paZlO8IE5W4mv9yQCK4BGAsYHg/multimedia-option.png></img> NEXT: </span><span class=next-content>";
		if (songsData.nsong) {
		nextSongHTML = nextSongHTML + songsData.nsong;
		}
		if (songsData.nmovie) {
		nextSongHTML = nextSongHTML + " from " + songsData.nmovie;
		}
		if (songsData.nsingers) {
		nextSongHTML = nextSongHTML + "; Singer(s): " + songsData.nsingers;
		}
		nextSongHTML = nextSongHTML + "</span>";
		document.querySelector('#songsId').innerHTML  = nextSongHTML;
	}
}, songDetailsInterval);
