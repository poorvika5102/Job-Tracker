from rest_framework import serializers

from .models import Job


class JobSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        fields = ["id", "company", "role", "url", "status", "date_applied", "notes", "created_at"]
        read_only_fields = ["id", "created_at"]


class AnalyzeSerializer(serializers.Serializer):
    description = serializers.CharField()
    skills = serializers.ListField(child=serializers.CharField(), allow_empty=True)
