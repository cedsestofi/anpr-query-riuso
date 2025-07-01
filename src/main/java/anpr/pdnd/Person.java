package anpr.pdnd;

/**
 *
 * @author niccolor
 */
public class Person {
    
    private String codiceFiscale;
    private String nome;
    private String cognome;
    private String dtNascita; 
    private String sesso;
    private String luogoNascita;
    private String prov;
    private String user;
    private String ip;
    private String service;
    private String idAnpr;
    
    public Person(){
        
    }
    
    public Person(String codiceFiscale, String cognome, String nome, String dtNascita, String sesso, String luogoNascita, String prov, String user, String ip, String service){
        this.codiceFiscale = codiceFiscale;
        this.cognome = cognome;
        this.nome = nome;
        this.dtNascita = dtNascita;
        this.sesso = sesso;
        this.luogoNascita = luogoNascita;
        this.prov = prov;
        this.user = user;
        this.ip = ip;
        this.service = service;
    }
    
    public Person(String cognome, String nome, String dtNascita, String sesso, String luogoNascita, String prov, String user, String ip, String service){
        this.cognome = cognome;
        this.nome = nome;
        this.dtNascita = dtNascita;
        this.sesso = sesso;
        this.luogoNascita = luogoNascita;
        this.prov = prov;
        this.user = user ;      
        this.ip = ip;
        this.service = service;
    }
    
    public Person(String codiceFiscale, String user, String ip, String service){
        this.codiceFiscale = codiceFiscale;
        this.user = user;
        this.ip = ip;
        this.service = service;
    }
    

    public String getCodiceFiscale() {
        return codiceFiscale;
    }

    public String getNome() {
        return nome;
    }

    public String getCognome() {
        return cognome;
    }

    public String getDtNascita() {
        return dtNascita;
    }
    
    public String getSesso() {
        return sesso;
    }
    
    public String getProv() {
        return prov;
    }
    
    public String getLuogoNascita() {
        return luogoNascita;
    }
   
    public String getUser() {
        return user;
    }
    
    public String getIp() {
        return ip;
    }
    
    public String getService() {
        return service;
    }
    
    public String getIdAnpr() {
        return idAnpr;
    }

    public void setCodiceFiscale(String codiceFiscale) {
        this.codiceFiscale = codiceFiscale;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public void setCognome(String cognome) {
        this.cognome = cognome;
    }

    public void setDtNascita(String dtNascita) {
        this.dtNascita = dtNascita;
    }
    
    public void setSesso(String sesso) {
        this.sesso = sesso;
    }
    
    public void setLuogoNascita(String luogoNascita) {
        this.luogoNascita = luogoNascita;
    }
    
    public void setProv(String prov) {
        this.prov = prov;
    }
    
    public void setUser(String user) {
        this.user = user;
    }
    
    public void setIp(String ip) {
        this.ip = ip;
    }
    
    public void setService(String service) {
        this.service = service;
    }
    
    public void setIdAnpr(String idAnpr) {
        this.idAnpr = idAnpr;
    }
}
