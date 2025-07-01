***************** DOCUMENTAZIONE API REST PER CHIAMATA AD ANPR TRAMITE PDND ***************** 
Il codice sorgente si trova in src/main/java/anpr/pdnd. 
L'api effettuata una chiamata ad anpr tramite pdnd con i parametri specificati nelle properties.

#########################

Esempio di richiesta ricerca soggetto:

{ "idOperazioneClient": "1",
"criteriRicerca": { "codiceFiscale": "NRENTN80B22G393L" }, "datiRichiesta": { "dataRiferimentoRichiesta": "2023-12-14", "motivoRichiesta": "1", "casoUso": "C001" } }

#########################

Configurazione:

- Caricare la propria chiave privata in ./config/prod/ e rinominarla pk_anpr_produzione.priv;
- Inserire i propri parametri dentro ./config/prod/pdnd.properties;
- In ./htdocs/callApi.js alla riga 216 inserire l'url sul quale viene esposta l'api. L'endpoint dell'api è /apiAnprPdnd-1.0.0/api/callAnpr (esempio: https://miaMacchina:8080/apiAnprPdnd-1.0.0/api/callAnpr);
- In ./htdocs/.htaccess impostare i propri parametri di configurazione ldap. Altrimenti impostare un altro tipo di autenticazione;
- In ./htdocs/users.properties impostare il nome utente di eventuali utenti con abilitazioni ristrette; Gli utenti inseriti in quel file troveranno i servizi C024 e C025 disabilitati, come previsto da circolare ministeriale;

Se si vuole impostare una cross origin (al momento le chiamate sono aperte) inserire l'url in src/main/java/anpr/pdnd/ClientAnpr.java riga 54 e ricompilare il war.
Il war si trova dentro la cartella /target.

Tutti i requisiti richiesti sono inclusi nel Dockerfile e nel docker-compose.yaml (tomcat, jdk).

Scaricare il progetto, inserire i parametri di cui sopra, recarsi in un ambiente docker ed eseguire il comando: docker compose up 
