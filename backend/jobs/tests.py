from django.test import SimpleTestCase
from rest_framework.test import APITestCase

from . import matcher
from .models import Job


class MatcherTests(SimpleTestCase):
    def test_extracts_known_skills(self):
        found = matcher.extract_skills("We use Python, Django and PostgreSQL daily.")
        self.assertEqual(found, ["python", "django", "postgresql"])

    def test_does_not_match_inside_other_words(self):
        self.assertNotIn("java", matcher.extract_skills("Strong JavaScript skills"))

    def test_score_and_missing(self):
        result = matcher.analyze("Python, Django, Docker", ["Python", "Django"])
        self.assertEqual(result["score"], 67)
        self.assertEqual(result["missing"], ["docker"])


class JobApiTests(APITestCase):
    def test_create_and_list(self):
        res = self.client.post("/api/jobs/", {"company": "Acme", "role": "ML Engineer"}, format="json")
        self.assertEqual(res.status_code, 201)
        self.assertEqual(res.data["status"], "applied")
        self.assertEqual(len(self.client.get("/api/jobs/").data), 1)

    def test_filter_by_status(self):
        Job.objects.create(company="A", role="x", status="offer")
        Job.objects.create(company="B", role="y", status="applied")
        res = self.client.get("/api/jobs/?status=offer")
        self.assertEqual([j["company"] for j in res.data], ["A"])

    def test_stats(self):
        Job.objects.create(company="A", role="x", status="offer")
        Job.objects.create(company="B", role="y")
        res = self.client.get("/api/jobs/stats/")
        self.assertEqual(res.data["offer"], 1)
        self.assertEqual(res.data["total"], 2)

    def test_analyze_endpoint(self):
        res = self.client.post(
            "/api/analyze/",
            {"description": "Need React and Django", "skills": ["react"]},
            format="json",
        )
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.data["score"], 50)
