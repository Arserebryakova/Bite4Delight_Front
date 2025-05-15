# summarizer.py
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from transformers import pipeline

app = FastAPI(title="RU→EN→Summarize→EN→RU Service")

# 1) Load pipelines once at startup
translator_to_en = pipeline(
    "translation_ru_to_en",
    model="Helsinki-NLP/opus-mt-ru-en"
)
summarizer = pipeline(
    "summarization",
    model="facebook/bart-large-cnn"
)
translator_to_ru = pipeline(
    "translation_en_to_ru",
    model="Helsinki-NLP/opus-mt-en-ru"
)

class SummReq(BaseModel):
    texts: list[str]

class SummRes(BaseModel):
    summary: str

@app.post("/summarize", response_model=SummRes)
async def summarize(req: SummReq):
    if not req.texts:
        raise HTTPException(status_code=400, detail="`texts` must be non-empty")

    # 2) Join all Russian texts
    ru_block = "\n".join(req.texts)

    # 3) Translate Russian → English
    en_block = translator_to_en(
        ru_block,
        max_length=1000,
        truncation=True
    )[0]["translation_text"]

    # 4) Summarize in English
    summary_outputs = summarizer(
        en_block,
        max_length=150,
        min_length=50,
        do_sample=False
    )
    en_summary = summary_outputs[0]["summary_text"].strip()

    # 5) Translate English summary → Russian
    ru_summary = translator_to_ru(
        en_summary,
        max_length=150,
        truncation=True
    )[0]["translation_text"]

    return SummRes(summary=ru_summary)
