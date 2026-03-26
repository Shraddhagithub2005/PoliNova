import json

from django.test import TestCase
from unittest.mock import patch


class LegalAssistantChatTests(TestCase):
    def test_legal_chatbot_contract_for_police(self):
        response = self.client.post(
            "/api/legal-chatbot/",
            data=json.dumps(
                {
                    "message": "A bike was stolen from outside the market.",
                    "user_type": "police",
                }
            ),
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 200)
        payload = response.json()
        self.assertIn("reply", payload)
        self.assertIn("Crime Type", payload["reply"])
        self.assertIn("IPC Sections", payload["reply"])
        self.assertIn("Explanation", payload["reply"])
        self.assertIn("Action Steps", payload["reply"])

    def test_victim_chat_returns_relevant_sections(self):
        response = self.client.post(
            "/api/legal-assistant/chat/",
            data=json.dumps(
                {
                    "role": "victim",
                    "message": "My phone was stolen from my bag and I want to file an FIR.",
                }
            ),
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 200)
        payload = response.json()
        self.assertIn("Theft", payload["matched_topics"])
        sections = {item["section"] for item in payload["matched_sections"]}
        self.assertIn("379", sections)

    def test_police_chat_supports_cyber_fraud_guidance(self):
        response = self.client.post(
            "/api/legal-assistant/chat/",
            data=json.dumps(
                {
                    "user_type": "police",
                    "message": "Complainant lost money in an OTP phishing cyber fraud through UPI.",
                }
            ),
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 200)
        payload = response.json()
        sections = {item["section"] for item in payload["matched_sections"]}
        self.assertTrue({"420", "Information Technology Act Section 66D"}.intersection(sections))
        self.assertIn("Crime Type:", payload["answer"])
        self.assertIn("BNS 318", payload["answer"])

    def test_message_is_required(self):
        response = self.client.post(
            "/api/legal-assistant/chat/",
            data=json.dumps({"role": "victim", "message": ""}),
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 400)

    def test_victim_response_uses_structured_format_and_bns(self):
        response = self.client.post(
            "/api/legal-assistant/chat/",
            data=json.dumps(
                {
                    "user_type": "victim",
                    "message": "My husband and in-laws are harassing me for dowry and beating me.",
                }
            ),
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 200)
        payload = response.json()
        self.assertIn("Issue Understanding:", payload["answer"])
        self.assertIn("Your Rights:", payload["answer"])
        self.assertIn("BNS 85", payload["answer"])

    def test_legal_chatbot_extortion_mapping(self):
        response = self.client.post(
            "/api/legal-chatbot/",
            data=json.dumps(
                {
                    "message": "Someone is blackmailing me and demanding money or they will leak my private photos.",
                    "user_type": "victim",
                }
            ),
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 200)
        payload = response.json()
        self.assertIn("reply", payload)
        self.assertIn("IPC 384", payload["reply"]["IPC Sections"])

    def test_legal_chatbot_cyber_bullying_mapping(self):
        response = self.client.post(
            "/api/legal-chatbot/",
            data=json.dumps(
                {
                    "message": "A fake Instagram profile is harassing and abusing the victim online.",
                    "user_type": "police",
                }
            ),
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 200)
        payload = response.json()
        self.assertIn("reply", payload)
        self.assertEqual(payload["reply"]["Crime Type"], "Cyber bullying, online harassment, or fake profile abuse")

    def test_legal_chatbot_keeps_english_output_for_en(self):
        response = self.client.post(
            "/api/legal-chatbot/",
            data=json.dumps(
                {
                    "message": "My bike was stolen",
                    "user_type": "victim",
                    "language": "en",
                }
            ),
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 200)
        payload = response.json()
        self.assertEqual(payload["language"], "en")
        self.assertIn("It seems like you're dealing with", payload["reply"]["Explanation"])

    @patch("fir.views.translate_text")
    def test_legal_chatbot_translates_only_final_reply_for_hi(self, mock_translate_text):
        mock_translate_text.side_effect = lambda text, lang: f"HI::{text}" if lang == "hi" else text

        response = self.client.post(
            "/api/legal-chatbot/",
            data=json.dumps(
                {
                    "message": "My bike was stolen",
                    "user_type": "victim",
                    "language": "hi",
                }
            ),
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 200)
        payload = response.json()
        self.assertEqual(payload["language"], "hi")
        self.assertEqual(payload["reply"]["Crime Type"], "HI::Theft")
        self.assertTrue(payload["reply"]["Explanation"].startswith("HI::"))
        self.assertTrue(payload["reply"]["Action Steps"].startswith("HI::"))
