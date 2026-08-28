# QRArchive

> **Crea e condividi codici QR collegati ai tuoi file, senza bisogno di un sito web o di un dominio dedicato.**

---

## Cos'è QRArchive?

**QRArchive** è un tool online semplice, veloce ed intuitivo che ti consente di generare codici QR direttamente associati ai tuoi documenti, immagini e file. 

Carica i tuoi contenuti su QRArchive, ottieni immediatamente un QR Code pronto all'uso da stampare, condividere o archiviare.

---

## Caratteristiche Principali

- **Nessun dominio richiesto:** Carica i file e genera il QR Code in pochi clic.
- **Spazio Riservato:** Crea un account gratuito per visualizzare tutti i tuoi codici in un'unica dashboard personale.
- **Supporto Multi-formato:** Carica immagini, PDF, documenti di testo, fogli di calcolo e molto altro.
- **Accessibilità Immediata:** Gli utenti che scansioneranno il tuo QR code potranno visualizzare o scaricare direttamente il file collegato.

---

## Come Iniziare

1. **Registrazione / Accesso**
   - Crea un account su **QRArchive**.
2. **Carica il tuo file**
   - Seleziona l'immagine, il PDF o il documento che desideri condividere.
3. **Genera il QR Code**
   - Il sistema elaborerà il file e genererà automaticamente un QR code univoco.
4. **Condividi e Stampa**
   - Scarica il codice QR per utilizzarlo su volantini, menu, brochure, packaging o presentazioni.

---

## Installazione e Configurazione Locale

Se desideri eseguire il progetto in locale, segui questi passaggi:

### Prerequisiti
- [Node.js](https://nodejs.org/) installato sul tuo computer (versione LTS consigliata).
- Un account/progetto attivo su [Supabase](https://supabase.com/).

### 1. Clona il repository
```bash
git clone https://github.com/tuo-username/qrarchive.git
cd qrarchive
```

### 2. Installa le dipendenze
Installa i pacchetti necessari, incluse le librerie di gestione dei QR Code e Supabase:
```bash
npm install @supabase/supabase-js
npm install qrcode.react 
```

### 3. Configura le variabili d'ambiente
Crea un file `.env.local` nella directory principale del progetto e inserisci l'URL del tuo progetto Supabase e la chiave pubblica anonima:

```env
# URL del tuo progetto Supabase
NEXT_PUBLIC_SUPABASE_URL=https://tuo-progetto.supabase.co

# Chiave pubblica anonima (Anon Key)
NEXT_PUBLIC_SUPABASE_ANON_KEY=la-tua-chiave-pubblica-anonima
```
> *Nota: Se utilizzi React/Vite o un altro framework al posto di Next.js, sostituisci il prefisso `NEXT_PUBLIC_` con quello appropriato (es. `VITE_` per Vite).*

### 4. Avvia l'applicazione
```bash
npm run dev
# oppure
npm start
```
---

## Versione e Stato del Progetto

- **Versione Attuale:** `v1.01`
- **Stato:** Release Iniziale

> *Nota:* Trattandosi della versione di lancio (v1.01), potrebbero verificarsi bug o comportamenti inattesi. Il tuo feedback è fondamentale per migliorare l'applicazione!

---

## Segnalazione Bug & Supporto

Hai riscontrato un errore o hai un suggerimento per migliorare QRArchive? 

Puoi inviare una segnalazione via email indicando:
1. **Descrizione del problema** riscontrato.
2. **Passaggi per riprodurre l'errore** (cosa stavi facendo prima che si verificasse).
3. Eventuali screenshot o dettagli sul dispositivo/browser utilizzato.

**Email:** [manganiellomatteo39@gmail.com](mailto:manganiellomatteo39@gmail.com)

*Grazie per il tuo supporto e per aiutarmi a far crescere questo progetto!*

---

## Autore

- **Matteo Manganiello**

---

## Copyright & Licenza

© **2026 Matteo Manganiello**. Tutti i diritti riservati.
