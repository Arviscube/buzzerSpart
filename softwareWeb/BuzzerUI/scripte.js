var audio = null;
var socket = null;
var ackConnection = -1;
var interval;

// var mon_url = 'scripteQPUC.js';
// loadScript(mon_url);


function fonctionBoutonPresse(bouton){
    socket.send(bouton);
}

function SoundPlay(sound){
    if(audio!=null){
        audio.pause();
        delete(audio)
    }   
    audio = new Audio(sound);
    audio.play();
}

function commandeAnalyse(message){
    var separated;
    separated = separerCommandeEtValeur(message)
    if(separated.command=='loadPage'){
            var sectionElement = document.querySelector('section');
            sectionElement.innerHTML = separated.value;
    }
    else if(separated.command=='SoundPlay'){
        SoundPlay(separated.value);
    }
    else if(separated.command=='StatusBuzzer1'){
        const divStatus = document.getElementById("StatusBuzzer1")
        divStatus.style.background = separated.value;     
    }
    else if(separated.command=='StatusBuzzer2'){
        const divStatus = document.getElementById("StatusBuzzer2")
        divStatus.style.background = separated.value;     
    }
    else if(separated.command=='StatusBuzzer3'){
        const divStatus = document.getElementById("StatusBuzzer3")
        divStatus.style.background = separated.value;     
    }
    else if(separated.command=='StatusBuzzer4'){
        const divStatus = document.getElementById("StatusBuzzer4")
        divStatus.style.background = separated.value;     
    }
    else if(separated.command=='StatusBuzzer5'){
        const divStatus = document.getElementById("StatusBuzzer5")
        divStatus.style.background = separated.value;     
    }
    else if(separated.command=='StatusBuzzer6'){
        const divStatus = document.getElementById("StatusBuzzer6")
        divStatus.style.background = separated.value;     
    }
    else{
        commandeAnalyseSuite(separated);
    }
}

function afficherPopup() {
    var divStatus = document.getElementById("StatusBuzzer1");
    divStatus.style.background = "red";
    divStatus = document.getElementById("StatusBuzzer2");
    divStatus.style.background = "red";
    divStatus = document.getElementById("StatusBuzzer3");
    divStatus.style.background = "red";
    divStatus = document.getElementById("StatusBuzzer4");
    divStatus.style.background = "red";
    divStatus = document.getElementById("StatusBuzzer5");
    divStatus.style.background = "red";
    divStatus = document.getElementById("StatusBuzzer6");
    divStatus.style.background = "red";
    alert("Connection perdue avec le serveur");
}


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

interval = setInterval(tryConnection, 200);
var intervalConnection = setInterval(connect, 1000);
function tryConnection(){
    if(ackConnection>=0){
        ackConnection = ackConnection -1
    }
    if(ackConnection==0){
        intervalConnection = setInterval(connect, 1000);
        afficherPopup();
    }
}

function connect() {
    console.log("try connection")
    if(socket!=null){
        socket.close();
        delete(socket)        
        socket = null;
    }
    socket = new WebSocket('ws://192.168.8.2:8080');
    if(socket!=null){
        socket.addEventListener('open', (event) => {
            console.log('Connecté au serveur WebSocket');
            const date = new Date();
            console.log(date);
            socket.send("date:"+date);
        });
          
        socket.addEventListener('message', (event) => {
            const message = event.data;
            console.log('Requête spontanée reçue : ' + message);
            commandeAnalyse(message);
            ackConnection = 5;
            clearInterval(intervalConnection);
        });
          
        socket.addEventListener('close', (event) => {
            console.log('Déconnecté du serveur WebSocket1');
            delete(socket)
        });
    }    
}