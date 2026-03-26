import json
import re
from functools import lru_cache
from pathlib import Path


DATA_PATH = Path(__file__).resolve().parent / "data" / "legal_knowledge.json"

BNS_REFERENCES = {
    "zero_fir_and_fir_rights": [
        {"section": "BNSS 173", "title": "Information in cognizable cases"},
        {"section": "BNSS 176", "title": "Procedure for investigation"},
        {"section": "BNSS 183", "title": "Recording of confessions and statements"},
    ],
    "theft": [
        {"section": "BNS 303", "title": "Theft"},
        {"section": "BNS 304", "title": "Snatching"},
    ],
    "robbery_dacoity": [
        {"section": "BNS 309", "title": "Robbery"},
        {"section": "BNS 310", "title": "Dacoity"},
        {"section": "BNS 311", "title": "Robbery or dacoity with attempt to cause death or grievous hurt"},
    ],
    "cheating_and_breach_of_trust": [
        {"section": "BNS 316", "title": "Criminal breach of trust"},
        {"section": "BNS 318", "title": "Cheating"},
        {"section": "BNS 319", "title": "Cheating by personation"},
    ],
    "cyber_fraud": [
        {"section": "BNS 318", "title": "Cheating"},
        {"section": "BNS 319", "title": "Cheating by personation"},
        {"section": "IT Act 66C", "title": "Identity theft"},
        {"section": "IT Act 66D", "title": "Cheating by personation using computer resource"},
    ],
    "assault_hurt": [
        {"section": "BNS 115", "title": "Voluntarily causing hurt"},
        {"section": "BNS 130", "title": "Assault"},
        {"section": "BNS 131", "title": "Punishment for assault or criminal force otherwise than on grave provocation"},
    ],
    "grievous_hurt": [
        {"section": "BNS 116", "title": "Grievous hurt"},
        {"section": "BNS 117", "title": "Voluntarily causing grievous hurt"},
        {"section": "BNS 118", "title": "Voluntarily causing hurt or grievous hurt by dangerous weapons or means"},
        {"section": "BNS 124", "title": "Voluntarily causing grievous hurt by use of acid, etc."},
    ],
    "sexual_harassment_and_modesty": [
        {"section": "BNS 74", "title": "Assault or use of criminal force to woman with intent to outrage her modesty"},
        {"section": "BNS 75", "title": "Sexual harassment"},
        {"section": "BNS 79", "title": "Word, gesture or act intended to insult modesty of a woman"},
    ],
    "rape_and_sexual_assault": [
        {"section": "BNS 63", "title": "Rape"},
        {"section": "BNS 64", "title": "Punishment for rape"},
        {"section": "BNS 70", "title": "Gang rape"},
        {"section": "BNSS 184", "title": "Medical examination of victim of rape"},
    ],
    "stalking_voyeurism": [
        {"section": "BNS 77", "title": "Voyeurism"},
        {"section": "BNS 78", "title": "Stalking"},
        {"section": "BNS 79", "title": "Word, gesture or act intended to insult modesty of a woman"},
    ],
    "kidnapping_abduction": [
        {"section": "BNS 87", "title": "Kidnapping, abducting or inducing woman to compel her marriage, etc."},
        {"section": "BNS 137", "title": "Kidnapping"},
        {"section": "BNS 138", "title": "Abduction"},
        {"section": "BNS 140", "title": "Kidnapping or abducting in order to murder or for ransom, etc."},
    ],
    "criminal_intimidation": [
        {"section": "BNS 351", "title": "Criminal intimidation"},
    ],
    "domestic_violence_and_cruelty": [
        {"section": "BNS 80", "title": "Dowry death"},
        {"section": "BNS 85", "title": "Husband or relative of husband of a woman subjecting her to cruelty"},
        {"section": "BNS 316", "title": "Criminal breach of trust"},
    ],
    "murder_homicide": [
        {"section": "BNS 100", "title": "Culpable homicide"},
        {"section": "BNS 101", "title": "Murder"},
        {"section": "BNS 103", "title": "Punishment for murder"},
        {"section": "BNS 109", "title": "Attempt to murder"},
    ],
    "rioting_and_unlawful_assembly": [
        {"section": "BNS 189", "title": "Unlawful assembly"},
        {"section": "BNS 190", "title": "Every member of unlawful assembly guilty of offence committed in prosecution of common object"},
        {"section": "BNS 191", "title": "Rioting"},
    ],
    "trespass_and_property_damage": [
        {"section": "BNS 324", "title": "Mischief"},
        {"section": "BNS 329", "title": "Criminal trespass and house-trespass"},
        {"section": "BNS 330", "title": "House-trespass and house-breaking"},
        {"section": "BNS 331", "title": "Punishment for house-trespass or house-breaking"},
    ],
    "extortion_blackmail": [
        {"section": "BNS 308", "title": "Extortion"},
        {"section": "BNS 351", "title": "Criminal intimidation"},
        {"section": "IT Act 66E", "title": "Violation of privacy"},
        {"section": "IT Act 67A", "title": "Sexually explicit electronic material"},
    ],
    "cyber_bullying_and_online_harassment": [
        {"section": "BNS 351", "title": "Criminal intimidation"},
        {"section": "BNS 356", "title": "Defamation"},
        {"section": "IT Act 66C", "title": "Identity theft"},
        {"section": "IT Act 66D", "title": "Cheating by personation using computer resource"},
        {"section": "IT Act 67", "title": "Obscene electronic material"},
    ],
}


@lru_cache(maxsize=1)
def load_legal_knowledge():
    with DATA_PATH.open("r", encoding="utf-8") as dataset_file:
        return json.load(dataset_file)


def normalize_text(value):
    return re.sub(r"[^a-z0-9\s]", " ", value.lower()).strip()


def tokenize(value):
    return [token for token in normalize_text(value).split() if token]


def score_entry(message, entry):
    normalized_message = normalize_text(message)
    message_tokens = set(tokenize(message))
    score = 0

    for keyword in entry.get("keywords", []):
        normalized_keyword = normalize_text(keyword)
        keyword_tokens = set(normalized_keyword.split())

        if normalized_keyword and normalized_keyword in normalized_message:
            score += max(4, len(keyword_tokens) * 2)
        elif keyword_tokens and keyword_tokens.issubset(message_tokens):
            score += len(keyword_tokens) * 2
        elif keyword_tokens and message_tokens.intersection(keyword_tokens):
            score += 1

    return score


def find_relevant_entries(message, limit=3):
    scored_entries = []
    for entry in load_legal_knowledge():
        score = score_entry(message, entry)
        if score > 0:
            scored_entries.append((score, entry))

    scored_entries.sort(key=lambda item: item[0], reverse=True)
    return [entry for _, entry in scored_entries[:limit]]


def build_current_law_references(entries):
    references = []
    seen = set()

    for entry in entries:
        for reference in BNS_REFERENCES.get(entry["id"], []):
            key = (reference["section"], reference["title"])
            if key not in seen:
                seen.add(key)
                references.append(reference)

    return references


def build_generic_response(role):
    if role == "police":
        return (
            "Crime Type: Need more details\n"
            "IPC Sections: To be determined after facts are shared\n"
            "Explanation: Please share the incident type, place, time, accused details if known, injury or property loss, and available evidence. I can then suggest likely IPC sections, FIR points, and basic procedure.\n"
            "Action Steps: Record the complainant's version clearly, preserve immediate evidence, note witnesses, and verify final charging under current law and station procedure."
        )

    return (
        "Issue Understanding: I need a few more facts to guide you properly.\n"
        "Your Rights: You can approach the police, ask for your complaint to be recorded, and keep proof of your complaint or diary entry.\n"
        "What You Should Do: Share what happened, where it happened, when it happened, and whether you have any messages, photos, witnesses, injury papers, or payment proof.\n"
        "Legal Info: I can suggest possible IPC sections and complaint steps after you describe the issue."
    )


def build_answer(message, role="victim"):
    entries = find_relevant_entries(message)

    if not entries:
        return {
            "answer": build_generic_response(role),
            "matched_topics": [],
            "matched_sections": [],
        }

    lines = []
    matched_sections = []
    primary_topic = entries[0]["title"]
    current_law_refs = build_current_law_references(entries)

    for entry in entries:
        section_chunks = []
        for section in entry.get("ipc_sections", []):
            section_chunks.append(f"IPC {section['section']} ({section['title']})")
            matched_sections.append(
                {
                    "type": "IPC",
                    "section": section["section"],
                    "title": section["title"],
                    "topic": entry["title"],
                }
            )

        for law in entry.get("other_laws", []):
            section_chunks.append(f"{law['law']} ({law['title']})")
            matched_sections.append(
                {
                    "type": "Other law",
                    "section": law["law"],
                    "title": law["title"],
                    "topic": entry["title"],
                }
            )

    unique_sections = []
    seen = set()
    for item in matched_sections:
        key = (item["type"], item["section"], item["title"])
        if key not in seen:
            seen.add(key)
            unique_sections.append(item)

    if role == "police":
        all_section_labels = [
            f"IPC {item['section']}" if item["type"] == "IPC" else item["section"]
            for item in unique_sections
        ]
        current_labels = [f"{item['section']} ({item['title']})" for item in current_law_refs]
        explanation_parts = [entries[0]["summary"]]
        if entries[0].get("notes"):
            explanation_parts.append(entries[0]["notes"])
        if current_labels:
            explanation_parts.append("Current-law references to verify: " + ", ".join(current_labels) + ".")

        action_steps = []
        for entry in entries:
            action_steps.extend(entry.get("police_guidance", [])[:2])
        if entries[0]["id"] == "zero_fir_and_fir_rights":
            action_steps.append("Review BNSS procedure on information in cognizable cases, investigation steps, and statement recording before final processing.")
        if unique_sections:
            action_steps.append("Use the section suggestions only as initial guidance and verify final applicability before registration or charge framing.")

        lines = [
            f"Crime Type: {primary_topic}",
            f"IPC Sections: {', '.join(all_section_labels) if all_section_labels else 'No clear section identified yet'}",
            f"Explanation: {' '.join(explanation_parts)}",
            f"Action Steps: {' '.join(action_steps[:4])}",
        ]
    else:
        rights = [
            "You can report a cognizable offence to the police and ask for an acknowledgement or FIR details.",
            "If there is urgency or danger, you should seek immediate police or medical help."
        ]
        victim_steps = []
        legal_info = []
        for entry in entries:
            victim_steps.extend(entry.get("victim_guidance", [])[:2])
            for item in entry.get("ipc_sections", [])[:2]:
                legal_info.append(f"IPC {item['section']} ({item['title']})")
            for item in entry.get("other_laws", [])[:1]:
                legal_info.append(f"{item['law']} ({item['title']})")
        for item in current_law_refs[:4]:
            legal_info.append(f"{item['section']} ({item['title']})")

        lines = [
            f"Issue Understanding: {primary_topic}. {entries[0]['summary']}",
            f"Your Rights: {' '.join(rights)}",
            f"What You Should Do: {' '.join(victim_steps[:4])}",
            f"Legal Info: {', '.join(legal_info) if legal_info else 'Possible legal sections depend on the full facts shared.'}",
        ]

    return {
        "answer": "\n".join(lines).strip(),
        "matched_topics": [entry["title"] for entry in entries],
        "matched_sections": unique_sections,
        "current_law_references": current_law_refs,
    }


def generate_legal_chatbot_reply(message, user_type):
    role = (user_type or "victim").strip().lower()
    entries = find_relevant_entries(message)

    if not entries:
        if role == "police":
            return {
                "Crime Type": "Unknown",
                "IPC Sections": "Need more facts",
                "Explanation": "I need a little more detail before I can suggest the right sections or procedure. Please share what happened, where it happened, when it happened, whether there was injury or property loss, and what evidence is already available.",
                "Action Steps": "You can start by recording the complaint clearly, noting the place, time, persons involved, and preserving the first available evidence. After that, verify whether the offence is cognizable and apply the correct sections before drafting the FIR.",
            }

        return {
            "Crime Type": "General legal issue",
            "IPC Sections": "Will depend on full facts",
            "Explanation": "I can help, but I need a few more details first. Please tell me what happened, where it happened, and whether you have any proof like messages, photos, bills, or witness details.",
            "Action Steps": "For now, keep all proof safe, avoid deleting messages or screenshots, and contact the police or emergency help immediately if there is danger, injury, or a serious threat.",
        }

    primary_entry = entries[0]
    ipc_sections = []
    for entry in entries:
        for section in entry.get("ipc_sections", []):
            ipc_sections.append(f"IPC {section['section']} ({section['title']})")

    if role == "police":
        police_steps = []
        evidence_points = []
        for entry in entries:
            police_steps.extend(entry.get("police_guidance", [])[:2])
            evidence_points.extend(entry.get("evidence", [])[:3])

        explanation_parts = [
            f"It seems like this may be a case of {primary_entry['title'].lower()}.",
            primary_entry["summary"],
        ]
        if primary_entry.get("notes"):
            explanation_parts.append(primary_entry["notes"])
        if evidence_points:
            explanation_parts.append(
                "Key evidence to check: " + ", ".join(dict.fromkeys(evidence_points)) + "."
            )

        return {
            "Crime Type": primary_entry["title"],
            "IPC Sections": ", ".join(ipc_sections) if ipc_sections else "No clear IPC section identified yet",
            "Explanation": " ".join(explanation_parts),
            "Action Steps": "Here’s what you should do next: " + (
                " ".join(police_steps[:4])
                or "Record the facts carefully, preserve evidence, and verify the applicable sections before FIR drafting."
            ),
        }

    victim_steps = []
    evidence_points = []
    for entry in entries:
        victim_steps.extend(entry.get("victim_guidance", [])[:2])
        evidence_points.extend(entry.get("evidence", [])[:3])

    rights_text = (
        f"It seems like you're dealing with a {primary_entry['title'].lower()} situation. "
        "Under Indian law, you can file a complaint, ask for an acknowledgement or FIR number, and keep copies of your evidence. "
        "If there is danger, injury, or an immediate threat, you should seek police or medical help quickly."
    )

    action_text = "Here’s what you should do: " + (
        " ".join(victim_steps[:4]) or "Keep your evidence safe and report the matter to the police."
    )
    if evidence_points:
        action_text += " Keep these proofs safe: " + ", ".join(dict.fromkeys(evidence_points)) + "."

    return {
        "Crime Type": primary_entry["title"],
        "IPC Sections": ", ".join(ipc_sections[:4]) if ipc_sections else "Depends on complete facts",
        "Explanation": rights_text,
        "Action Steps": action_text,
    }
