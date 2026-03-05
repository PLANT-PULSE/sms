from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import RegisterView, ContactViewSet, MessageViewSet, MessageLogViewSet, send_message_api

router = DefaultRouter()
router.register(r'contacts', ContactViewSet, basename='contact')
router.register(r'messages', MessageViewSet, basename='message')
router.register(r'logs', MessageLogViewSet, basename='log')

urlpatterns = [
    # Auth
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/', TokenObtainPairView.as_view(), name='login'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Core Endpoints via ViewSets
    path('', include(router.urls)),

    # Send Message Endpoint
    path('messages/send/', send_message_api, name='send_message'),
]
