const http = require('http')
const fs = require('fs')
const port = 3000
const express = require('express');
const app = express();

const webServeur = require('./webServeur');
const TCPServeur = require('./TCPServeur');
const QPUC = require('./Jeux/QuestionPourUnChampion');

//Variable
var Points = 1;
var jeuxEnCours = "/";


webServeur.setcallbackOnConnection(interfaceConnection);
webServeur.setcallbackOnData(receiveMessageFromInterface);
TCPServeur.setcallbackOnData(receiveMessageFromBuzzer);
TCPServeur.setcallbackBuzzerStatusChange(StatusBuzzer);

QPUC.setcallbackSendToBuzzerQPUC(TCPServeur.sendMessageToBuzzer);
QPUC.setcallbackSendToInterfaceQPUC(webServeur.sendMessageToInterface);

function interfaceConnection(){
  webServeur.sendMessageToInterface('loadPage:'+jeuxEnCours);
}

function receiveMessageFromBuzzer(message){
  console.log(message);
  if(jeuxEnCours=="StartQPUC"){
    QPUC.fromBuzzer(message);
  }
  else if(jeuxEnCours == 'StartReflexe'){

  }
};

function receiveMessageFromInterface(message){
  console.log(message);
  var separated =  separerCommandeEtValeur(message);  
  if(separated.command == "Start"){
    console.log(jeuxEnCours);
    jeuxEnCours = separated.value;
    webServeur.sendMessageToInterface('loadPage:'+jeuxEnCours);
  }
  else if(jeuxEnCours == 'StartReflexe'){
    jeuxEnCours = message;
  }
  console.log(message);

  if(jeuxEnCours=="StartQPUC"){
    QPUC.fromInterface(message);
  }
  else if(jeuxEnCours == 'StartReflexe'){

  }
};


function separerCommandeEtValeur(chaine) {
  const separator = ':';
  const indexSeparator = chaine.indexOf(separator);
  
  if (indexSeparator === -1) {
    return chaine;
  }   
  const command = chaine.substring(0, indexSeparator).trim();
  const value = chaine.substring(indexSeparator + 1).trim();
  return { command, value };
}



function StatusBuzzer(message){
  message.forEach((value,i) => {  
    if(message[i]<=0){
      webServeur.sendMessageToInterface('StatusBuzzer'+(i+1)+':red');
    }
    else{
      webServeur.sendMessageToInterface('StatusBuzzer'+(i+1)+':green');
    }
  });
};







var staticFilesPath = '/../BuzzerUI';
staticFilesPath = __dirname + staticFilesPath;
console.log(staticFilesPath);
app.use(express.static(staticFilesPath, { index: 'index.html' }));


app.listen(port,function(error){
    if(error){
        console.log('something went wrong',error)
    }
    else{
        console.log('Server is listening on port ' + port)
    }
})