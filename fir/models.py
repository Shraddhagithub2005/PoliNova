from django.db import models
from django.utils import timezone
from django.contrib.auth.hashers import make_password  

class Victim(models.Model):
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    address = models.TextField()
    city = models.CharField(max_length=50)
    state = models.CharField(max_length=50)
    pincode = models.CharField(max_length=10)
    country = models.CharField(max_length=50)
    email = models.EmailField(unique=True)
    aadhaar = models.CharField(max_length=12, unique=True)
    phone = models.CharField(max_length=15, unique=True)
    password = models.CharField(max_length=255, default="", blank=True) 
    is_verified = models.BooleanField(default=False)
    is_phone_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(default=timezone.now)

    # --- START: NEW FIELDS ADDED TO MATCH REACT FORM ---
    title = models.CharField(max_length=10, blank=True, null=True)
    name = models.CharField(max_length=100, blank=True, null=True)
    mobile = models.CharField(max_length=15, blank=True, null=True)
    email = models.EmailField(unique=True, blank=False, null=False)
    dob = models.DateField(null=True, blank=True)
    gender = models.CharField(max_length=10, blank=True, null=True)
    relationType = models.CharField(max_length=50, blank=True, null=True)
    relationName = models.CharField(max_length=100, blank=True, null=True)
   

    password = models.CharField(max_length=255, default="", blank=True)
    is_verified = models.BooleanField(default=False)
    is_phone_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.email})"

    #  Automatically hash password before saving
    def save(self, *args, **kwargs):
        if self.password and not self.password.startswith('pbkdf2_sha256$'):
            self.password = make_password(self.password)
        super(Victim, self).save(*args, **kwargs)


class EmailVerification(models.Model):
    email = models.EmailField(unique=True)
    token = models.CharField(max_length=100, unique=True)
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"{self.email} - {self.token}"


class PhoneVerification(models.Model):
    phone = models.CharField(max_length=15, unique=True)  # fine
    secret = models.CharField(max_length=32, blank=True, null=True)  # for pyotp
    verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"{self.phone} - {'Verified' if self.verified else 'Not Verified'}"


# Complaint


class Complaint(models.Model):
    complaint_id = models.AutoField(primary_key=True)
    victim_email = models.EmailField()
    category = models.CharField(max_length=100, default="General")
    subCategory = models.CharField(max_length=100, default="Other")
    date = models.DateField(default=timezone.now)
    time = models.TimeField(default="00:00:00")
    delay = models.CharField(max_length=10, default="No")
    location = models.CharField(max_length=100, default="Unknown")
    description = models.TextField(default="")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Complaint {self.complaint_id} - {self.category}"