<?php
// Verifica l'autenticazione
if (!isset($_SERVER['PHP_AUTH_USER'])) {
    header('WWW-Authenticate: Basic realm="My Realm"');
    header('HTTP/1.0 401 Unauthorized');
    echo 'Accesso negato';
    exit;
} else {
    // Recupera il nome utente
    $username = base64_encode($_SERVER['PHP_AUTH_USER']);
    // Recupera l'indirizzo IP dell'utente
    $ipAddress = base64_encode($_SERVER['REMOTE_ADDR']);
    
    $file = 'users.properties';
    
    if (file_exists($file)) {
        // Legge il file e lo converte in un array associativo
        $properties = parse_ini_file($file);

        // Estrae gli utenti dalla proprietà 'users' e li converte in un array
        $amm_users = explode(",", $properties['users']);
    }
    // Verifica se l'utente corrente è autorizzato
    $is_amm = in_array($_SERVER['PHP_AUTH_USER'], $amm_users);
}

?>

<!DOCTYPE html>
<html lang="it">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>CENSUS</title>
        
        <!-- Includi il CSS di Bootstrap -->
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css">
        <link rel="stylesheet" href="design.css">
        <script src="callApi.js" defer></script>
    </head>
    <body>

        <div class="container mt-4">
            <center> <h1>Benvenuto su CENSUS</h1> </center>
            <h4> <em>Per poter effettuare una ricerca con successo è necessario inserire il codice fiscale OPPURE nome, cognome, data di nascita, comune o stato di nascita, sesso. </em></h4>
            <hr>
            <form id="myForm">
                <div class="row justify-content-between">
                    <div class="col-2 mb-2">
                        <button id="residenzaButton" type="button" class="btn btn-primary btn-block" onclick="residenzaEnable()">Dati di residenza</button>
                    </div>
                    <div class="col-2 mb-2">
                        <button id="famigliaButton" type="button" class="btn btn-primary btn-block" onclick="famigliaEnable()">Stato di famiglia</button>
                    </div>
                    <div class="col-2 mb-2">
                        <button id="genitoriButton" type="button" class="btn btn-primary btn-block" onclick="genitoriEnable()">Genitori</button>
                    </div>
                    <div class="col-2 mb-2">
                        <button id="decessoButton" type="button" class="btn btn-primary btn-block" onclick="decessoEnable()">Info decesso</button>
                    </div>
                <!--    <div class="col-2 mb-2">
                        <button type="button" class="btn btn-primary btn-block" onclick="stCivileEnable()" disabled>Stato civile</button>
                    </div> -->
                    <div class="col-2 mb-2">
                        <input type="reset" class="btn btn-secondary btn-block" value="Cancella" onclick="resetParagrafo()">
                    </div>
                    <div class="col-2 mb-2">
                        <input type="button" class="btn btn-danger btn-block" value="Logout" onclick="logout()">
                    </div>
                </div>
                
                <hr>
                
                <br>
                <h4> Dati Anagrafici: </h4>
                <div class="row">
                    <div class="col-6">
                        <div class="form-group">
                            <label for="codiceFiscale">Codice Fiscale:</label>
                            <input type="text" class="form-control" id="codiceFiscale" name="codiceFiscale" oninput="convertiAMaiuscolo(this)" required maxlength="16">
                        </div>
                    </div>
                    <div class="col-6">
                        <div class="form-group">
                            <label for="dataNascita">Data di nascita:</label>
                            <input type="date" class="form-control" id="dataNascita" name="dataNascita" required>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-6">
                        <div class="form-group">
                            <label for="nome">Nome:</label>
                            <input type="text" class="form-control" id="nome" name="nome" oninput="convertiAMaiuscolo(this)" required maxlength="100">
                        </div>
                    </div>

                    <div class="col-6">
                        <div class="form-group">
                            <label for="cognome">Cognome:</label>
                            <input type="text" class="form-control" id="cognome" name="cognome" oninput="convertiAMaiuscolo(this)" required maxlength="100">
                        </div>
                    </div>
                </div>

                <div class="row">
                    <div class="col-2">
                        <div class="form-group">
                            <label for="sesso">Sesso:</label>
                            <select class="form-control" id="sesso" name="sesso" required>
                                <option value=""></option>
                                <option value="M">M</option>
                                <option value="F">F</option>
                            </select>
                        </div>
                    </div>
                    <div class="col-8">
                        <div class="form-group">
                            <label for="luogoNascita">Comune o stato di nascita:</label>
                            <input type="text" class="form-control" id="luogoNascita" name="luogoNascita" oninput="convertiAMaiuscolo(this)" required maxlength="150">
                        </div>
                    </div>
                    <div class="col-2">
                        <div class="form-group">
                            <label for="provinciaNascita">Provincia di nascita:</label>
                            <input type="text" class="form-control" id="provinciaNascita" name="provinciaNascita" oninput="convertiAMaiuscolo(this)" required placeholder="Inserire la sigla..." maxlength="2">
                        </div>
                    </div>  
                </div>
                
                <hr>
                
                <h4> Ulteriori Informazioni: </h4>
                <div class="row">
                    <div class="col-9">
                        <div class="form-group">
                            <label for="deceduto">Soggetto deceduto:</label>
                            <input type="text" class="form-control" id="deceduto" name="deceduto" readonly>
                        </div>
                    </div>
                    <div class="col-3">
                        <div class="form-group">
                            <label for="aire">Soggetto Aire:</label>
                            <input type="text" class="form-control" id="aire" name="aire" readonly>
                        </div>
                    </div>
                </div>
                
                <hr>
                
                <div id="residenza" style="display: none;">
                    <h4> Dati di residenza: </h4>
                    <div class="row">
                        <div class="col-4">
                            <div class="form-group">
                                <label for="comuneResidenza">Comune di residenza:</label>
                                <input type="text" class="form-control" id="comuneResidenza" name="comuneResidenza" readonly>
                            </div>
                        </div>
                        <div class="col-4">
                            <div class="form-group">
                                <label for="provinciaResidenza">Provincia di residenza:</label>
                                <input type="text" class="form-control" id="provinciaResidenza" name="provinciaResidenza" readonly>
                            </div>
                        </div>
                        <div class="col-4">
                            <div class="form-group">
                                <label for="cap">Cap:</label>
                                <input type="text" class="form-control" id="cap" name="cap" readonly>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-2">
                            <div class="form-group">
                                <label for="specie">Specie:</label>
                                <input type="text" class="form-control" id="specie" name="specie" readonly>
                            </div>
                        </div>
                        <div class="col-6">
                            <div class="form-group">
                                <label for="denominazione">Denominazione:</label>
                                <input type="text" class="form-control" id="denominazione" name="denominazione" readonly>
                            </div>
                        </div>
                        <div class="col-2">
                            <div class="form-group">
                                <label for="numero">Numero:</label>
                                <input type="text" class="form-control" id="numero" name="numero" readonly>
                            </div>
                        </div>
                        <div class="col-2">
                            <div class="form-group">
                                <label for="interno">Interno:</label>
                                <input type="text" class="form-control" id="interno" name="interno" readonly>
                            </div>
                        </div>
                    </div>
                    <hr>
                </div>
                
                              
                <div id="famiglia" style="display: none;">
                </div>
                
                <div id="padre" style="display: none;">
                </div>
                <div id="madre" style="display: none;">
                </div>
                          
                <div id="loading-indicator">
                    Caricamento in corso...
                </div>
                
                <p id="messaggioErrore" style="color: red;"></p>               
                
                <!-- Campi nascosti per recuperare il nome utente e l'indirizzo ip di chi si logga-->
                <input type="hidden" name="username" id="username" value="<?php echo htmlspecialchars($username); ?>">
                <input type="hidden" name="ip" id="ip" value="<?php echo htmlspecialchars($ipAddress); ?>">
                <input type="hidden" name="amm" id="amm" value="<?php echo $is_amm; ?>">
            </form>
        </div>

        <!-- Includi i file JavaScript di Bootstrap -->
        <script src="https://code.jquery.com/jquery-3.2.1.slim.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js"></script>
        <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js"></script>
    </body>
</html>

