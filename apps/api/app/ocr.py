import pytesseract
from PIL import Image, ImageFilter, ImageEnhance
import ollama
import json
import re


def preprocess_image(image: Image.Image) -> Image.Image:
    image = image.convert("L")
    image = ImageEnhance.Contrast(image).enhance(2.0)
    image = image.filter(ImageFilter.SHARPEN)
    return image


def extract_text(image_path: str, lang: str = "nep+eng") -> str:
    image = Image.open(image_path)
    image = preprocess_image(image)
    text = pytesseract.image_to_string(image, lang=lang)
    return text.strip()


def parse_receipt_llm(raw_text: str) -> dict:
    client = ollama.Client(host="http://host.docker.internal:11434")
    response = client.chat(
        model="gemma3:4b",
        messages=[{
            "role": "user",
            "content": f"""Extract fields from this receipt and return ONLY valid JSON, no explanation, no markdown backticks.

{{
  "vendor": "string or null",
  "date": "YYYY-MM-DD or null",
  "total_amount": float or null,
  "currency": "string or null",
  "category": "one of: Food, Transport, Shopping, Health, Utilities, Entertainment, Other",
  "items": [{{"name": "string", "amount": float}}]
}}

Receipt:
{raw_text}"""
        }]
    )

    raw = response['message']['content'].strip()
    # Strip markdown backticks if model ignores instructions
    if raw.startswith("```"):
        raw = re.sub(r"```(?:json)?", "", raw).strip("`").strip()

    try:
        return json.loads(raw)
    except json.JSONDecodeError:
        return {
            "vendor": None,
            "date": None,
            "total_amount": None,
            "currency": None,
            "category": "Other",
            "items": [],
            "parse_error": "LLM returned invalid JSON",
            "raw_llm_output": raw
        }


# Keep old regex parser as fallback
def parse_receipt(text: str) -> dict:
    lines = text.strip().splitlines()
    vendor = next((l.strip() for l in lines if l.strip()), None)
    date_pattern = r'\b\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4}\b|\b\d{4}[\/\-\.]\d{1,2}[\/\-\.]\d{1,2}\b'
    date_match = re.search(date_pattern, text)
    date = date_match.group() if date_match else None
    total_pattern = r'(?:grand\s*total|totalamount\s*due|total\s*amount\s*due|(?<!sub)total(?!\s*\|)|जम्मा|कुल|जोड)[\s:Rs\.\|]*\$?([\d,]+\.?\d*)'
    total_match = re.search(total_pattern, text, re.IGNORECASE)
    total = float(total_match.group(1).replace(",", "")) if total_match else None
    item_pattern = r'^(.+?)\s+\$?[\d,]+\.?\d+\s+\$?([\d,]+\.?\d+)$'
    items = []
    for line in lines:
        line = line.strip()
        match = re.match(item_pattern, line)
        if match:
            name = match.group(1).strip()
            price = float(match.group(2).replace(",", ""))
            if any(kw in name.lower() for kw in ["total", "subtotal", "tax", "date", "quantity", "unit", "price", "description", "मिति", "जम्मा"]):
                continue
            if re.search(r'[\(\d][\d\s\-\(\)]{6,}', name):
                continue
            items.append({"name": name, "price": price})
    return {"vendor": vendor, "date": date, "total": total, "items": items}