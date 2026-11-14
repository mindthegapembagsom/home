# Mind The Gap — MVP, percorso buyer aggiornato (14 novembre 2026)

Questa è una **versione dimostrativa**, derivata dall'ultimo pacchetto `MTG_MVP_Verifiche_Complete_Deploy.zip`. È pensata per misurare comportamenti e intenzioni d'acquisto in un test MVP, non per erogare perizie, servizi professionali o pagamenti reali.

## File da pubblicare

- `web/` — frontend statico, da caricare **con il suo contenuto** nella root del repository GitHub Pages (index.html, app.js, style.css, config.js, assets/).
- `supabase/functions/mtg-ai/index.ts` — funzione da ripubblicare se si desiderano risposte OpenAI reali, incluse osservazioni sulle risposte buyer e classificazione delle richieste libere agli esperti.
- `knowledge_base/` — fonti, checklist e script opzionale di indicizzazione RAG. **Non contiene i PDF normativi ufficiali già indicizzati.**
- Le vecchie schermate del pacchetto precedente sono state omesse intenzionalmente: non rappresentano la nuova UI.

## Nuovo percorso

1. **Che cosa cerchi nella tua prossima casa?** Preferenze buyer comuni a tutte le case; aggiunta libera di criteri personali con importanza 0–5.
2. **Aggiungi una casa** tramite descrizione, PDF testuale, oppure link (Beta, non importa automaticamente l'annuncio).
3. **Prima analisi** dell'immobile, basata su regole dimostrative oppure OpenAI/Supabase.
4. **Domande da chiarire**, generate a partire dai gap: il buyer risponde (anche "Non lo so"), richiede un'osservazione AI, allega documenti, lascia aperto o dichiara chiuso. Chiusura e attendibilità documentale restano indipendenti.
5. **Prima valutazione gratuita**: sintesi delle questioni, indice di copertura informativa e valutazione personale. Il dettaglio dei gap e delle fonti non è esposto nell'interfaccia prima dello sblocco.
6. **Dossier completo da 49 €**: disponibile per la simulazione dopo avere risposto a tutte le domande generate, **senza richiederne la chiusura**. Il clic registra un'intenzione di pagamento, non un incasso.
7. **Professionisti simulati** suggeriti prima per le questioni ancora aperte. È possibile descrivere altre esigenze e cercare le competenze appropriate nel catalogo. Prima della richiesta si sceglie il perimetro di video-consulenza o sopralluogo; il prezzo base è un'ipotesi di test, gli approfondimenti aggiuntivi rimangono a preventivo non definito.
8. **Report professionale esemplificativo** incluso nella prestazione simulata, consultabile anche senza acquistare il dossier digitale. Non è una verifica autentica.
9. **Riepilogo e decisione**: possibilità di chiedere ancora all'AI, rivedere le domande, indicare intenzione di offerta, approfondimento o rinuncia; se rinuncia, è richiesta la motivazione.
10. **Le mie case / Confronta**: il profilo personale è condiviso, ogni immobile mantiene risposte e dossier separati; confronto sintetico gratis, dettaglio premium soltanto per i dossier sbloccati. Pulsante **«+ Valuta un’altra casa»** sempre presente nell'intestazione della scheda.

## Modifiche ai file

- `web/app.js`: navigazione, domande, risposte e stati, scope dei servizi esperti, matching, profilo e criteri personalizzati, gate del dossier, registrazione delle decisioni, confronto.
- `web/style.css`: stile di percorso e domande, campi risposta, selezione del perimetro di consulenza.
- `supabase/functions/mtg-ai/index.ts`: supporto alle operazioni `challenge` e `match_expert`, informazioni fornite dal buyer nella successiva analisi dell'immobile, istruzioni più attente ai controlli specifici.

## Pubblicazione rapida

**Frontend:** carica il contenuto di `web/` nella root del repository GitHub Pages, mantenendo `assets/`. Se sostituisci una versione precedente del sito, salva prima una copia. Apri il sito e forza l'aggiornamento della cache.

**Supabase/OpenAI (opzionale):** inserisci il Project URL e la chiave pubblica di Supabase in `web/config.js` (mai la OpenAI API key). In **Supabase → Edge Functions → Secrets** configura `OPENAI_API_KEY`, opzionalmente `OPENAI_MODEL` e `MTG_VECTOR_STORE_ID`. Dal terminale nella cartella principale:

```bash
npx supabase login
npx supabase link --project-ref IL_TUO_PROJECT_REF
npx supabase functions deploy mtg-ai
```

La funzione verifica la sessione di Supabase Auth. La configurazione Email OTP, Origin e redirect devono essere coerenti con il dominio di GitHub Pages. Usa un budget API contenuto.

## Cosa è realmente implementato / limiti

- **Funziona in modalità demo senza servizi esterni**: logica locale di gap, domande, chiusura, catalogo esperti simulati, richieste, report di esempio, confronto e acquisti simulati.
- **OpenAI reale** richiede configurazione e deployment della funzione. Non abbiamo eseguito test end-to-end sul progetto Supabase dell'utente. La funzione non ha quote robuste: *non pubblicare la modalità AI senza rate limiting e limiti di spesa per utente*.
- **Documenti**: si conserva il testo estratto da PDF testuali/TXT in IndexedDB sul dispositivo. Non è sincronizzato su Supabase e non è idoneo a gestire documenti personali sensibili di clienti reali.
- **RAG**: preparazione disponibile, ma nessuna normativa ufficiale o dato territoriale di Milano è stato già caricato nell'account OpenAI. I dataset geografici (catasto puntuale, CENED, PGT geolocalizzato, amianto, frane) non sono interrogati automaticamente: senza dati verificati l'AI deve parlare di verifiche suggerite, non di rischi accertati.
- **Link immobiliare Beta**: non effettua scraping automatico di Idealista/Immobiliare.it.
- **Prezzi**: dossier 49 €; chat 5 €/15, 10 €/40, 20 €/100; consulenza e sopralluogo con prezzi *di test*, non preventivi di veri professionisti. Nessun pagamento vero o appuntamento.
- **Profili/immagini/recensioni**: inventati, contrassegnati come simulati nel catalogo e prima di confermare qualsiasi richiesta.
- **Chiusura manuale**: il buyer può dichiarare chiusa una questione, ma non si altera lo stato delle prove né si certifica la conformità. Le osservazioni AI non sostituiscono controlli tecnici.
- **Preview e premium**: separati nel frontend dimostrativo; **non è un paywall antifrode** poiché lo sblocco è memorizzato localmente. Per un vero servizio a pagamento bisognerà gestire contenuti e diritti di accesso in backend.
- **Confronto**: nessun costo aggiuntivo oltre ai singoli dossier, le valutazioni non sono comparabili se mancano dati essenziali.

## Verifiche effettuate

- `node --check web/app.js`: superato.
- Parsing/traspilazione TypeScript Edge Function: nessun errore sintattico.
- Smoke test delle principali funzioni di rendering, via Node: onboarding, intestazione, riepilogo, domande, dossier, esperti, decisione e confronto generano markup senza eccezioni.
- **Non è stato possibile completare il collaudo in browser**: l'ambiente blocca l'apertura di pagine locali e il runner alternativo è andato in timeout. Verificare visivamente nel repository pubblicato prima di condividere il link con buyer esterni.
