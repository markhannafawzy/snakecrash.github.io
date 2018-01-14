   var playerName;

		flag=getSound();
   function checkname()  
          {
              playerName =document.getElementById("fname").value;
   if(playerName.trim()==""){document.getElementById("msg").innerHTML="enter your name";
   }       
          else{
			 
		  window.open("game.html?"+playerName+"?"+flag,'_top');
		  }
		  }
	function togglePlay()
    {
     // var btntog = document.getElementById("tog");
     var myAudio = document.getElementById("lostmojo");
	
	if( myAudio.paused &&flag=="false"){
		myAudio.play();
		flag=true;
		 setSound("true");
		//document.getElementById('tog').checked;
	}
	else {
		
		myAudio.pause();
		flag=false;
		setSound("false");
		
	}
	
    }	  
	function getName(){
		return playerName;
	}
	function checkSound(){
		var input_div=document.getElementById('tog').checked;
		
	}