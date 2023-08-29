var callbackBuzzer;
var callbackInterface;

function sendMesssageToBuzzer(message){
    if (typeof callbackBuzzer === 'function') {
        callbackBuzzer(message);
    }
}

function sendMesssageToInterface(message){
    if (typeof callbackInterface === 'function') {
        callbackInterface(message);
    }
}

const setcallbackBuzzer = (callback) =>{
    callbackBuzzer = callback;
}

const setcallbackInterface = (callback) =>{
    callbackInterface = callback;
}



//== Code QCPU start here ===============================================

var Points = [1,2,3,4,4,0];
const State = {
    RESET: 'RESET',
    PLAY: 'PLAY',
    ACCEPTREFUSE: 'ACCEPTREFUSE',
    WINNER: 'WINNNER',
    ACCEPTREFUSEtoPLAYdelay: 'ACCEPTREFUSEtoPLAYdelay',
    RESETtoPLAYdelay: 'RESETtoPLAYdelay'
  };
var currentState = State.RESET
var currentMatch3PointWinner = false
var numBuzzerThatBuzzed
var buzzerisLock = false

const fromInterface = (separated) =>{
    console.log(separated);

    if(separated.command == "Start" && separated.value == "/QuestionPourUnChampion.html"){
        Points = [0,0,0,0,0,0]
        updateaffichagePoint()
        currentState = State.RESET
        console.log(currentState)
    }else if(separated.command == "boutonReset"){
        Points = [0,0,0,0,0,0]
        updateaffichagePoint()
        updateInterfaceweb()
        sendMesssageToInterface('noTarget')
        currentState = State.RESETtoPLAYdelay
        sendMesssageToInterface('SoundPlay:sons/generique.wav')
        console.log(currentState)
        setTimeout(() => {
            currentState = State.PLAY;
            console.log(currentState)
          }, 7000);  
    }
    else if(separated.command == "boutonAccepter" && currentState == State.ACCEPTREFUSE){
        buzzerlightoff()
        sendMesssageToInterface('SoundPlay:sons/bonne.wav')
        sendMesssageToInterface('noTarget')
        Points[numBuzzerThatBuzzed-1] = Points[numBuzzerThatBuzzed-1] + 1
        updateaffichagePoint()
        updateInterfaceweb()
        currentState = State.ACCEPTREFUSEtoPLAYdelay
        console.log(currentState)
        setTimeout(() => {
            currentState = State.PLAY;
            checkWinner();
            console.log(currentState)
          }, 1000); 
    }
    else if(separated.command == "boutonRefuser" && currentState == State.ACCEPTREFUSE){
        buzzerlightoff()
        sendMesssageToInterface('SoundPlay:sons/mauvaise.wav')
        sendMesssageToInterface('noTarget')
        updateaffichagePoint()
        updateInterfaceweb()
        currentState = State.ACCEPTREFUSEtoPLAYdelay
        console.log(currentState)
        setTimeout(() => {
            currentState = State.PLAY;
            console.log(currentState)
          }, 500);        
    }
    else if(separated.command == "checkboxDesactivation" && separated.value == "true"){
        buzzerisLock = true
    }
    else if(separated.command == "checkboxDesactivation" && separated.value == "false"){
        buzzerisLock = false
    }
    else if(separated.command == "checkboxMatchEn3Points" && separated.value == "true"){
        currentMatch3PointWinner = true
        updateaffichagePoint()
        checkWinner()
    }
    else if(separated.command == "checkboxMatchEn3Points" && separated.value == "false"){
        currentMatch3PointWinner = false
        updateaffichagePoint()
        checkWinner()
    }
    else if(separated.command.slice(0, -2) == "boutonChangeScore"){
        if(separated.command.slice(-1)=="M"){
            var numBuzzerScoreChange = parseInt(separated.command.slice(-2,-1))
            if(Points[numBuzzerScoreChange-1]>0){
                Points[numBuzzerScoreChange-1] = Points[numBuzzerScoreChange-1] - 1;
            }            
        }
        else{
            var numBuzzerScoreChange = parseInt(separated.command.slice(-2,-1))
            if(Points[numBuzzerScoreChange-1]<5 && !currentMatch3PointWinner || Points[numBuzzerScoreChange-1]<3 && currentMatch3PointWinner){
                Points[numBuzzerScoreChange-1] = Points[numBuzzerScoreChange-1] + 1;
            }   
        }
        updateaffichagePoint()
        updateInterfaceweb()
        checkWinner()
    }

    //sendMesssageToInterface('SoundPlay:sons/Frozen.wav')
    //Points++;
}


const fromBuzzer = (separated) =>{
    console.log(separated);
    if((separated.command == "boutonBuzzer1"||
        separated.command == "boutonBuzzer2"||
        separated.command == "boutonBuzzer3"||
        separated.command == "boutonBuzzer4"||
        separated.command == "boutonBuzzer5"||
        separated.command == "boutonBuzzer6") && separated.value == "1" && currentState == State.PLAY && buzzerisLock == false){
        numBuzzerThatBuzzed = parseInt(separated.command.slice(-1));
        sendMesssageToInterface('SoundPlay:sons/buzze.wav')
        sendMesssageToInterface('targetBuzzer'+numBuzzerThatBuzzed)
        sendMesssageToBuzzer('lightBuzzer'+numBuzzerThatBuzzed+':1;')
        sendMesssageToBuzzer('ledBuzzer'+numBuzzerThatBuzzed+':animation_Flash;')
        setTimeout(() => {
                updateaffichagePoint()
                updateInterfaceweb()          
        }, 2000);
        currentState = State.ACCEPTREFUSE
        console.log(currentState)        
    }
}

function checkWinner(){
    for(var i = 0; i<6;i++){
        if(Points[i]>=5 && currentMatch3PointWinner == false){
            sendMesssageToInterface('targetBuzzer'+(i+1))
            sendMesssageToInterface('SoundPlay:sons/gagnant.wav')
            currentState = State.WINNER
        }
        else if(Points[i]>=3 && currentMatch3PointWinner == true){
            sendMesssageToInterface('targetBuzzer'+(i+1))
            sendMesssageToInterface('SoundPlay:sons/gagnant.wav')
            currentState = State.WINNER
        }
    }
}


function updateInterfaceweb(){
    for(var i = 0; i<6;i++){
        sendMesssageToInterface('changeScoreBuzzer'+(i+1)+':'+Points[i])
    }
}

function updateaffichagePoint(){
    if(currentMatch3PointWinner == false){
        for(var i = 0; i<6;i++){
            if(Points[i]==0){sendMesssageToBuzzer('ledBuzzer'+(i+1)+':off,off,off,off,off;')}
            else if(Points[i]==1){sendMesssageToBuzzer('ledBuzzer'+(i+1)+':spart,off,off,off,off;')}
            else if(Points[i]==2){sendMesssageToBuzzer('ledBuzzer'+(i+1)+':spart,spart,off,off,off;')}
            else if(Points[i]==3){sendMesssageToBuzzer('ledBuzzer'+(i+1)+':spart,spart,spart,off,off;')}
            else if(Points[i]==4){sendMesssageToBuzzer('ledBuzzer'+(i+1)+':spart,spart,spart,spart,off;')}
            else if(Points[i]==5){sendMesssageToBuzzer('ledBuzzer'+(i+1)+':spart,spart,spart,spart,spart;')}
        }
    }
    else{
        for(var i = 0; i<6;i++){
            if(Points[i]==0){sendMesssageToBuzzer('ledBuzzer'+(i+1)+':red,off,off,off,red;')}
            else if(Points[i]==1){sendMesssageToBuzzer('ledBuzzer'+(i+1)+':red,spart,off,off,red;')}
            else if(Points[i]==2){sendMesssageToBuzzer('ledBuzzer'+(i+1)+':red,spart,spart,off,red;')}
            else if(Points[i]==3){sendMesssageToBuzzer('ledBuzzer'+(i+1)+':red,spart,spart,spart,red;')}
        }
    }
}

function buzzerlightoff(){
    sendMesssageToBuzzer('lightBuzzer1:0;')
    sendMesssageToBuzzer('lightBuzzer2:0;')
    sendMesssageToBuzzer('lightBuzzer3:0;')
    sendMesssageToBuzzer('lightBuzzer4:0;')
    sendMesssageToBuzzer('lightBuzzer5:0;')
    sendMesssageToBuzzer('lightBuzzer6:0;')
}

//== Code QCPU finish here ===============================================


module.exports.setcallbackSendToInterface = setcallbackInterface;
module.exports.setcallbackSendToBuzzer = setcallbackBuzzer;
module.exports.fromBuzzer = fromBuzzer;
module.exports.fromInterface = fromInterface;