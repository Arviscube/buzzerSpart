//TCP

const net = require('net');

const clientSockets = [];
const numberBuzzer = 6;
var ackBuzzer = new Array(numberBuzzer).fill(-1);
console.log(ackBuzzer);
var callbackBuzzerStatusChange;
var callbackOnData;

function ControleConnexionBuzzer() {
    ackBuzzer.forEach((value,i) => {
        if(ackBuzzer[i]==0){
            console.log('Buzzer '+(i+1)+' deconnecté');
        }
        if(ackBuzzer[i]>=0){
            ackBuzzer[i] = ackBuzzer[i]-1
        }
    });
    if (typeof callbackBuzzerStatusChange === 'function') {
        callbackBuzzerStatusChange(ackBuzzer);
    }
}  
setInterval(ControleConnexionBuzzer, 200);

// Créer un serveur TCP
const tcpServer = net.createServer((socket) => {
    console.log('Client connecté');
    clientSockets.push(socket);

    socket.on('data', (message) => {
        const frames = String(message).split("!").filter(data => data !== "");
        for (const data of frames) {
            var messageIsAck = false;
            for(var i = 0; i<numberBuzzer;i++){
                if(data=='buzzer'+(i+1)+':ok'){
                    messageIsAck = true;
                    if(ackBuzzer[i] == -1){
                        ackBuzzer[i] = 5;
                        console.log('Buzzer '+(i+1)+' connecté');
                    }
                    ackBuzzer[i] = 5;
                }
            }      
            if(messageIsAck == false && typeof callbackOnData === 'function') {
                callbackOnData(data.toString());
            }
        }
    });

    socket.on('error', (error) => {
        console.error('Erreur survenue sur le socket:', error);
    });
});

tcpServer.listen(8088, () => {
    console.log('Serveur TCP démarré');
});

const setcallbackBuzzerStatusChange = (callbackBuzzerStatusChangeEntre) =>{
    callbackBuzzerStatusChange = callbackBuzzerStatusChangeEntre;
}

const setcallbackOnData = (callbackOnDataEntre) =>{
    callbackOnData = callbackOnDataEntre;
}

module.exports.setcallbackOnData = setcallbackOnData;
module.exports.setcallbackBuzzerStatusChange = setcallbackBuzzerStatusChange;
module.exports.sendMessageToBuzzer = sendMessageToBuzzer;

function sendMessageToBuzzer(message){
    clientSockets.forEach((socket,index) => {
        if (socket.writable) {
            socket.write(message);
        }
        else{
            clientSockets.splice(index, 1);
        }
    });
}