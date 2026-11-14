# Mind The Gap — MVP Lean integrato (edizione demo + OpenAI)

Riscrittura funzionale del prototipo MTG per test EMBA. **Non è una piattaforma commerciale di produzione.**

## Avvio rapido (senza configurare nulla)

1. Estrai lo ZIP.
2. Pubblica il contenuto di `web/` in una repository GitHub Pages (oppure avvialo con `python -m http.server 8000` nella cartella `web`).
3. Apri il sito, incolla una descrizione immobiliare, modifica le preferenze, prova il confronto, la chat dimostrativa e il percorso con esperti.
4. Se OpenAI non è configurato, l'app presenta **esplicitamente un'analisi euristica di demo**, non una risposta del modello.

## Funzioni disponibili

- Homepage **description-first**, con PDF dell’annuncio al secondo posto e link al terzo (Beta). PDF testuali caricabili già alla creazione.
- **Niente scraping non autorizzato**: dal solo URL non viene estratto l'annuncio. CORS, licenze e termini dei portali richiedono API o accordi. Puoi inserire il link e incollare la descrizione.
- Multi-property, confronto 2–3 case, score Property Fit con priorità e valutazioni razionali/emotive personalizzate, Decision Readiness distinto.
- Checklist 9 aree: prezzo, spazi, location, manutenzione, energia, urbanistica/catasto, condominio, rischi, condizioni d'acquisto.
- Caricamento PDF **testuali** e TXT con estrazione PDF.js e storage del testo in IndexedDB; aggiornamento AI a ogni nuova evidenza mediante pulsante.
- Chat contestuale: 3 risposte gratuite per browser e pack simulati 15/5€, 40/10€, 100/20€. Il pack 100/20€ è il listino di test rivisto, coerente con il prezzo decrescente per domanda; cambia `PACKS` se vuoi mantenere 100/30€.
- Dossier completo a 49€: un clic registra intenzione e sblocca la demo, **senza pagamento reale**.
- Sei esperti con **nomi, immagini generate e recensioni simulate**; specializzazioni dinamiche in base ai gap, selezione chat demo 49€, video 150€, visita 300€ e evento di intenzione d'acquisto. Non esistono appuntamenti/chat/video reali.
- Dopo intenzione esperto: «Verifica report dell'esperto (simulazione)», creazione di un report illustrativo e nuova analisi. Il report non è una verifica legale/tecnica; non può aumentare il punteggio come evidenza professionale certificata.
- Tracking degli eventi su questo browser, esportabile in JSON dal menu Come funziona. **Intenzione di pagamento != acquisto reale**.

## Collegamento OpenAI (chiavi private sul backend)

1. Crea un progetto su https://platform.openai.com , configura la fatturazione API e conserva la tua chiave.
2. In Supabase abilita Authentication → Email OTP/magic link e aggiungi il tuo indirizzo GitHub Pages nei Redirect URLs.
3. Salva i secret di Edge Functions: `OPENAI_API_KEY` (obbligatoria), `OPENAI_MODEL` (facoltativo; default `gpt-4.1-mini`), `MTG_VECTOR_STORE_ID` (facoltativo), `MTG_ALLOWED_ORIGIN` (consigliato, esatto origin del tuo sito).
4. Configura `web/config.js` con il Project URL e la **publishable / anon key pubblica di Supabase**, mai la OpenAI API key.
5. Installa Supabase CLI e dal progetto: `supabase login`, `supabase link --project-ref TUO_REF`, `supabase functions deploy mtg-ai`.
6. Accedi dal sito con email, carica una descrizione e premi «Aggiorna analisi AI».

**Non inserire una chiave OpenAI nel browser, nemmeno per una demo privata online.** Le chiavi finirebbero nel repository JavaScript e potrebbero essere rubate o usate con addebiti sul tuo account.

## Knowledge Base dei documenti statici

1. Da OpenAI Platform crea un vector store e carica checklist/procedure verificate e con fonti (ad es. urbanistica, documenti prima dell'offerta, principi di lettura APE, costi condominiali).
2. Imposta il secret `MTG_VECTOR_STORE_ID=vs_...`.
3. Il backend usa File Search per consultare fino a tre risultati quando pertinenti. Non inserire documenti privati del buyer in quel vector store condiviso.
4. Fonti milanesi consigliate per un futuro layer GIS: Geoportale Lombardia, PGT Comune di Milano, PGRA alluvioni, CENED, eventuali mappature storiche delle coperture in cemento-amianto. **Non integrate in questa versione**: occorrono licenze, geocodifica affidabile e interrogazioni geospaziali. Le planimetrie delle singole unità non sono un dataset pubblico liberamente scaricabile.

## Cosa è simulato e cosa è realmente funzionante

| Funzione | Modalità locale | Con API OpenAI configurata |
| --- | --- | --- |
| Analisi annuncio | Euristica indicata come demo | Analisi LLM structured JSON |
| Chat | Risposta demo dichiarata | Risposte AI contestuali |
| Scoring preferenze | Calcolo client vero | Uguale, non arbitrariamente AI |
| Decision Readiness | Stati euristici | Stati documentali restituiti da AI, aggregazione deterministica |
| Report esperto | Illustrativo | Illustrativo, mai convalidato come tecnico |
| Intenti di pagamento | Registrati in locale | Registrati in locale, nessuna transazione |
| Documenti PDF | Estratti e conservati localmente in IndexedDB | Testo trasmesso all'API quando l'utente chiede analisi |

## Limiti da correggere PRIMA di un test pubblico non presidiato

- Identità utente e proprietà persistenti lato server con RLS; IndexedDB è locale, non sincronizzato. Per test con documenti veri sensibili: backend Storage privato, policy RLS, cancellazione e retention.
- Chat credits e sblocco paywall ora sono **localStorage** e manipolabili: appropriati per demo di intenzione di pagamento, non per monetizzare un servizio. Per dati di conversione controllati, registrare intenti centralmente con consenso e identificativi test.
- Un buyer può copiare/screenshotare qualsiasi dato mostrato. Limitare i dettagli della preview aiuta, ma non è protezione assoluta. L'endpoint AI non controlla un entitlement premium di backend: **non è un paywall sicuro**.
- Autenticazione/costi AI: rate limiting per account, budget API, logging prudente, abuse prevention e retry non ancora presenti in produzione.
- I PDF scansiti richiedono OCR o una pipeline vision. L'importazione dal solo URL non è disponibile senza accordi/API dei portali.
- Recensioni e competenze fittizie sono etichettate vicino ai profili e prima di confermare qualsiasi interesse economico. Non presentarle come testimonianze autentiche.
- Il rapporto con un professionista abilitato, gli oneri di privacy e le validazioni tecnico-legali devono essere implementati prima di offrire il servizio reale.
- Prima di valutare la willingness to pay secondo Lean Startup, distingui **intenzione di click** da **pagamento realmente effettuato**.

## File principali

- `web/index.html`, `web/style.css`, `web/app.js`, `web/config.js`, `web/assets/expert-*.webp`
- `supabase/functions/mtg-ai/index.ts` — unica funzione backend AI; controlla JWT, legge secret OpenAI, genera JSON strutturato.
- `supabase/config.toml` — verifica JWT attiva.

La versione è progettata per essere un esperimento concreto, senza falsificare acquisti o attestazioni tecniche.


## Revisione Decision Journey + fonti Milano
- La pagina immobile ora apre con un **percorso in 5 fasi**, progressivo ma non equiparabile a una certificazione di sicurezza; presenta una Next Best Action basata sui gap prioritari.
- Il buyer può registrare **valuterei l’offerta / devo approfondire / preferisco rinunciare**. Il feedback è salvato nel browser e nel tracciamento eventi.
- Homepage riordinata **descrizione → PDF → link (Beta)**. Da PDF la creazione estrae testo selezionabile; link import automatico NON implementato.
- `knowledge_base/sources.json`: catalogo di fonti ufficiali Milano e limiti. `mtg_checklist_milano.md`: checklist seed pronta. `upload_kb.py`: attivazione reale File Search con chiave e vector store del tuo account.
- **Non confondere i dataset territoriali con RAG:** PGT norme/guide nel RAG; CENED, PGRA e amianto richiedono query geografiche e validazione dell'indirizzo. Nessuna affermazione localizzata senza dati verificati.
