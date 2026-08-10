from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView

from app.models import Category

from ..serializers.category import CategorySerializer


class CategoryListCreateAPIView(ListCreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class CategoryRetrieveUpdateDestroyAPIView(RetrieveUpdateDestroyAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer