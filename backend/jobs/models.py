import datetime

from django.db import models


class Job(models.Model):
    class Status(models.TextChoices):
        APPLIED = "applied", "Applied"
        INTERVIEW = "interview", "Interview"
        OFFER = "offer", "Offer"
        REJECTED = "rejected", "Rejected"

    company = models.CharField(max_length=120)
    role = models.CharField(max_length=120)
    url = models.URLField(blank=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.APPLIED)
    date_applied = models.DateField(default=datetime.date.today)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-date_applied", "-id"]

    def __str__(self):
        return f"{self.role} at {self.company}"
