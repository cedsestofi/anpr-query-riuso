package anpr.pdnd;


import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.security.KeyFactory;
import java.security.PrivateKey;
import java.security.spec.PKCS8EncodedKeySpec;
import java.time.Instant;
import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.Properties;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;


public class GenerateToken {
	
	private static Properties properties = new Properties();
	
	static{
		try {
			InputStream f = new FileInputStream("/opt/app/pdnd.properties");
			properties.load(f);
		} catch (IOException e){
			e.printStackTrace();
		}
	}
    
    public static String getTokenReqAccess(String encodedTrack, String clientId, String purposeId, String idToken, String kid, String aud) throws Exception {
    	long currentTimeInSecs = TokenUtils.currentTimeInSecs();
    	long scadenza = currentTimeInSecs + 300;//in secondi
    	
        PrivateKey pk = TokenUtils.readPrivateKey("/opt/app/pk.priv");
    	
        HashMap<String, Object> claims = new HashMap<String, Object>();
        claims.put("jti", idToken);
        claims.put("purposeId", purposeId);
        
        HashMap<String, String> m = new HashMap<String, String>();
        m.put("alg", "SHA256");
        m.put("value", encodedTrack);
        claims.put("digest", m);
        
    	String jws = Jwts.builder()
    			  .setClaims(claims)
    			  .setAudience(aud)
    			  .setIssuer(clientId)
    			  .setSubject(clientId)
    			  .setIssuedAt(Date.from(Instant.ofEpochSecond(currentTimeInSecs)))
    			  .setExpiration(Date.from(Instant.ofEpochSecond(scadenza)))
    			  //.setNotBefore(Date.from(Instant.ofEpochSecond(currentTimeInSecs)))
    			  .setHeaderParam("kid", kid)
    			  .signWith(
    			    SignatureAlgorithm.RS256,
    			    pk
    			  )
    			  .compact();
    	
        return jws;
        
    }
    
    public static String getAgidJwtSignature(String digest, String clientId, String idToken, String aud) throws Exception {
    	
    	long currentTimeInSecs = TokenUtils.currentTimeInSecs();
    	long scadenza = currentTimeInSecs + 600000;//in secondi
    	
        String privateKeyContent = new String(Files.readAllBytes(Paths.get("/opt/app/pk.priv")));
        privateKeyContent = privateKeyContent.replaceAll("\\n", "").replace("-----BEGIN PRIVATE KEY-----", "").replace("-----END PRIVATE KEY-----", "");
        KeyFactory kf = KeyFactory.getInstance("RSA");
        PKCS8EncodedKeySpec keySpecPKCS8 = new PKCS8EncodedKeySpec(Base64.getDecoder().decode(privateKeyContent));
        PrivateKey pk = kf.generatePrivate(keySpecPKCS8);

        HashMap<String, Object> claims = new HashMap<String, Object>();
        claims.put("jti", idToken);
        String sigHead = "[ {'digest': 'SHA-256="+digest+"'}, "
                + "{'content-type': 'application/json'} ]";
        HashMap<String, String> m = new HashMap<String, String>();
        m.put("digest", "SHA-256="+digest);
        HashMap<String, String> m2 = new HashMap<String, String>();
        m2.put("content-type", "application/json");
        claims.put("signed_headers", new Object[] {m, m2});
        
    	String jws = Jwts.builder()
    			  .setClaims(claims)
    			  .setAudience(aud)
    			  .setIssuer(clientId)
    			  .setSubject(clientId)
    			  .setIssuedAt(Date.from(Instant.ofEpochSecond(currentTimeInSecs)))
    			  .setExpiration(Date.from(Instant.ofEpochSecond(scadenza)))
    			  .setNotBefore(Date.from(Instant.ofEpochSecond(currentTimeInSecs)))
    			  .setHeaderParam("typ", "JWT")
    			  .setHeaderParam("kid", properties.getProperty("kidPdnd"))
    			  .signWith(
    			    SignatureAlgorithm.RS256,
    			    pk
    			  )
    			  .compact();
    	
        return jws;
        
    }

    public static String getAgidTrackingSignature(String purposeId, String clientId, String idToken, String aud) throws Exception {
    	
    	long currentTimeInSecs = TokenUtils.currentTimeInSecs();
    	long scadenza = currentTimeInSecs + 600000;//in secondi
    	
        String privateKeyContent = new String(Files.readAllBytes(Paths.get("/opt/app/pk.priv")));
        privateKeyContent = privateKeyContent.replaceAll("\\n", "").replace("-----BEGIN PRIVATE KEY-----", "").replace("-----END PRIVATE KEY-----", "");
        KeyFactory kf = KeyFactory.getInstance("RSA");
        PKCS8EncodedKeySpec keySpecPKCS8 = new PKCS8EncodedKeySpec(Base64.getDecoder().decode(privateKeyContent));
        PrivateKey pk = kf.generatePrivate(keySpecPKCS8);

        HashMap<String, Object> claims = new HashMap<String, Object>();
        claims.put("jti", idToken);
        claims.put("purposeId", purposeId);
        claims.put("dnonce", "1234567890123");
        claims.put("userID", "User123");
        claims.put("userLocation", "26.2.12.23");
        claims.put("LoA", "LOA3");
        
    	String jws = Jwts.builder()
    			  .setClaims(claims)
    			  .setAudience(aud)
    			  .setIssuer(clientId)
    			  .setSubject(clientId)
    			  .setIssuedAt(Date.from(Instant.ofEpochSecond(currentTimeInSecs)))
    			  .setExpiration(Date.from(Instant.ofEpochSecond(scadenza)))
    			  //.setNotBefore(Date.from(Instant.ofEpochSecond(currentTimeInSecs)))
    			  .setHeaderParam("typ", "JWT")
    			  .setHeaderParam("kid", properties.getProperty("kidPdnd"))
    			  .signWith(
    			    SignatureAlgorithm.RS256,
    			    pk
    			  )
    			  .compact();
    	
        return jws;
        
    }   
    
}
