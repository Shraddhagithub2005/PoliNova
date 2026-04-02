from django.contrib import admin
from .models import Victim, Complaint, Suspect, EmailVerification, PhoneVerification

# Register your models here.
admin.site.register(Victim)
admin.site.register(Complaint)
admin.site.register(Suspect)
admin.site.register(EmailVerification)
admin.site.register(PhoneVerification)
