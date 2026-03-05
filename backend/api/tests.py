from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from .models import User, Contact, Message, MessageLog

class AuthenticationTests(APITestCase):
    def test_registration(self):
        url = reverse('register')
        data = {
            'username': 'testuser',
            'password': 'testpassword123',
            'email': 'test@example.com',
            'company': 'Test Corp'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(username='testuser').exists())

    def test_login(self):
        # Create user
        User.objects.create_user(username='testuser', password='testpassword123')
        
        # Login
        url = reverse('login')
        data = {'username': 'testuser', 'password': 'testpassword123'}
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)

class ContactTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpassword123')
        self.client.force_authenticate(user=self.user)
        self.url = reverse('contact-list')

    def test_create_contact(self):
        data = {
            'first_name': 'John',
            'last_name': 'Doe',
            'email': 'johndoe@example.com',
            'phone': '+1234567890',
            'group': 'VIP'
        }
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Contact.objects.count(), 1)
        self.assertEqual(Contact.objects.get().user, self.user)

    def test_get_contacts(self):
        Contact.objects.create(user=self.user, first_name='Jane')
        response = self.client.get(self.url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

class MessagingTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpassword123')
        self.client.force_authenticate(user=self.user)
        self.contact = Contact.objects.create(user=self.user, first_name='John', phone='+12345')
        self.url = reverse('send_message')

    def test_send_message_api(self):
        data = {
            'channel': 'SMS',
            'content': 'Hello from test',
            'contact_ids': [self.contact.id]
        }
        response = self.client.post(self.url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Message.objects.count(), 1)
        self.assertEqual(MessageLog.objects.count(), 1)
        
        # Check logs are generated correctly
        log = MessageLog.objects.first()
        self.assertEqual(log.status, 'Delivered') # Based on our placeholder implementation
        self.assertEqual(log.message.content, 'Hello from test')
