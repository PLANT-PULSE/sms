from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    company = models.CharField(max_length=255, blank=True, null=True)
    role = models.CharField(max_length=100, default='Admin')

    def __str__(self):
        return self.username

class Contact(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='contacts')
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    group = models.CharField(max_length=100, blank=True, null=True)
    tags = models.JSONField(default=list, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name or ''}".strip()

class Message(models.Model):
    CHANNEL_CHOICES = (
        ('SMS', 'SMS'),
        ('Email', 'Email'),
        ('WhatsApp', 'WhatsApp'),
    )
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='messages')
    channel = models.CharField(max_length=20, choices=CHANNEL_CHOICES)
    subject = models.CharField(max_length=255, blank=True, null=True) # Used for Email
    content = models.TextField()
    template = models.CharField(max_length=100, blank=True, null=True) # Used for WhatsApp
    scheduled_date = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.channel} | {self.created_at.strftime('%Y-%m-%d %H:%M')}"

class MessageLog(models.Model):
    STATUS_CHOICES = (
        ('Pending', 'Pending'),
        ('Delivered', 'Delivered'),
        ('Failed', 'Failed'),
    )
    message = models.ForeignKey(Message, on_delete=models.CASCADE, related_name='logs')
    contact = models.ForeignKey(Contact, on_delete=models.CASCADE, related_name='logs')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')
    error_message = models.TextField(blank=True, null=True)
    sent_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.contact.phone or self.contact.email} - {self.status}"
