# spid-ionic-sdk
SPID authentication library for Ionic

⚠️ Attenzione! Questo progetto non è più manutenuto dai suoi autori. Se vuoi contribuire al progetto e diventare maintainer contattaci sul [canale Slack](https://developersitalia.slack.com/archives/C7AAA10PN) dedicato.


# Versioni e stack tecnologici utilizzati
Per lo sviluppo del componente di autenticazione SPID per Ionic si è utilizzato il seguente stack:
> ionic --version
>3.12.0
>node --version
>6.11.2`
>npm --version
>3.10.10
>cordova --version
>7.0.1

# Configurazione dell'ambiente ed avvio app
Si necessita dell'installazione dell'ultima versione di cordova (è requisito fondamentale node.js nella sua versione 6 o superiore)
>npm install -g ionic cordova

per maggiori informazioni per l'installazione dell'ambiente si rimanda alla documentazione ufficiale di [Ionic](https://ionicframework.com/docs/intro/installation/)

L'ambiente è visionabile su dispositivi fisici (Android ed iOS). Non si raccomanda l'utilizzo del browser (avviando ionic serve) poichè si è fatto uso del componente Action Sheet per la selezione dei Provider.
Tale componente può essere facilmente sostituito con qualsiasi elemento di UI che consenta la seleziona di un singolo elemento (es. list item con radio button, select ecc.).

Il progetto è stato avviato a partire dal template "super" messo a disposizione dal framework Ionic.

# Funzionamento dell'applicazione
Al suo avvio l'app presenta una simpatica presentazione che ricalca alcuni momenti dell'evento #hackdev17, all'interno del quale si è potuto sviluppare il suddetto componente.
Il carousel di presentazione può essere facilmente saltato cliccando sul pulsante in alto a destra all'interno dell'header.
[qui IMG carousel]
Ora l'utente sarà in grado di accedere a SPID utilizzando l'apposito pulsante come da linee guida AGID. Di seguito l'immagine di riferimento:

![Login SPID](https://raw.githubusercontent.com/vivadaniele/spid-ionic-sdk/master/src/assets/img/2.png)

![Selezione del Provider](https://raw.githubusercontent.com/vivadaniele/spid-ionic-sdk/master/src/assets/img/1.png)

Facendo click sul pulsante si aprirà il componente Action Scheet (si è fatto uso a riguardo del plugin la cui documentazione è disponibile [qui](https://ionicframework.com/docs/native/action-sheet/)) per consentire all'utente di selezionare l'Identity Provider con il quale si intende effettuare l'accesso. Tale componente potrà essere evoluto aggiungendo dinamicamente l'icona rappresentativa del Provider.

L'app si basa su dei Rest Service pubblicati su mock.io (inizialmente si è provato ad agganciarsi al progetto [https://github.com/Gianluke/spid-spring](https://github.com/Gianluke/spid-spring), ma successivamente abbandonato a causa dell'incompletezza del sistema).
Il sistema prevede il seguente funzionamento:

 1. ottiene l'elenco dei Provider da un apposito servizio Rest (esso ritornerà per ciascuno l'icona rappresentativa, l'url da richiamare ed il nome del Provider);
 2. selezionato il Provider l'app richiama il servizio REST per ottenere l'url dell'identità provider
 3. l'app aprirà una WebView fruendo la piattaforma del Provider dove potrà effettuare l'autenticazione;
 4.  l'utente effettua il Login (l'applicazione se riceve correttamente il JSON dei dati dell'utente prosegue il flusso regolare, altrimenti si opta per il mock di PosteID)
 5. Se le credenziali sono corrette viene chiusa la WebView e visualizzato il messaggio di benvenuto all'utente.

![Accesso SPID tramite PosteID](https://github.com/vivadaniele/spid-ionic-sdk/raw/master/src/assets/img/3.png)

# Architettura ed organizzazione dell'applicazione
L'intero progetto è organizzato utilizzando il modulo i18n per il componente multilingua.
Si è fatto uso dei seguenti plugin di Ionic Native:

 - Action Scheet ([qui](https://ionicframework.com/docs/native/action-sheet/) la doc): per l'elenco dei Provider
 - In App Browser ([qui](https://ionicframework.com/docs/native/in-app-browser/) lo doc): per la componente WebView

Nell'app esiste un file Costants.ts nella folder model che governa le url dei REST ed i mock.

# TODO
Solo due aspetti:
1. Agganciare le icone ai provider;
2. agganciare un ultimo servizio REST (già predisposto) che riceva l'oggetto utente come risultato di avvenuto successo dell'autenticazione all'interno della WebView. L'app è già sviluppata come descritto in precedenza per chiudere la WebView ed aprire il profilo utente recuperando in maniera opportuna i dati (tale funzionalità è già implementata, ovvero attualmente il sistema se riceve l'oggetto utente reale visualizza il messaggio di benvenuto citando nome e cognome, altrimenti un testo statico).
Il servizio già pensato dovrà restituire il seguente JSON:

        {
      "codiceFiscale": "string",
      "codiceIdentificativo": "string",
      "cognome": "string",
      "dataNascita": "2017-10-08T10:56:15.184Z",
      "dataScadenzaIdentita": "2017-10-08T10:56:15.184Z",
      "documentoIdentita": "string",
      "emailAddress": "string",
      "emailPec": "string",
      "indirizzoDomicilio": "string",
      "indirizzoSedeLegale": "string",
      "luogoNascita": "string",
      "nome": "string",
      "numeroTelefono": "string",
      "partitaIva": "string",
      "provinciaNascita": "string",
      "ragioneSociale": "string",
      "sesso": "string"
    }

Qui il link della challange: [https://github.com/italia/spid-ionic-sdk/issues/1](https://github.com/italia/spid-ionic-sdk/issues/1)
