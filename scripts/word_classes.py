#!/usr/bin/env python3
# ─── word_classes.py ──────────────────────────────────────────────────────
# Builds public/data/word-classes.json from the explanatory dictionary (ТСБЯ, vols I–II, А–Р):
# each headword with its part-of-speech label. Headwords and labels only, none of the entries.
#
#   python scripts/word_classes.py <dir with expl_dic_bur_lang_{1,2}.pdf>
#
# Needs PyMuPDF. Entries start on printed page 28 in vol. I and 12 in vol. II.

import json
import re
import sys

import pymupdf

FIRST_PAGE = {1: 28, 2: 12}
LABELS = {
    "юум. н.": "noun",
    "тэмд. н.": "adjective",
    "тоог. н.": "numeral",
    "тоо. н.": "numeral",
}
UPPER = "А-ЯЁӨҮҺѲY"  # Latin Y stands for Ү in places: МОРИГYЙ
LABEL = "|".join(re.escape(label) for label in LABELS)
# АДАҺА(Н) юум. н. · БАЙШАН(Г) юум. н. · ААГ I юум. н. · НЮТАГ 1. юум. н. · АМАР 2. юум. н.
TOKEN = re.compile(
    rf"(?<![{UPPER}а-яёөүһѳ-])(?P<head>[{UPPER}]{{2,}}(?:-[{UPPER}]+)*)(?P<stem>\([НГ]\))?"
    rf"(?: I+V?)?[:,]?(?: \d\.)?(?: (?P<label>{LABEL}))?"
    rf"| \d\. (?P<sense>{LABEL})"
)


def main(folder: str) -> None:
    classes: dict[str, set[str]] = {name: set() for name in LABELS.values()}
    for volume, first in FIRST_PAGE.items():
        pdf = pymupdf.open(f"{folder}/expl_dic_bur_lang_{volume}.pdf")
        text = " ".join(pdf[i].get_text() for i in range(first - 1, len(pdf)))
        words: list[str] = []
        for match in TOKEN.finditer(re.sub(r"\s+", " ", text)):
            if match["head"]:
                word = match["head"].lower().replace("ѳ", "ө").replace("y", "ү")
                # АДАҺА(Н) is written with and without the н; БАЙШАН(Г) has a back н.
                words = [word, word + "н"] if match["stem"] == "(Н)" else [word]
            label = match["label"] or match["sense"]
            if label:
                classes[LABELS[label]].update(words)

    data = {"source": "ТСБЯ 2022–2023, vols I–II (А–Р)"}
    data.update({name: sorted(words) for name, words in classes.items()})
    with open("public/data/word-classes.json", "w", encoding="utf8", newline="\n") as out:
        json.dump(data, out, ensure_ascii=False, separators=(",", ":"))
        out.write("\n")
    print({name: len(words) for name, words in classes.items()})


if __name__ == "__main__":
    main(sys.argv[1])
