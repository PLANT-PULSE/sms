from rest_framework import viewsets, status, generics
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import api_view, permission_classes
from .models import User, Contact, Message, MessageLog
from .serializers import UserSerializer, ContactSerializer, MessageSerializer, MessageLogSerializer
from .services import MessageService

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = UserSerializer

class ContactViewSet(viewsets.ModelViewSet):
    serializer_class = ContactSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        return Contact.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class MessageViewSet(viewsets.ModelViewSet):
    serializer_class = MessageSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        return Message.objects.filter(user=self.request.user).order_by('-created_at')

class MessageLogViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = MessageLogSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        # We fetch logs related to messages authored by the current user
        return MessageLog.objects.filter(message__user=self.request.user).order_by('-sent_at')

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def send_message_api(request):
    """
    Endpoint to trigger sending a message to multiple contacts.
    Expected Body:
    {
        "channel": "SMS" | "Email" | "WhatsApp",
        "content": "Hello World",
        "subject": "Optional Email Subject",
        "contact_ids": [1, 2, 3]
    }
    """
    data = request.data
    channel = data.get('channel')
    content = data.get('content')
    contact_ids = data.get('contact_ids', [])
    subject = data.get('subject', '')

    if not channel or not content or not contact_ids:
        return Response({"error": "Missing required fields."}, status=status.HTTP_400_BAD_REQUEST)

    # 1. Create Message Record
    message = Message.objects.create(
        user=request.user,
        channel=channel,
        content=content,
        subject=subject
    )

    # 2. Fetch Contacts making sure they belong to the user
    contacts = Contact.objects.filter(id__in=contact_ids, user=request.user)

    # 3. Process Sending
    service = MessageService()
    results = []

    for contact in contacts:
        # Create Log (Pending initially, but updated synchronously here for simplicity)
        log = MessageLog.objects.create(
            message=message,
            contact=contact,
            status='Pending'
        )

        try:
            if channel == 'SMS':
                success, err = service.send_sms(contact.phone, content)
            elif channel == 'Email':
                success, err = service.send_email(contact.email, subject, content)
            elif channel == 'WhatsApp':
                success, err = service.send_whatsapp(contact.phone, content)
            else:
                success, err = False, "Invalid Channel"

            if success:
                log.status = 'Delivered'
            else:
                log.status = 'Failed'
                log.error_message = err
            log.save()

            results.append({
                "contact": contact.id,
                "status": log.status,
                "error": log.error_message
            })

        except Exception as e:
            log.status = 'Failed'
            log.error_message = str(e)
            log.save()
            results.append({
                "contact": contact.id,
                "status": "Failed",
                "error": str(e)
            })

    return Response({
        "message_id": message.id,
        "results": results
    }, status=status.HTTP_201_CREATED)
