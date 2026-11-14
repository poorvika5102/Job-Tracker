"""Keyword-based skill matcher.

Version 1 finds known skills in a job description and compares them with the
skills you have. Later, replace `extract_skills` with an LLM call or an
embedding-based approach. The rest of the app will not need to change.
"""
import re

KNOWN_SKILLS = [
    "python", "django", "flask", "fastapi", "javascript", "typescript", "react",
    "node.js", "html", "css", "sql", "postgresql", "mysql", "mongodb", "git",
    "github", "docker", "kubernetes", "aws", "azure", "gcp", "linux", "rest",
    "graphql", "pandas", "numpy", "scikit-learn", "tensorflow", "pytorch",
    "machine learning", "deep learning", "nlp", "llm", "langchain", "ci/cd",
    "terraform", "redis", "tailwind", "java", "c++", "streamlit",
]


def _contains(text: str, skill: str) -> bool:
    pattern = r"(?<![\w+#])" + re.escape(skill) + r"(?![\w+#])"
    return re.search(pattern, text) is not None


def extract_skills(description: str) -> list[str]:
    text = description.lower()
    return [skill for skill in KNOWN_SKILLS if _contains(text, skill)]


def analyze(description: str, my_skills: list[str]) -> dict:
    required = extract_skills(description)
    mine = {s.strip().lower() for s in my_skills if s.strip()}
    matched = [s for s in required if s in mine]
    missing = [s for s in required if s not in mine]
    score = round(100 * len(matched) / len(required)) if required else 0
    return {
        "required_skills": required,
        "matched": matched,
        "missing": missing,
        "score": score,
    }
