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

var Points = 0;

const fromInterface = (separated) =>{
    console.log(separated);
    sendMesssageToInterface('changeScoreBuzzer5:'+Points)
    //sendMesssageToInterface('SoundPlay:sons/Frozen.wav')
    Points++;
}


const fromBuzzer = (separated) =>{
    console.log(separated);
    sendMesssageToInterface('changeScoreBuzzer5:'+Points)
    sendMesssageToInterface('SoundPlay:sons/buzze.wav')
    sendMesssageToBuzzer('lightBuzzer2:'+Points%2+';')
    sendMesssageToBuzzer('ledBuzzer2:red,red,spart,red,red;')
    Points++;
}

//== Code QCPU finish here ===============================================


module.exports.setcallbackSendToInterface = setcallbackInterface;
module.exports.setcallbackSendToBuzzer = setcallbackBuzzer;
module.exports.fromBuzzer = fromBuzzer;
module.exports.fromInterface = fromInterface;