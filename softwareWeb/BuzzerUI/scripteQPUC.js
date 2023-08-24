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
    else if(separated.command=='targetBuzzer1'){
        const buzzerCadran = document.getElementById("buzzercadranBuzzer1")
        buzzerCadran.style.backgroundColor = "green"   
    }
    else if(separated.command=='targetBuzzer2'){
        const buzzerCadran = document.getElementById("buzzercadranBuzzer2")
        buzzerCadran.style.backgroundColor = "green"   
    }
    else if(separated.command=='targetBuzzer3'){
        const buzzerCadran = document.getElementById("buzzercadranBuzzer3")
        buzzerCadran.style.backgroundColor = "green"   
    }
    else if(separated.command=='targetBuzzer4'){
        const buzzerCadran = document.getElementById("buzzercadranBuzzer4")
        buzzerCadran.style.backgroundColor = "green"   
    }
    else if(separated.command=='targetBuzzer5'){
        const buzzerCadran = document.getElementById("buzzercadranBuzzer5")
        buzzerCadran.style.backgroundColor = "green"   
    }
    else if(separated.command=='targetBuzzer6'){
        const buzzerCadran = document.getElementById("buzzercadranBuzzer6")
        buzzerCadran.style.backgroundColor = "green"   
    }
    else if(separated.command=='noTarget'){
        console.log("ok")
        const buzzerCadrans = document.querySelectorAll(".buzzercadran");
        buzzerCadrans.forEach(buzzerCadran => {
          buzzerCadran.style.backgroundColor = "rgb(99, 113, 129)";
        });
    }
}


