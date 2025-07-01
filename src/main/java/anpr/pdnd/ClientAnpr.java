package anpr.pdnd;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLConnection;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Instant;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Base64;
import java.util.Properties;
import java.util.UUID;
import javax.net.ssl.HttpsURLConnection;
import javax.net.ssl.SSLContext;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;
import javax.ws.rs.core.Response.Status;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.apache.commons.io.IOUtils;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 *
 * @author niccolor
 */
@RestController
@RequestMapping("/api")
public class ClientAnpr {

    private static Properties properties = new Properties();
    private static final Logger logger = LoggerFactory.getLogger(ClientAnpr.class);

    static {
        try {
            InputStream f = new FileInputStream("/opt/app/pdnd.properties");
            properties.load(f);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public static String fold = "store";
    //@CrossOrigin(origins = "https://anpr.sit.local") //Produzione
    @CrossOrigin(origins = "*") //Test
    @PostMapping("/callAnpr")
    public String callAnpr(@RequestBody Person request) {

        TrustManager[] trustAllCerts = new TrustManager[]{
            new X509TrustManager() {
                public java.security.cert.X509Certificate[] getAcceptedIssuers() {
                    return null;
                }

                public void checkClientTrusted(
                        java.security.cert.X509Certificate[] certs, String authType) {
                }

                public void checkServerTrusted(
                        java.security.cert.X509Certificate[] certs, String authType) {
                }
            }
        };

        try {
            SSLContext sc = SSLContext.getInstance("SSL");
            sc.init(null, trustAllCerts, new java.security.SecureRandom());
            HttpsURLConnection.setDefaultSSLSocketFactory(sc.getSocketFactory());
        } catch (Exception e) {
        }

        try {

            //CREAZIONE TOKEN AUDIT
            String idTokenTrack = UUID.randomUUID().toString();
            String tokenTrackSign = GenerateToken.getAgidTrackingSignature(
                    properties.getProperty("purposeIdPdnd"+request.getService()),
                    properties.getProperty("clientIdPdnd"),
                    idTokenTrack,
                    properties.getProperty("audTokenAgidJwtSignature"+request.getService()));

            MessageDigest digestTrack = MessageDigest.getInstance("SHA-256");
            byte[] hashTrack = digestTrack.digest(tokenTrackSign.getBytes(StandardCharsets.UTF_8));

            final StringBuilder hexString = new StringBuilder();
            for (int i = 0; i < hashTrack.length; i++) {
                final String hex = Integer.toHexString(0xff & hashTrack[i]);
                if (hex.length() == 1) {
                    hexString.append('0');
                }
                hexString.append(hex);
            }
            String encodedTrack = hexString.toString();
            

            //RICHIESTA VOUCHER PDND
            AccessTokenPdnd p = new AccessTokenPdnd();
            String token = p.getRequestAccessToken(encodedTrack, request.getService());

            //CREAZIONE TOKEN INTEGRITY
            
            // Ottieni la data odierna
            LocalDate today = LocalDate.now();

            // Formatta la data nel formato desiderato (YYYY-MM-DD)
            DateTimeFormatter format = DateTimeFormatter.ofPattern("yyyy-MM-dd");
            String formatToday = today.format(format);
            //Verifico quali parametri mi sono arrivati in ingresso
            String jsonInputString = null;
            // Ottenere il timestamp attuale in secondi - Mi serve come identificativo univoco dell'operazione
            long timestampInSeconds = Instant.now().getEpochSecond();
            if(request.getIdAnpr().trim().length() > 0){
                jsonInputString = "{\"idOperazioneClient\": \"" + timestampInSeconds + "\",\"criteriRicerca\": {\"idANPR\":\"" + request.getIdAnpr().trim() + "\"},\"datiRichiesta\": {\"dataRiferimentoRichiesta\": \"" + formatToday + "\",\"motivoRichiesta\": \""+properties.getProperty("casoUso")+"\",\"casoUso\": \""+request.getService()+"\"}}";
            } else if (request.getCodiceFiscale().trim().length() > 0) {
                jsonInputString = "{\"idOperazioneClient\": \"" + timestampInSeconds + "\",\"criteriRicerca\": {\"codiceFiscale\":\"" + request.getCodiceFiscale().trim() + "\"},\"datiRichiesta\": {\"dataRiferimentoRichiesta\": \"" + formatToday + "\",\"motivoRichiesta\": \""+properties.getProperty("casoUso")+"\",\"casoUso\": \""+request.getService()+"\"}}";
            } else {
                jsonInputString = "{\"idOperazioneClient\": \"" + timestampInSeconds + "\",\"criteriRicerca\": {\"cognome\":\"" + request.getCognome().trim() + "\", \"nome\":\"" + request.getNome().trim() + "\", \"sesso\":\"" + request.getSesso().trim() + "\", \"datiNascita\": {\"dataEvento\":\"" + request.getDtNascita() + "\", \"luogoNascita\": {\"comune\": {\"nomeComune\": \"" + request.getLuogoNascita().trim() + "\", \"siglaProvinciaIstat\": \"" + request.getProv().trim() + "\"}}}},\"datiRichiesta\": {\"dataRiferimentoRichiesta\": \"" + formatToday + "\",\"motivoRichiesta\": \""+properties.getProperty("casoUso")+"\",\"casoUso\": \""+request.getService()+"\"}}";
            }
            String idToken = UUID.randomUUID().toString();
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(jsonInputString.getBytes(StandardCharsets.UTF_8));
            String encodedBody = Base64.getEncoder().encodeToString(hash);

            String tokenAgidSign = GenerateToken.getAgidJwtSignature(encodedBody,
                    properties.getProperty("clientIdPdnd"),
                    idToken,
                    properties.getProperty("audTokenAgidJwtSignature"+request.getService()));
            //////////////////////////////////////////////////////////////////////////////////////////////
            
            //Decodifico user e ip e scrivo sul log
            byte[] bytesDecrittografatiUser = Base64.getDecoder().decode(request.getUser());
            String user = new String(bytesDecrittografatiUser);
            byte[] bytesDecrittografatiIp = Base64.getDecoder().decode(request.getIp());
            String ip = new String(bytesDecrittografatiIp);
            logger.info("L'utente " + user + " con indirizzo ip "+ip+" ha fatto la seguente richiesta: " + jsonInputString);

            String baseUrl = properties.getProperty("baseurlapi"+request.getService());
            URL url = new URL(baseUrl);
            URLConnection connection = url.openConnection();
            HttpURLConnection myURLConnection = (HttpURLConnection) connection;
            myURLConnection.setRequestMethod("POST");
            myURLConnection.setUseCaches(false);
            myURLConnection.setDoInput(true);
            myURLConnection.setDoOutput(true);

            myURLConnection.setRequestProperty("Authorization", "Bearer " + token);
            myURLConnection.setRequestProperty("Agid-JWT-Signature", tokenAgidSign);
            myURLConnection.setRequestProperty("Agid-JWT-TrackingEvidence", tokenTrackSign);
            myURLConnection.setRequestProperty("Digest", "SHA-256=" + encodedBody);
            myURLConnection.setRequestProperty("Content-Type", "application/json");

            try (OutputStream os = myURLConnection.getOutputStream()) {
                byte[] input = jsonInputString.getBytes(StandardCharsets.UTF_8);
                os.write(input, 0, input.length);
            }

            int responseCode = myURLConnection.getResponseCode();

            if (responseCode == Status.OK.getStatusCode()) {
                logger.info("Risposta OK"+" GovWay-Transaction-ID: " + myURLConnection.getHeaderField("GovWay-Transaction-ID"));
                InputStream inputStr = myURLConnection.getInputStream();
                String encoding = connection.getContentEncoding() == null ? "UTF-8"
                        : connection.getContentEncoding();
                String jsonResponse = IOUtils.toString(inputStr, encoding);
                myURLConnection.disconnect();
                return jsonResponse;

            } else {
                logger.warn("Risposta NON OK"+" GovWay-Transaction-ID: " + myURLConnection.getHeaderField("GovWay-Transaction-ID"));
                InputStream inputStr = myURLConnection.getErrorStream();
                String encoding = connection.getContentEncoding() == null ? "UTF-8" : connection.getContentEncoding();
                String jsonResponse = IOUtils.toString(inputStr, encoding);
                myURLConnection.disconnect();
                return jsonResponse;
            }

        } catch (Exception e) {
            e.printStackTrace();
        }

        return null;

    }

}
