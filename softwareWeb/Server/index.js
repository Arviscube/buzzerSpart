const http = require('http')
const fs = require('fs')
const express = require('express');
const app = express();

const webServeur = require('./webServeur');
const TCPServeur = require('./TCPServeur');
const QPUCGame = require('./Jeux/QuestionPourUnChampion');
const AnimationGame = require('./Jeux/Animation');


const port = 3000
var staticFilesPath = '/../BuzzerUI';
staticFilesPath = __dirname + staticFilesPath;
console.log(staticFilesPath);
var jeuxEnCours = "/menu.html";
var firstConnection = false;


webServeur.setcallbackOnConnection(interfaceConnection);
webServeur.setcallbackOnData(receiveMessageFromInterface);
TCPServeur.setcallbackOnData(receiveMessageFromBuzzer);
TCPServeur.setcallbackBuzzerStatusChange(StatusBuzzer);


function setcallbackGame(game){
  if(game == "/QuestionPourUnChampion.html"){
    QPUCGame.setcallbackSendToBuzzer(TCPServeur.sendMessageToBuzzer);
    QPUCGame.setcallbackSendToInterface(webServeur.sendMessageToInterface);
  }
  else if(game == "/Animation.html"){
    AnimationGame.setcallbackSendToBuzzer(TCPServeur.sendMessageToBuzzer);
    AnimationGame.setcallbackSendToInterface(webServeur.sendMessageToInterface);
  }
}


function interfaceConnection(){
  fs.readFile(staticFilesPath+jeuxEnCours, 'utf8', (err, fileContent) => {
    if (err) {
      console.error('Une erreur s\'est produite lors de la lecture du fichier :', err);
    }
    else{
      webServeur.sendMessageToInterface('loadPage:' + fileContent);
    }
  });
}


//== massage from buzzer to serveur ================================================================

function receiveMessageFromBuzzer(message){
  var separated =  separerCommandeEtValeur(message); 
  if(jeuxEnCours=="/QuestionPourUnChampion.html"){
    QPUCGame.fromBuzzer(separated);
  }
  else if(jeuxEnCours == '/Animation'){
    AnimationGame.fromBuzzer(separated);
  }
  else if(jeuxEnCours == 'StartReflexe'){

  }
};

//== message from interface to serveur ================================================================
function receiveMessageFromInterface(message){
  var separated =  separerCommandeEtValeur(message);  
  if(separated.command == "Start"){
    jeuxEnCours = separated.value;
    console.log("\n\n== "+ jeuxEnCours + " ================================================");
    setcallbackGame(jeuxEnCours);
    fs.readFile(staticFilesPath+jeuxEnCours, 'utf8', (err, fileContent) => {
      if (err) {
        console.error('Une erreur s\'est produite lors de la lecture du fichier :', err);
      }
      else{
        webServeur.sendMessageToInterface('loadPage:' + fileContent);
      }
    });
  }
  else if(separated.command == "date"){
    setDate(separated.value);
  }

  if(jeuxEnCours == '/menu.html'){
    webServeur.sendMessageToInterface('SoundPlay')
  }
  else if(jeuxEnCours=="/QuestionPourUnChampion.html"){
    QPUCGame.fromInterface(separated);
  }
  else if(jeuxEnCours == "/Animation.html"){
    AnimationGame.fromInterface(separated);
  }
 
};


//=====================================================================================================


function separerCommandeEtValeur(chaine) {
  const separator = ':';
  const indexSeparator = chaine.indexOf(separator);
  
  if (indexSeparator === -1) {
    const command = chaine
    return {command};
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



const { exec } = require('child_process');

// Fonction pour changer la date du serveur
function setDate(newDate) {
  if (firstConnection == false){
    firstConnection = true
    const command = `date -s "${newDate}"`;

    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Une erreur s'est produite lors de la modification de la date : ${error.message}`);
        return;
      }
  
      if (stderr) {
        console.error(`Erreur de sortie de la commande : ${stderr}`);
        return;
      }
  
      console.log(`La date a été modifiée avec succès.`);
    });
  }
}






app.use(express.static(staticFilesPath, { index: 'index.html' }));


app.listen(port,function(error){
    if(error){
        console.log('something went wrong',error)
    }
    else{
        console.log('Server is listening on port ' + port)
    }
})