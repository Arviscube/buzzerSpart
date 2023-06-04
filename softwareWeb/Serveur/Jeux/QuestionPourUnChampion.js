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

const fromInterface = (message) =>{
    console.log(message);
    sendMesssageToInterface('changeScoreBuzzer6:'+Points)
    sendMesssageToInterface('SoundPlay:sons/Frozen.wav')
    Points++;
}


const fromBuzzer = (message) =>{

}

//== Code QCPU finish here ===============================================


module.exports.setcallbackSendToInterfaceQPUC = setcallbackInterface;
module.exports.setcallbackSendToBuzzerQPUC = setcallbackBuzzer;
module.exports.fromBuzzer = fromBuzzer;
module.exports.fromInterface = fromInterface;