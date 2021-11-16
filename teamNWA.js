const OBSWebSocket = require('obs-websocket-js');
var io = require('socket.io-client');
user = "MokGame";
audio = 'MokAudio';
onAir = 'MokOnAir';
PDcoolDown = false;
minimumTimerExpired = true;
fullTimerExpired = true;
var FiveTimerID;
var FideenTimerID;
timeAmount = 300000; //5 minute timer on scene switches
donateTimeAmount = 900000; //15 minute donation
donateTimeRestrict = 180000; // restrict changing for 3 minutes
minimumDonateAmount = 1.99;
var DonoCoolDownAmount = 1000;
var MokCyko = false;
var MokClam = false;
var CykoClam = false;
var ClamCykoMok = true;
var split = true;
var fullscreen = false;
var mode = 'split';
//const socketToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbiI6IkZCNTlFNEQ1MkIxNEZCOTkzMUQzIiwicmVhZF9vbmx5Ijp0cnVlLCJwcmV2ZW50X21hc3RlciI6dHJ1ZSwidHdpdGNoX2lkIjoiMTM4NzIzMTYwIn0.SEJMdad8dKPvo1OM7-E7sdI87wuIa16ts9alHJ7rshI'; //Socket token from /socket/token end point
//const socketToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbiI6Ijg1Q0JFQkI2RkJFNDZEMTA4QzczIiwicmVhZF9vbmx5Ijp0cnVlLCJwcmV2ZW50X21hc3RlciI6dHJ1ZSwidHdpdGNoX2lkIjoiNDIzNzQ5MzY2In0.y4sI0sw_tbR1CwMJfHWktaatcA3os-HJYJZJ6a1hf3w';
        //Connect to socket
const socketToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbiI6IjNDNDBBQUI1NjRBMEJBREExMDBDIiwicmVhZF9vbmx5Ijp0cnVlLCJwcmV2ZW50X21hc3RlciI6dHJ1ZSwidHdpdGNoX2lkIjoiNDIzNzQ5MzY2In0.W2fue0PFePfKg7hadQTlNeKjX9-MwpK55Xf37--WpQw';
//const socketToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbiI6IjNERDRDMkU4RjlGNTBBQTY5NjgzIiwicmVhZF9vbmx5Ijp0cnVlLCJwcmV2ZW50X21hc3RlciI6dHJ1ZSwidHdpdGNoX2lkIjoiNDIzNzQ5MzY2In0.xMlT2vK409CsK_4_pXXvTG0uVi7AjXj1nCCGoIdHPKY';
const streamlabs = io(`https://sockets.streamlabs.com?token=${socketToken}`, {transports: ['websocket']});
const obs = new OBSWebSocket();
obs.connect({address: 'localhost:4444',password: 'B1gH4x'})
    .then(() => {
        console.log(`Success! We're connected & authenticated.`);
console.log("E");
        FiveTimerID = setInterval(TOfunc,timeAmount);
	
	obs.send('SetSourceRender', { source:'5timer', render: false, scene:'RainbowSixSiege'});
	setTimeout(function(){obs.send('SetSourceRender', { source:'5timer', render: true, scene:'RainbowSixSiege'})}, 1000);
	//obs.send('SetSourceRender', { source:'JeffreyRainbow', render: true, scene:'RainbowSixSiege'});
        //Perform Action on event
        streamlabs.on('event', (eventData) => 
        {
            if (!eventData.for || eventData.for === 'streamlabs' && eventData.type === 'donation') {
            //code to handle donation events
            processDonation(eventData.message);
            console.log("Donation");
          }
          if (eventData.for === 'twitch_account') {
            switch(eventData.type) {
              case 'follow':
                console.log(eventData.message);
                console.log("Follow");
                break;
              case 'subscription':
                //code to handle subscription events
                console.log(eventData.message);
	        console.log("subscription");
             break;
	       case 'bits':
	         //processBitDonation(eventData.message);
	         console.log(eventData.message);
	         console.log("bits");
  	        break;
             default:
                //default case
                console.log(eventData.message);
                console.log("other");
             }
           }
        });

        return obs.send('GetSceneList');
    })
    .then(data => {
        console.log(`${data.scenes.length} Available Scenes!`);

        /*data.scenes.forEach(scene => {
            if (scene.name !== data.currentScene) {
                console.log(`Found a different scene! Switching to Scene: ${scene.name}`);

                //obs.send('SetCurrentScene', {
                //    'scene-name': scene.name
               // });
            }
        });*/
    })
    .catch(err => { // Promise convention dictates you have a catch on every chain.
        console.log(err);
    });

obs.on('SwitchScenes', data => {
    console.log(`New Active Scene: ${data.sceneName}`);
});

// You must add this handler to avoid uncaught exceptions.
obs.on('error', err => {
    console.error('socket error:', err);
});
//obs.send('SetSceneItemRender', { source:'ClamGame', render: true});
//obs.send('SetSceneItemRender', { source:'JeffreyRainbow', render: false});
//obs.send('GetSourceSettings', {sourceName:'JeffreyRainbow'}, function(err, data){
//	debugger;
//	data.render = false;
//        obs.send('SetSourceSettings', {sourceName:'JeffreyRainbow',sourceSettings: data});
//	});
//obs.send('GetSourceSettings', {sourceName:'ClamGame'}, function(err, data){
//	data.render = true;
//       obs.send('SetSourceSettings', {sourceName:'ClamGame',sourceSettings: data});
//	});
//obs.send('GetSourceSettings', {sourceName:'ClamGAme'});
//
//
//

function processDonation(message) {
 if (minimumTimerExpired == true && PDcoolDown == false)
 {
	
	// client.sayHello({name: "Mokdore"}, function(err, response) {
    //console.log('Greeting:', response)});
	 PDcoolDown = true;
	 setTimeout(function(){PDcoolDown = false;}, DonoCoolDownAmount);
	 console.log("Message.amount is ");
	 console.log(message[0].amount);
	 console.log("Message.message is ");
	 console.log(message[0].message);
	 amount = parseInt(message[0].amount,10);
	 console.log("Amount is ");
	 console.log(amount);
    if (message[0].amount > minimumDonateAmount)
    {
       //message[0].message = "Show me ClamPharts";
	 console.log("<inside block>Message.message is ");
	 console.log(message[0].message);
       //Message must contain Show me ClamPharts! or Show me Mokdore! or Show me Cyko_Mok! or Random Scene!
       userold = user;
       resetClock = false;
       if (message[0].message.search(/Show me ClamPharts/i) != -1 && (ClamCykoMok || CykoClam || MokClam))
       {
       if (message[0].message.search(/Splitscreen/i) != -1 && ClamCykoMok)
	  fullscreen = false;
	
	       //client.sayHello({name:"ClamPharts"});
           //obs.send('SetSceneItemRender', { source:'ClamGame', render: true});
	   //obs.send('SetSceneItemRender', { source:user, render: false});
           obs.send('SetSourceRender', { source:user, render: false, scene:'RainbowSixSiege'});
   	   obs.send('SetSourceRender', { source:audio, render: false, scene:'RainbowSixSiege'});
   	   obs.send('SetSourceRender', { source:onAir, render: false, scene:'RainbowSixSiege'});
	   
	   user = 'MokGame';
	   usernext = 'ClamGame';
	   console.log("ClamPharts")
	   resetClock = true;
       }
       else if (message[0].message.search(/Show me Mokdore/i) != -1 && (ClamCykoMok || MokCyko || MokClam))
	{
           //client.sayHello({name:"Mokdore"});
           if (message[0].message.search(/Splitscreen/i) != -1 && ClamCykoMok)
	      fullscreen = false;
   	   obs.send('SetSourceRender', { source:user, render: false, scene:'RainbowSixSiege'});
   	   obs.send('SetSourceRender', { source:audio, render: false, scene:'RainbowSixSiege'});
   	   obs.send('SetSourceRender', { source:onAir, render: false, scene:'RainbowSixSiege'});
	   user = 'CykoGame';
           usernext = 'Mokdore';
	   console.log("Mokdore")
	   resetClock = true;
	}
       else if (message[0].message.search(/Show me Cyko_Mok/i) != -1 && (ClamCykoMok || MokCyko || CykoClam))
	{ 
           if (message[0].message.search(/Splitscreen/i) != -1 && ClamCykoMok)
	      fullscreen = false;
  	    obs.send('SetSourceRender', { source:user, render: false, scene:'RainbowSixSiege'});
  	    obs.send('SetSourceRender', { source:audio, render: false, scene:'RainbowSixSiege'});
  	    obs.send('SetSourceRender', { source:onAir, render: false, scene:'RainbowSixSiege'});
            user = 'ClamGame';
            usernext = 'CykoGame';
	//client.sayHello({name:"Cyko_MOK"});
	   console.log("Cyko");
	    resetClock = true;
	}
       else if(message[0].message.search(/Random scene/i) != -1)
	{
  	    obs.send('SetSourceRender', { source:user, render: false, scene:'RainbowSixSiege'});
  	    obs.send('SetSourceRender', { source:audio, render: false, scene:'RainbowSixSiege'});
   	    obs.send('SetSourceRender', { source:onAir, render: false, scene:'RainbowSixSiege'});
	   //client.sayHello({name:"Random"});
	   console.log("Random")
           //confusion because the user set values below are the previous turn's user's name
           n = Math.floor(Math.random() * 3);
	   if (n == 0)
	      user = 'MokGame';
           else if ( n == 1)
	      user = 'ClamGame';
	   else if ( n == 2)
              user = 'CykoGame';
	   if (MokCyko == true)
	   {
	      n = Math.floor(Math.random() * 2);
	      if (n == 0)
	         user = 'CykoGame';
              else if ( n == 1)
	         user = 'ClamGame';
           }
	   if (MokClam == true)
	   {
	      n = Math.floor(Math.random() * 2);
	      if (n == 0)
	         user = 'CykoGame';
              else if ( n == 1)
	         user = 'MokGame';
	   }
	   if (CykoClam == true)
	   {
	      n = Math.floor(Math.random() * 2);
	      if (n == 0)
	         user = 'MokGame';
              else if ( n == 1)
	         user = 'ClamGame';
	   }
	   resetClock = true;
	}

	if (resetClock == true)
	{

	    TOfunc();
	    obs.send('SetSourceRender', { source:'15timer', render: false, scene:'RainbowSixSiege'});
	    obs.send('SetSourceRender', { source:'15timerB', render: false, scene:'RainbowSixSiege'});
	    obs.send('SetSourceRender', { source:'5timer', render: false, scene:'RainbowSixSiege'});
            clearInterval(FiveTimerID); 
	    clearInterval(FideenTimerID);
	    setTimeout(function(){minimumTimerExpired = true;obs.send('SetSourceRender', { source:'15timer', render: false, scene:'RainbowSixSiege'});}, donateTimeRestrict);
	    console.log("A");
            FideenTimerID = setTimeout(FideenExpire,donateTimeAmount);
	    console.log("B");
	    setTimeout(startTimers, 250); //Give the videos time to 'restart'
            minimumTimerExpired = false;
            fullTimerExpired = false;

	    resetClock = false;
	    console.log("Reset Clock");
	}
    }
 }
}
function FideenExpire() { //Fifteen expire
	FulltimerExpired = true;
	obs.send('SetSourceRender', { source:'15timerB', render: false, scene:'RainbowSixSiege'});
	obs.send('SetSourceRender', { source:'5timer', render: true, scene:'RainbowSixSiege'});
	TOfunc();
	console.log("D");
	FiveTimerID = setInterval(TOfunc,timeAmount);
	console.log("Z");
}
function startTimers() {
	obs.send('SetSourceRender', { source:'15timerB', render: true, scene:'RainbowSixSiege'});
	obs.send('SetSourceRender', { source:'15timer', render: true, scene:'RainbowSixSiege'});
}

function processBitDonation(message) {
 if (minimumTimerExpired == true)
 {
	// client.sayHello({name: "Mokdore"}, function(err, response) {
    //console.log('Greeting:', response)});

    if (message.amount > 200)
    {
       minimumTimerExpired = false;
       message.message = "Show me ClamPharts";
       console.log("C");//unmeaningful debug statement
       //setTimeout(function(){minimumTimerExpired = true;}, timeAmount)
       //Message must contain Show me ClamPharts! or Show me Mokdore! or Show me Cyko_Mok! or Random Scene!
       if (message.message.search("/Show me ClamPharts/i"))
       {
   obs.send('SetSourceRender', { source:user, render: false, scene:'RainbowSixSiege'});
   obs.send('SetSourceRender', { source:audio, render: false, scene:'RainbowSixSiege'});
   obs.send('SetSourceRender', { source:onAir, render: false, scene:'RainbowSixSiege'});
           obs.send('SetSceneItemRender', { source:'ClamGame', render: true});
	   obs.send('SetSceneItemRender', { source:user, render: false});
	   user = ClamGame;
	   console.log("ClamPharts")
       }
       else if (message.message.search("/Show me Mokdore/i"))
	{
           client.sayHello({name:"Mokdore"});
	   console.log("Mokdore")
	}
       else if (message.message.search("/Show me Cyko_Mok/i"))
	{ 
           client.sayHello({name:"Cyko_MOK"});
	   console.log("Cyko")
	}
       else (message.message.search("/Random scene/i"))
	{
	   client.sayHello({name:"Random"});
	   console.log("Random")
	}
    }
 }
}
// Mok:0, Clam:1, Cyko:2
function TOfunc() {
   console.log('TOfuncEntry');
   current = -1;
   next = -1;
   if (user.localeCompare('MokGame') == 0) {
	current = 0;
	next = 1;
   }      
   if (user.localeCompare('ClamGame') == 0)
   {
	current = 1;
	next = 2;
   }
   if (user.localeCompare('CykoGame') == 0)
   {
	current = 2;
	next = 0;
   }   
   if (user.localeCompare('LocalGame') == 0)
   {
	current = 3;
	next = 0;
   }   
if(MokClam == true)
{
   if (user.localeCompare('MokGame') == 0) {
	current = 0;
	next = 1;
   }      
   if (user.localeCompare('ClamGame') == 0)
   {
	current = 1;
	next = 0;
   }
/*   if (user.localeCompare('CykoGame') == 0)
   {
	current = 2;
	next = 0;
   }   
   if (user.localeCompare('LocalGame') == 0)
   {
	current = 3;
	next = 0;
   }*/
}
if (MokCyko == true)
{
   if (user.localeCompare('MokGame') == 0) {
	current = 0;
	next = 2;
   }      
  /* if (user.localeCompare('ClamGame') == 0)
   {
	current = 1;
	next = 2;
   }*/
   if (user.localeCompare('CykoGame') == 0)
   {
	current = 2;
	next = 0;
   }   
/*   if (user.localeCompare('LocalGame') == 0)
   {
	current = 3;
	next = 0;
   }*/
}
if (CykoClam)
{
   if (user.localeCompare('MokGame') == 0) {
	current = 0;
	next = 1;
   }      
   if (user.localeCompare('ClamGame') == 0)
   {
	current = 1;
	next = 2;
   }
   if (user.localeCompare('CykoGame') == 0)
   {
	current = 2;
	next = 1;
   }   
   if (user.localeCompare('LocalGame') == 0)
   {
	current = 3;
	next = 0;
   }   
}
   /*next = Math.floor(Math.random() * 3);
   while( next == current)
      next = Math.floor(Math.random() * 3);*/
   obs.send('SetSourceRender', { source:user, render: false, scene:'RainbowSixSiege'});
   obs.send('SetSourceRender', { source:audio, render: false, scene:'RainbowSixSiege'});
   obs.send('SetSourceRender', { source:onAir, render: false, scene:'RainbowSixSiege'});
   if(next == 0)
   {
	user = 'MokGame';
	audio = 'MokAudio';
	onAir = 'MokOnAir';
   }	   
   else if (next == 1)
   {
	audio = 'ClamAudio';
	user = 'ClamGame';
	onAir = 'ClamOnAir';
   }
   else if (next == 2)
   {
	user = 'CykoGame';
	audio = 'CykoAudio';
	onAir = 'CykoOnAir';
   }
   else if (next == 3)
   {
	user = 'LocalGame';
	audio = 'None';
	onAir = 'InsurgentOnAir';
   }
   if (fullscreen == false)
   {
       if (user.localeCompare('MokGame') == 0)
       {
          scene = 'MokSplit';
	  obs.send('SetCurrentScene', scene);
	  obs.send('ToggleMute', 'CykoGame');
	  obs.send('ToggleMute', 'CykoGame');
       }
       if (user.localeCompare('ClamGame') == 0)
	  scene = 'ClamSplit;
       if (user.localeCompare('CykoGame') == 0)
	  scene = 'CykoSplit;
   }
   else
   {
      console.log('Source Change');
      obs.send('SetSourceRender', { source:user, render: true, scene:'RainbowSixSiege'});
      obs.send('SetSourceRender', { source:audio, render: true, scene:'RainbowSixSiege'});
      obs.send('SetSourceRender', { source:onAir, render: true, scene:'RainbowSixSiege'});
   }   
}
