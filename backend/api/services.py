import os

class MessageService:
    """
    Handles integrations with external messaging providers.
    Currently using placeholders. Replace with actual SDKs (e.g., Twilio, SendGrid).
    """

    def __init__(self):
        # Load API keys from env
        self.twilio_sid = os.getenv('TWILIO_ACCOUNT_SID')
        self.twilio_token = os.getenv('TWILIO_AUTH_TOKEN')
        self.sendgrid_key = os.getenv('SENDGRID_API_KEY')
        self.wa_token = os.getenv('WHATSAPP_API_TOKEN')

    def send_sms(self, phone_number, content):
        """
        Sends an SMS.
        Integrate Twilio SDK here in production.
        """
        if not phone_number:
            return False, "Phone number missing"
        
        # [PLACEHOLDER] Simulate Success
        print(f"-> [Twilio API] Sending SMS to {phone_number}: {content}")
        return True, None

    def send_email(self, email_address, subject, content):
        """
        Sends an Email.
        Integrate SendGrid API here in production.
        """
        if not email_address:
            return False, "Email address missing"
        
        # [PLACEHOLDER] Simulate Success
        print(f"-> [SendGrid API] Sending Email to {email_address} | Default Subj: {subject}")
        return True, None

    def send_whatsapp(self, phone_number, content):
        """
        Sends a WhatsApp message via WhatsApp Cloud API.
        """
        if not phone_number:
            return False, "Phone number missing"

        # [PLACEHOLDER] Simulate Success
        print(f"-> [WhatsApp API] Sending WA to {phone_number}: {content}")
        return True, None
