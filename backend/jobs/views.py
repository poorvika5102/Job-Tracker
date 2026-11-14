from django.db import connection
from rest_framework import viewsets
from rest_framework.decorators import action, api_view
from rest_framework.response import Response

from . import matcher
from .models import Job
from .serializers import AnalyzeSerializer, JobSerializer


class JobViewSet(viewsets.ModelViewSet):
    serializer_class = JobSerializer

    def get_queryset(self):
        qs = Job.objects.all()
        status = self.request.query_params.get("status")
        search = self.request.query_params.get("search")
        if status:
            qs = qs.filter(status=status)
        if search:
            qs = qs.filter(company__icontains=search)
        return qs

    @action(detail=False, methods=["get"])
    def stats(self, request):
        """Jobs per status, written as raw SQL on purpose, for SQL practice."""
        sql = f"SELECT status, COUNT(*) FROM {Job._meta.db_table} GROUP BY status"
        with connection.cursor() as cursor:
            cursor.execute(sql)
            rows = dict(cursor.fetchall())
        data = {value: rows.get(value, 0) for value, _ in Job.Status.choices}
        data["total"] = sum(data.values())
        return Response(data)


@api_view(["POST"])
def analyze(request):
    serializer = AnalyzeSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    result = matcher.analyze(
        serializer.validated_data["description"],
        serializer.validated_data["skills"],
    )
    return Response(result)
