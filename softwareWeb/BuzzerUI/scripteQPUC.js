function commandeAnalyseSuite(separated){
    if(separated.command=='changeScoreBuzzer1'){
        const divScore = document.getElementById("scoreBuzzer1")
        divScore.innerText = separated.value;     
    }
    else if(separated.command=='changeScoreBuzzer2'){
        const divScore = document.getElementById("scoreBuzzer2")
        divScore.innerText = separated.value;     
    }
    else if(separated.command=='changeScoreBuzzer3'){
        const divScore = document.getElementById("scoreBuzzer3")
        divScore.innerText = separated.value;     
    }
    else if(separated.command=='changeScoreBuzzer4'){
        const divScore = document.getElementById("scoreBuzzer4")
        divScore.innerText = separated.value;     
    }
    else if(separated.command=='changeScoreBuzzer5'){
        const divScore = document.getElementById("scoreBuzzer5")
        divScore.innerText = separated.value;
    }
    else if(separated.command=='changeScoreBuzzer6'){
        const divScore = document.getElementById("scoreBuzzer6")
        divScore.innerText = separated.value;   
    }
}


