from rest_framework import serializers
from .models import User, Contact, Message, MessageLog

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password', 'company', 'role')

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password'],
            company=validated_data.get('company', ''),
            role=validated_data.get('role', 'Admin')
        )
        return user

class ContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contact
        fields = '__all__'
        read_only_fields = ('user', 'created_at', 'updated_at')

class MessageLogSerializer(serializers.ModelSerializer):
    contact_name = serializers.CharField(source='contact.first_name', read_only=True)
    channel = serializers.CharField(source='message.channel', read_only=True)

    class Meta:
        model = MessageLog
        fields = '__all__'

class MessageSerializer(serializers.ModelSerializer):
    logs = MessageLogSerializer(many=True, read_only=True)

    class Meta:
        model = Message
        fields = '__all__'
        read_only_fields = ('user', 'created_at', 'updated_at')
