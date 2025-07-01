//Resetto pulsanti prima di iniziare
document.getElementById("famigliaButton").disabled = true;
document.getElementById("decessoButton").disabled = true;
document.getElementById("genitoriButton").disabled = true;


function convertiAMaiuscolo(input) {
    input.value = input.value.toUpperCase();
}

function residenzaEnable(){
    document.getElementById("residenzaButton").disabled = true;
    inviaForm("C001", "C030", "");
}

function famigliaEnable(){
    document.getElementById("famigliaButton").disabled = true;
    inviaForm("C021", "C030", "");
}

function genitoriEnable(){ //Funzione abilitata per i soli operatori di polizia locale e giudiziaria
    document.getElementById("genitoriButton").disabled = true;
    inviaForm("C024", "C030", ""); 
    inviaForm("C025", "C030", "");
}

function decessoEnable(){
    document.getElementById("decessoButton").disabled = true;
    inviaForm("C016", "C030", "");
}

function scrollToDiv(divId) {
    var element = document.getElementById(divId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function logout() {
    window.location.href = 'logout.php';
}

/*
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
*/
function inviaForm(service, service1, idAnpr) {
    // Disabilita il pulsante "Cancella"
    var pulsanteCancella = document.querySelector('input[type="reset"]');
    pulsanteCancella.disabled = true;
    
    var form = document.getElementById("myForm");
    var loadingIndicator = document.getElementById("loading-indicator");

    // Mostra l'indicatore di caricamento usando le classi di Bootstrap
    loadingIndicator.style.display = "block";

    // Simula un ritardo per scopi dimostrativi 
    setTimeout(function () {
        // Nascondi l'indicatore di caricamento quando la risposta è pronta
        loadingIndicator.style.display = "none";
    }, 1000); // Simula un ritardo di 1 secondi (sostituire con la tua logica di invio del form reale)
    
    redirectToJavaScriptPage(service, service1, idAnpr);
}

function resetParagrafo() {
    document.getElementById("messaggioErrore").textContent = ""; // Resetta il contenuto del messaggio di errore
    $('#residenza input').val('');
    $('#famiglia').empty();
    $('#residenza').hide();
    $('#famiglia').hide();
    $('#padre').empty();
    $('#padre').hide();
    $('#madre').empty();
    $('#madre').hide();
    document.getElementById("residenzaButton").disabled = false;
    document.getElementById("famigliaButton").disabled = true;
    document.getElementById("decessoButton").disabled = true;
    document.getElementById("genitoriButton").disabled = true;
}

function formattaData(date){
    var data = new Date(date);

    // Ottieni giorno, mese e anno
    var giorno = data.getDate();
    var mese = data.getMonth() + 1; // Mese è basato su zero, aggiungiamo 1 per ottenere il mese corretto
    var anno = data.getFullYear();

    // Formatta la data nel formato "dd/mm/yyyy"
    var dataOutput = `${giorno}/${mese}/${anno}`;
    return dataOutput;
}

function decodificaLegame(idStringa) {
    var id = parseInt(idStringa, 10); // 10 indica la base numerica (decimale)
    switch (id) {
        case 1:
            return "Intestatario Scheda";
        case 2:
            return "Marito / Moglie";
        case 3:
            return "Figlio / Figlia";
        case 4:
            return "Nipote (discendente)";
        case 5:
            return "Pronipote (discendente)";
        case 6:
            return "Padre / Madre";
        case 7:
            return "Nonno / Nonna";
        case 8:
            return "Bisnonno / Bisnonna";
        case 9:
            return "Fratello / Sorella";
        case 10:
            return "Nipote (collaterale)";
        case 11:
            return "Zio / Zia (Collaterale)";
        case 12:
            return "Cugino / Cugina";
        case 13:
            return "Altro Parente";
        case 16:
            return "Genero / Nuora";
        case 17:
            return "Suocero / Suocera";
        case 18:
            return "Cognato / Cognata";
        case 20:
            return "Nipote (Affine)";
        case 21:
            return "Zio / Zia (Affine)";
        case 22:
            return "Altro Affine";
        case 23:
            return "Convivente (con vincoli di adozione o affettivi)";
        case 24:
            return "Responsabile della convivenza non affettiva";
        case 25:
            return "Convivente in convivenza non affettiva";
        case 99:
            return "Non definito/comunicato";
        case 14:
            return "Figliastro / Figliastra";
        case 15:
            return "Patrigno / Matrigna";
        case 19:
            return "Fratellastro / Sorellastra";
        case 80:
            return "Adottato";
        case 81:
            return "Nipote";
        case 28:
            return "Unito civilmente";
        default:
            return "Descrizione non trovata";
    }
}

function redirectToJavaScriptPage(service, service1, idAnpr) {

    // Ottenere i valori dai campi del form
    var nome = document.getElementById('nome').value;
    var cognome = document.getElementById('cognome').value;
    var dataNascita = document.getElementById('dataNascita').value;
    var sesso = document.getElementById('sesso').value;
    var luogoNascita = document.getElementById('luogoNascita').value;
    var cf = document.getElementById('codiceFiscale').value;
    var prov = document.getElementById('provinciaNascita').value;
    var messaggioErrore = document.getElementById("messaggioErrore");
    var username = document.getElementById("username").value;
    var ip = document.getElementById("ip").value;
    var idAnpr = idAnpr;
    
    // Dati da inviare nel corpo della richiesta
    var dati = {
        codiceFiscale: cf,
        nome: nome,
        cognome: cognome,
        dtNascita: dataNascita,
        sesso: sesso,
        luogoNascita: luogoNascita,
        prov: prov,
        user: username,
        ip: ip,
        service: service1,
        idAnpr: idAnpr
    };

    //Controllo sulla correttezza dei dati
    if (dati.codiceFiscale === "" && (dati.nome === "" || dati.cognome === "" || dati.dtNascita === "" || dati.sesso === "" || dati.luogoNascita === "" )) { //TODO Controlli
        messaggioErrore.textContent = "Compilare i campi richiesti";
        document.getElementById("residenzaButton").disabled = false;
        // Riabilita il pulsante "Cancella"
        var pulsanteCancella = document.querySelector('input[type="reset"]');
        pulsanteCancella.disabled = false;
    } else if((!isNaN(dati.nome.trim()) && dati.nome.trim() !== "") ||
            (!isNaN(dati.cognome.trim()) && dati.cognome.trim() !== "") ||
            (!isNaN(dati.luogoNascita.trim()) && dati.luogoNascita.trim() !== "") ||
            (!isNaN(dati.prov.trim()) && dati.prov.trim() !== "")){
            messaggioErrore.textContent = "Dati compilati non corretti, hai inserito valori numerici dove non previsti!";
            document.getElementById("residenzaButton").disabled = false;

            // Riabilita il pulsante "Cancella"
            var pulsanteCancella = document.querySelector('input[type="reset"]');
            pulsanteCancella.disabled = false;
    } else { // I dati inseriti sono corretti formalmente corretti
        messaggioErrore.textContent = ""; // Pulisce eventuali messaggi di errore precedenti

        // URL dell'API test - Macchina locale SERINF06
        //var url = 'http://localhost:8080/apiAnprPdnd-1.0.0/api/callAnpr';
        //URL dell'API produzione - Macchina dockerlan-test
        var url = 'https://anprws.sit.local/apiAnprPdnd-1.0.0/api/callAnpr';
        // Impostazioni della richiesta
        var opzioni = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Methods': 'POST',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            body: JSON.stringify(dati)
        };

        // Eseguire la chiamata fetch
        fetch(url, opzioni)
                .then(response => response.json())
                .then(data => {
                    // Ottieni un riferimento al modulo HTML
                    var form = document.getElementById("myForm");
                    //console.log(data);

                    // Riabilita il pulsante "Cancella"
                    var pulsanteCancella = document.querySelector('input[type="reset"]');
                    pulsanteCancella.disabled = false;
                    
                    // Assegna i valori agli elementi del modulo HTML
                    if(data.listaErrori){
                        messaggioErrore.textContent = data.listaErrori[0].testoErroreAnomalia;
                    }else if(data.listaSoggetti.datiSoggetto[1] && service === "C001"){
                        messaggioErrore.textContent = "Trovati troppi risultati, affinare la ricerca!";
                    } else{
                        //Valorizzo idAnpr
                        if(service1 === "C030"){
                            redirectToJavaScriptPage(service, service, data.listaSoggetti.datiSoggetto[0].identificativi.idANPR);
                        }
                        //Pulisco form e messaggio di errore
                        //Riempo la form
                        //Dati anagrafici
                        form.elements["codiceFiscale"].value = data.listaSoggetti.datiSoggetto[0].generalita.codiceFiscale.codFiscale;
                        form.elements["cognome"].value = data.listaSoggetti.datiSoggetto[0].generalita.cognome;
                        form.elements["nome"].value = data.listaSoggetti.datiSoggetto[0].generalita.nome;
                        form.elements["dataNascita"].value = data.listaSoggetti.datiSoggetto[0].generalita.dataNascita;
                        if(data.listaSoggetti.datiSoggetto[0].generalita.luogoNascita.localita){
                            form.elements["luogoNascita"].value = data.listaSoggetti.datiSoggetto[0].generalita.luogoNascita.localita.descrizioneLocalita+" - " +data.listaSoggetti.datiSoggetto[0].generalita.luogoNascita.localita.descrizioneStato;
                            form.elements["provinciaNascita"].value = "EE";
                        } else{
                            form.elements["luogoNascita"].value = data.listaSoggetti.datiSoggetto[0].generalita.luogoNascita.comune.nomeComune;
                            form.elements["provinciaNascita"].value = data.listaSoggetti.datiSoggetto[0].generalita.luogoNascita.comune.siglaProvinciaIstat;
                        }
                        form.elements["sesso"].value = data.listaSoggetti.datiSoggetto[0].generalita.sesso;
                        
                        if(service === "C001"){ //Dati di residenza
                            $('#residenza').show();
                            //Mi posizione sul div corretto
                            scrollToDiv("residenza");
                            //Ulteriori informazioni
                            if(data.listaSoggetti.datiSoggetto[0].infoSoggettoEnte[0].valore === "N"){
                                form.elements["deceduto"].value = "SI";
                                document.getElementById("decessoButton").disabled = false;
                            } else{
                                form.elements["deceduto"].value = "NO";
                                document.getElementById("famigliaButton").disabled = false;
                            }
                            //Abilito pulsante genitori sse utente != amm
                            if(!(document.getElementById("amm").value === "1")){
                                document.getElementById("genitoriButton").disabled = false;
                            }
                            if(data.listaSoggetti.datiSoggetto[0].generalita.soggettoAIRE === "S"){
                                form.elements["aire"].value = "SI, anno espatrio: "+data.listaSoggetti.datiSoggetto[0].generalita.annoEspatrio;
                            } else{
                                form.elements["aire"].value = "NO";
                            }
                            form.elements["comuneResidenza"].value = data.listaSoggetti.datiSoggetto[0].residenza[0].indirizzo.comune.nomeComune;
                            form.elements["provinciaResidenza"].value = data.listaSoggetti.datiSoggetto[0].residenza[0].indirizzo.comune.siglaProvinciaIstat;
                            form.elements["cap"].value = data.listaSoggetti.datiSoggetto[0].residenza[0].indirizzo.cap;
                            form.elements["specie"].value = data.listaSoggetti.datiSoggetto[0].residenza[0].indirizzo.toponimo.specie;
                            form.elements["denominazione"].value = data.listaSoggetti.datiSoggetto[0].residenza[0].indirizzo.toponimo.denominazioneToponimo;
                            form.elements["numero"].value = data.listaSoggetti.datiSoggetto[0].residenza[0].indirizzo.numeroCivico.numero;
                            if(data.listaSoggetti.datiSoggetto[0].residenza[0].indirizzo.numeroCivico.civicoInterno.interno1){
                                form.elements["interno"].value = data.listaSoggetti.datiSoggetto[0].residenza[0].indirizzo.numeroCivico.civicoInterno.interno1;
                            } else{
                                form.elements["interno"].value ="";
                            }
                        } else if(service === "C021"){
                            $('#famiglia').show();
                            // Seleziona l'elemento div con ID "famiglia"
                            var famigliaDiv = document.getElementById("famiglia");

                            // Contenuto da inserire nell'elemento div
                            var contenuto = "<h4> Stato di famiglia: </h4>"
                            contenuto += "Nucleo familiare composto da "+Object.keys(data.listaSoggetti.datiSoggetto).length+" soggetti: <br><br>";
                            var i = 0;
                            while (i < Object.keys(data.listaSoggetti.datiSoggetto).length){
                                contenuto += data.listaSoggetti.datiSoggetto[i].generalita.codiceFiscale.codFiscale+" - ";
                                contenuto += data.listaSoggetti.datiSoggetto[i].generalita.cognome+" ";
                                contenuto += data.listaSoggetti.datiSoggetto[i].generalita.nome+" - ";
                                contenuto += "Nato/a il "+formattaData(data.listaSoggetti.datiSoggetto[i].generalita.dataNascita)+" - ";
                                if(data.listaSoggetti.datiSoggetto[i].generalita.luogoNascita.localita){
                                    contenuto += "a "+data.listaSoggetti.datiSoggetto[i].generalita.luogoNascita.localita.descrizioneLocalita+" - " +data.listaSoggetti.datiSoggetto[0].generalita.luogoNascita.localita.descrizioneStato+" ";
                                    contenuto += "(EE) ";
                                } else{
                                    contenuto += "a "+data.listaSoggetti.datiSoggetto[i].generalita.luogoNascita.comune.nomeComune+" ";
                                    contenuto += "("+data.listaSoggetti.datiSoggetto[i].generalita.luogoNascita.comune.siglaProvinciaIstat+") - ";
                                }
                                contenuto += "Sesso: "+data.listaSoggetti.datiSoggetto[i].generalita.sesso+" - ";
                                contenuto += "Legame: <strong>"+decodificaLegame(data.listaSoggetti.datiSoggetto[i].legameSoggetto.codiceLegame)+"</strong> a decorrere dal "+formattaData(data.listaSoggetti.datiSoggetto[i].legameSoggetto.dataDecorrenza)
                                contenuto += "<br><br>"
                                i++;
                            }

                            // Assegna il contenuto all'elemento div
                            famigliaDiv.innerHTML = contenuto;
                            scrollToDiv("famiglia");
                        } else if (service === "C016"){
                            form.elements["deceduto"].value = "SI - il "+formattaData(data.listaSoggetti.datiSoggetto[0].datiDecesso.dataEvento)+" a "+data.listaSoggetti.datiSoggetto[0].datiDecesso.luogoEvento.comune.nomeComune+" ("+data.listaSoggetti.datiSoggetto[0].datiDecesso.luogoEvento.comune.siglaProvinciaIstat+")";
                        } else if (service === "C024" && !(document.getElementById("amm").value === "1")){
                            $('#famiglia').show();
                            $('#padre').show();
                            // Seleziona l'elemento div con ID "famiglia"
                            var genitoriDiv = document.getElementById("padre");

                            // Contenuto da inserire nell'elemento div
                            var contenuto = "<h4> Paternità e maternità: </h4>"
                            contenuto += "Padre: ";
                            if(data.listaSoggetti.datiSoggetto[0].paternita.generalita.codiceFiscale){
                                contenuto += data.listaSoggetti.datiSoggetto[0].paternita.generalita.codiceFiscale.codFiscale+" - ";
                            }
                            contenuto += data.listaSoggetti.datiSoggetto[0].paternita.generalita.cognome+" ";
                            contenuto += data.listaSoggetti.datiSoggetto[0].paternita.generalita.nome+" - ";
                            contenuto += "Nato/a il "+formattaData(data.listaSoggetti.datiSoggetto[0].paternita.generalita.dataNascita)+" - ";
                            if(data.listaSoggetti.datiSoggetto[0].paternita.generalita.luogoNascita.localita){
                                contenuto += "a "+data.listaSoggetti.datiSoggetto[0].paternita.generalita.luogoNascita.localita.descrizioneLocalita+" - " +data.listaSoggetti.datiSoggetto[0].paternita.generalita.luogoNascita.localita.descrizioneStato+" ";
                                contenuto += "(EE) ";
                            } else{
                                contenuto += "a "+data.listaSoggetti.datiSoggetto[0].paternita.generalita.luogoNascita.comune.nomeComune+" ";
                                contenuto += "("+data.listaSoggetti.datiSoggetto[0].paternita.generalita.luogoNascita.comune.siglaProvinciaIstat+") - ";
                            }
                            contenuto += "Sesso: "+data.listaSoggetti.datiSoggetto[0].paternita.generalita.sesso;
                            contenuto += "<br><br>"
                            
                             // Assegna il contenuto all'elemento div
                            genitoriDiv.innerHTML = contenuto;
                            scrollToDiv("padre");
                        } else if (service === "C025" && !(document.getElementById("amm").value === "1")){
                            //Prima eseguo il C024
                            $('#madre').show();
                            // Seleziona l'elemento div con ID "famiglia"
                            var genitoriDiv = document.getElementById("madre");

                            var contenuto = "Madre: ";
                            if(data.listaSoggetti.datiSoggetto[0].maternita.generalita.codiceFiscale){
                                contenuto += data.listaSoggetti.datiSoggetto[0].maternita.generalita.codiceFiscale.codFiscale+" - ";
                            }
                            contenuto += data.listaSoggetti.datiSoggetto[0].maternita.generalita.cognome+" ";
                            contenuto += data.listaSoggetti.datiSoggetto[0].maternita.generalita.nome+" - ";
                            contenuto += "Nato/a il "+formattaData(data.listaSoggetti.datiSoggetto[0].maternita.generalita.dataNascita)+" - ";
                            if(data.listaSoggetti.datiSoggetto[0].maternita.generalita.luogoNascita.localita){
                                contenuto += "a "+data.listaSoggetti.datiSoggetto[0].maternita.generalita.luogoNascita.localita.descrizioneLocalita+" - " +data.listaSoggetti.datiSoggetto[0].maternita.generalita.luogoNascita.localita.descrizioneStato+" ";
                                contenuto += "(EE) ";
                            } else{
                                contenuto += "a "+data.listaSoggetti.datiSoggetto[0].maternita.generalita.luogoNascita.comune.nomeComune+" ";
                                contenuto += "("+data.listaSoggetti.datiSoggetto[0].maternita.generalita.luogoNascita.comune.siglaProvinciaIstat+") - ";
                            }
                            contenuto += "Sesso: "+data.listaSoggetti.datiSoggetto[0].maternita.generalita.sesso;
                            
                             // Assegna il contenuto all'elemento div
                            genitoriDiv.innerHTML = contenuto;
                            scrollToDiv("madre");
                        }
                    }
                })
                .catch(error => {
                    // Gestisci gli errori
                    console.error('Errore durante la chiamata fetch:', error);
                });
    }
}