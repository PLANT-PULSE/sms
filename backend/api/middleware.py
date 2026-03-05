import json
from django.utils.deprecation import MiddlewareMixin
from django.http import JsonResponse
from rest_framework import status

class APIErrorMiddleware(MiddlewareMixin):
    """
    Centralized Error Handling Middleware for APIs.
    Catches unhandled exceptions and returns a standardized JSON response.
    """
    def process_exception(self, request, exception):
        # We only want to handle exceptions for the API routes
        if request.path.startswith('/api/'):
            # Log the error here in a real production environment using python logging
            response_data = {
                'error': 'Internal Server Error',
                'detail': str(exception)
            }
            return JsonResponse(response_data, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        # Return None to let Django's default exception handling deal with it (for non-API paths)
        return None
