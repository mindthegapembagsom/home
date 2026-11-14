# Knowledge Base ufficiale Milano: cosa è davvero attivato

**Inclusi nel pacchetto:** `sources.json` (catalogo di fonti ufficiali controllate), `mtg_checklist_milano.md` (checklist interna pronta da indicizzare), `upload_kb.py` (tool per caricare documenti propri/ufficiali su OpenAI).
**Non incluso:** accesso autenticato OpenAI, i file delle mappe cartografiche, dati di singole visure o planimetrie private, interrogazioni automatiche per coordinate. La presenza in `sources.json` non vuol dire che sia già stata indicizzata.

## Attivazione RAG
1. Verifica i documenti ufficiali aggiornati dalla pagina `MIL_PGT`: scegli norme vigenti (non confondere con versioni adottate o previgenti) e scarica i PDF consentiti per il tuo utilizzo.
2. Scarica il PDF guida catastale dal link `IT_CATASTO`.
3. Metti i PDF autorizzati nella cartella `knowledge_base/official_pdfs` (creala).
4. Su un terminale con `OPENAI_API_KEY` come variabile d'ambiente: `pip install openai` e `python knowledge_base/upload_kb.py`. Salva il `vs_...` stampato.
5. Aggiungi `MTG_VECTOR_STORE_ID` ai Supabase Edge Function Secrets e pubblica la funzione `mtg-ai`. Controlla in OpenAI Platform lo stato dei file indicizzati prima di testare.

La checklist interna è un seed (non una fonte ufficiale). Il RAG recupera testo pertinente; NON è un GIS e NON certifica vincoli o conformità. CENED, PGRA e amianto richiedono adattatori dati georeferenziati, per i quali il catalogo include link e restrizioni.
