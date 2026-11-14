"""Indicizzazione esplicita di documenti ufficiali acquisiti legittimamente + checklist MTG.
Non mette chiavi nel frontend e non estrae automaticamente contenuti dai siti ufficiali.
"""
import os
from pathlib import Path
from openai import OpenAI

if not os.getenv("OPENAI_API_KEY"):
    raise SystemExit("Configura OPENAI_API_KEY come variabile d'ambiente.")
client = OpenAI()
root = Path(__file__).resolve().parent
files = [root / "mtg_checklist_milano.md"] + sorted((root / "official_pdfs").glob("*.pdf"))
vs = client.vector_stores.create(name="MTG Milano — riferimenti controllati")
for path in files:
    with path.open("rb") as stream:
        outcome = client.vector_stores.file_batches.upload_and_poll(vector_store_id=vs.id,files=[stream])
    print(path.name, outcome.status)
print("MTG_VECTOR_STORE_ID=" + vs.id)
