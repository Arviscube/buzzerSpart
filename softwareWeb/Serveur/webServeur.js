const WebSocket = require('ws');

var callbackOnData;
var callbackOnConnection;

//Variable
const wss = new WebSocket.Server({port: 8080});


wss.on('connection', (ws) => {
  console.log('Client WebSocket connecté');
  if (typeof callbackOnConnection === 'function') {
    callbackOnConnection();
  }

  // Écouter les messages WebSocket des clients
  ws.on('message', (message) => {
    if (typeof callbackOnData === 'function') {
      callbackOnData(message.toString());
    }
  });
});

const  setcallbackOnConnection = (callbackOnEntre) =>{
  callbackOnConnection = callbackOnEntre;
}

const setcallbackOnData = (callbackOnDataEntre) =>{
  callbackOnData = callbackOnDataEntre;
}


module.exports.setcallbackOnData = setcallbackOnData;
module.exports.sendMessageToInterface = sendMessageToInterface;
module.exports.setcallbackOnConnection = setcallbackOnConnection;

//Function
function sendMessageToInterface (message){
    wss.clients.forEach((client) => {
        client.send(message);
    });
}