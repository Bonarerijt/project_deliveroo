import os
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
from dotenv import load_dotenv
import logging

load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class EmailService:
    def __init__(self):
        self.api_key = os.getenv("SENDGRID_API_KEY")
        self.enabled = bool(self.api_key and self.api_key != "your-sendgrid-api-key")
        
        if not self.enabled:
            logger.warning("SENDGRID_API_KEY not set or is placeholder. Email notifications disabled.")
    
    def send_notification(self, to_email: str, subject: str, content: str):
        """Send email notification"""
        if not self.enabled:
            logger.info(f"Email would be sent to {to_email}: {subject}")
            return False
        
        try:
            message = Mail(
                from_email='notifications@deliveroo.com',
                to_emails=to_email,
                subject=subject,
                html_content=content
            )
            
            sg = SendGridAPIClient(self.api_key)
            response = sg.send(message)
            logger.info(f"Email sent to {to_email}: {response.status_code}")
            return response.status_code == 202
        except Exception as e:
            logger.error(f"Error sending email: {e}")
            return False
    
    def send_status_update(self, to_email: str, parcel_id: int, new_status: str):
        subject = f"📦 Deliveroo: Parcel #{parcel_id} Status Updated"
        content = f"""
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #0066FF; color: white; padding: 20px; text-align: center;">
                <h1>🚚 Deliveroo Update</h1>
            </div>
            <div style="padding: 20px; background: #f9f9f9;">
                <h2>Parcel Status Update</h2>
                <p>Your parcel #{parcel_id} status has been updated to: <strong>{new_status.replace('_', ' ').title()}</strong></p>
                <p>Track your parcel at: <a href="{os.getenv('FRONTEND_URL', 'http://localhost:3000')}/parcel/{parcel_id}">View Details</a></p>
            </div>
        </div>
        """
        return self.send_notification(to_email, subject, content)
    
    def send_location_update(self, to_email: str, parcel_id: int, new_location: str):
        subject = f"📍 Deliveroo: Parcel #{parcel_id} Location Updated"
        content = f"""
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #00D4AA; color: white; padding: 20px; text-align: center;">
                <h1>📍 Location Update</h1>
            </div>
            <div style="padding: 20px; background: #f9f9f9;">
                <h2>Parcel Location Update</h2>
                <p>Your parcel #{parcel_id} is now at: <strong>{new_location}</strong></p>
                <p>Track your parcel at: <a href="{os.getenv('FRONTEND_URL', 'http://localhost:3000')}/parcel/{parcel_id}">View Details</a></p>
            </div>
        </div>
        """
        return self.send_notification(to_email, subject, content)

email_service = EmailService()
