import json
import random
import pyotp
import qrcode
import io
import re
import string
from datetime import datetime
from django.core.mail import send_mail
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone
from django.conf import settings
from django.contrib.auth.hashers import check_password, make_password
from .models import Victim, EmailVerification, PhoneVerification, Complaint
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .serializers import VictimSerializer


# ------------------- EMAIL VERIFICATION -------------------
@csrf_exempt
def send_verification_email(request):

    # ✅ Handle CORS preflight
    if request.method == "OPTIONS":
        return JsonResponse({"message": "OK"}, status=200)

    if request.method != "POST":
        return JsonResponse({"error": "Invalid request method"}, status=405)

    try:
        # ✅ SAFE JSON parsing
        try:
            data = json.loads(request.body.decode("utf-8"))
        except:
            return JsonResponse({"error": "Invalid JSON"}, status=400)

        print("Incoming request:", data)

        email = data.get("email")

        if not email:
            return JsonResponse({"error": "Email is required"}, status=400)

        otp = str(random.randint(100000, 999999))

        EmailVerification.objects.update_or_create(
            email=email,
            defaults={"token": otp, "created_at": timezone.now()},
        )

        send_mail(
            subject="SmartFIR Email Verification Code",
            message=f"Your OTP is: {otp}",
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=[email],
            fail_silently=False,
        )

        return JsonResponse({"message": "OTP sent successfully"}, status=200)

    except Exception as e:
        print("❌ EMAIL ERROR:", str(e))
        return JsonResponse({"error": str(e)}, status=500)


@csrf_exempt
def verify_email(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            email = data.get("email")
            otp = data.get("otp")
            aadhaar = data.get("aadhaar", "000000000000")
            phone = data.get("phone", "")
            name = data.get("name", "")

            if not email or not otp:
                return JsonResponse({"error": "Email and OTP are required"}, status=400)

            record = EmailVerification.objects.filter(email=email, token=otp).first()
            if not record:
                return JsonResponse({"error": "Invalid or expired OTP"}, status=400)

            victim, created = Victim.objects.get_or_create(
                email=email,
                defaults={
                    "aadhaar": aadhaar,
                    "phone": phone,
                    "first_name": name.split()[0] if name else "",
                    "last_name": " ".join(name.split()[1:]) if name and len(name.split()) > 1 else "",
                    "address": "",
                    "city": "",
                    "state": "",
                    "pincode": "",
                    "country": "",
                },
            )

            victim.is_verified = True
            victim.save()
            record.delete()

            return JsonResponse({
                "message": "Email verified successfully!",
                "victim_id": victim.id,
                "is_new": created
            })

        except Exception as e:
            print(" OTP verification error:", e)
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid request"}, status=400)


# ------------------- PHONE VERIFICATION -------------------
def generate_qr(request):
    phone = request.GET.get("phone")

    if not phone:
        return JsonResponse({"error": "Phone number is required"}, status=400)

    # 🔥 DELETE OLD RECORD (IMPORTANT)
    PhoneVerification.objects.filter(phone=phone).delete()

    # ✅ CREATE NEW SECRET
    secret = pyotp.random_base32()

    PhoneVerification.objects.create(
        phone=phone,
        secret=secret,
        verified=False,
        created_at=timezone.now()
    )

    totp = pyotp.TOTP(secret)

    uri = totp.provisioning_uri(
        name=phone,
        issuer_name="SmartFIR"
    )

    img = qrcode.make(uri)
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    buf.seek(0)

    return HttpResponse(buf.getvalue(), content_type="image/png")


@csrf_exempt
def verify_otp(request):

    if request.method == "OPTIONS":
        return JsonResponse({"message": "OK"}, status=200)

    if request.method != "POST":
        return JsonResponse({"error": "Invalid request method"}, status=405)

    try:
        data = json.loads(request.body.decode("utf-8"))
        print("Incoming OTP:", data)

        phone = data.get("phone")
        otp = str(data.get("otp")).strip()

        if not phone or not otp:
            return JsonResponse({"error": "Phone and OTP required"}, status=400)

        try:
            obj = PhoneVerification.objects.get(phone=phone)
        except PhoneVerification.DoesNotExist:
            return JsonResponse({"error": "QR not generated"}, status=404)

        totp = pyotp.TOTP(obj.secret)

        # 🔥 FINAL FIX (handles delay + sync issues)
        if totp.verify(otp, valid_window=5):
            obj.verified = True
            obj.save()

            return JsonResponse({"message": "Phone verified successfully"}, status=200)
        else:
            print("❌ Expected OTP:", totp.now())  # DEBUG
            return JsonResponse({"error": "Invalid OTP"}, status=400)

    except Exception as e:
        print("❌ ERROR:", str(e))
        return JsonResponse({"error": str(e)}, status=500)



# ------------------- SIGNUP -------------------
@csrf_exempt
def signup(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            email = data.get("email")
            phone = data.get("phone")
            password = data.get("password")

            if not email or not phone or not password:
                return JsonResponse({"error": "Email, phone, and password are required"}, status=400)

            if len(password) < 8 or not re.search(r"[A-Z]", password) or not re.search(r"[a-z]", password) \
               or not re.search(r"\d", password) or not re.search(r"[!@#$%^&*(),.?\":{}|<>]", password):
                return JsonResponse({
                    "error": "Password must be at least 8 characters long, include upper and lower case letters, a number, and a special character."
                }, status=400)

            victim = Victim.objects.filter(email=email).first()
            if not victim:
                return JsonResponse({"error": "Please verify your email first."}, status=400)

            phone_record = PhoneVerification.objects.filter(phone=phone, verified=True).first()
            if not phone_record:
                return JsonResponse({"error": "Please verify your phone first."}, status=400)
            
            existing_phone = Victim.objects.filter(phone=phone).exclude(id=victim.id).first()
            if existing_phone:
                return JsonResponse({"error": "This phone number is already linked to another account."}, status=400)

            existing_aadhaar = Victim.objects.filter(aadhaar=data.get("aadhaar")).exclude(id=victim.id).first()
            if existing_aadhaar:
                return JsonResponse({"error": "This Aadhaar number is already linked to another account."}, status=400)

            victim.first_name = data.get("firstName")
            victim.last_name = data.get("lastName")
            victim.phone = phone
            victim.aadhaar = data.get("aadhaar")
            victim.address = data.get("address")
            victim.city = data.get("city")
            victim.state = data.get("state")
            victim.pincode = data.get("pincode")
            victim.country = data.get("country")
            victim.password = make_password(password)
            victim.is_verified = True
            victim.created_at = timezone.now()
            victim.save()

            return JsonResponse({"message": "Signup successful!", "id": victim.id})

        except Exception as e:
            print("Signup error:", e)
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid request"}, status=400)


# ------------------- VICTIM LOGIN -------------------
@csrf_exempt
def login_victim(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            email = data.get("email")
            password = data.get("password")

            if not email or not password:
                return JsonResponse({"error": "Email and password are required"}, status=400)

            victim = Victim.objects.filter(email=email).first()
            if not victim:
                return JsonResponse({"error": "User not found"}, status=404)

            if check_password(password, victim.password):
                return JsonResponse({
                    "message": "Login successful",
                    "victim_id": victim.id,
                    "email": victim.email,
                    "first_name": victim.first_name,
                })
            else:
                return JsonResponse({"error": "Invalid password"}, status=401)

        except Exception as e:
            print(" Login error:", e)
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid request method"}, status=405)


# ------------------- PROFILE -------------------
@csrf_exempt
def get_profile(request, email):
    try:
        victim = Victim.objects.get(email=email)
        serializer = VictimSerializer(victim)
        data = serializer.data
        if 'address' in data:
            try:
                data['address'] = json.loads(data['address'])
            except:
                pass
        return JsonResponse(data, status=200)
    except Victim.DoesNotExist:
        return JsonResponse({'message': 'Profile not found'}, status=404)


@csrf_exempt
def save_profile(request):

    if request.method == "OPTIONS":
        return JsonResponse({"message": "OK"}, status=200)

    if request.method != "POST":
        return JsonResponse({"error": "Invalid request method"}, status=405)

    try:
        data = json.loads(request.body.decode("utf-8"))
        print("Incoming profile data:", data)

        email = data.get("email")
        if not email:
            return JsonResponse({"error": "Email is required"}, status=400)

        if isinstance(data.get("address"), dict):
            data["address"] = json.dumps(data["address"])

        victim, created = Victim.objects.get_or_create(email=email)

        # ✅ SAFE FIELD UPDATE
        victim.first_name = data.get("first_name", victim.first_name)
        victim.last_name = data.get("last_name", victim.last_name)
        victim.phone = data.get("phone", victim.phone)
        victim.address = data.get("address", victim.address)
        victim.city = data.get("city", victim.city)
        victim.state = data.get("state", victim.state)
        victim.pincode = data.get("pincode", victim.pincode)
        victim.country = data.get("country", victim.country)

        victim.save()

        response_data = VictimSerializer(victim).data

        if "address" in response_data:
            try:
                response_data["address"] = json.loads(response_data["address"])
            except:
                pass

        return JsonResponse(response_data, status=200)

    except Exception as e:
        print("❌ Save Profile Error:", str(e))
        return JsonResponse({"error": str(e)}, status=500)
# ------------------- POLICE LOGIN -------------------
@csrf_exempt
def login_police(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            email = data.get("email")
            password = data.get("password")

            FIXED_EMAIL = "police@smartfir.com"
            FIXED_PASSWORD = "Police@123"

            if email == FIXED_EMAIL and password == FIXED_PASSWORD:
                return JsonResponse({"message": "Police login successful"}, status=200)
            else:
                return JsonResponse({"error": "Invalid Police ID or Password"}, status=401)

        except Exception as e:
            print(" Police Login Error:", e)
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid request method"}, status=405)

@csrf_exempt
def save_complaint(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body.decode("utf-8"))

            time_value = data.get("time")

            # ✅ FIX invalid time
            if not time_value or "NaN" in time_value:
                time_value = datetime.now().strftime("%H:%M:%S")

            complaint = Complaint(
                complaint_id=data.get("complaint_id"),
                victim_email=data.get("victim_email"),
                category=data.get("category"),
                subCategory=data.get("subCategory"),
                description=data.get("description"),
                location=data.get("location"),
                date=data.get("date"),
                time=time_value,   # ✅ fixed
                delay=data.get("delay", "No"),
                created_at=timezone.now(),
            )

            complaint.save()
            return JsonResponse({"message": "Complaint saved successfully!"}, status=200)

        except Exception as e:
            print("❌ Complaint save error:", str(e))
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid request method"}, status=400)



@csrf_exempt
def complaint_list(request):
    if request.method == "GET":
        try:
            complaints = Complaint.objects.all().values(
                "complaint_id",
                "category",
                "description",
                "date",
                "time",
                "location",
                "delay",
                "victim_email",
                "created_at",
            ).order_by("-created_at")

            return JsonResponse(list(complaints), safe=False, status=200)
        except Exception as e:
            print("❌ Complaint list error:", e)
            return JsonResponse({"error": str(e)}, status=500)
    else:
        return JsonResponse({"error": "Invalid request"}, status=405)


@csrf_exempt
def update_complaint_status(request, complaint_id):
    if request.method == "PUT":
        try:
            data = json.loads(request.body)
            new_status = data.get("status")

            if new_status not in ["Pending", "Accepted", "Rejected"]:
                return JsonResponse({"error": "Invalid status value"}, status=400)

            complaint = Complaint.objects.get(id=complaint_id)
            complaint.status = new_status
            complaint.save()

            return JsonResponse({"message": "Complaint status updated successfully"}, status=200)
        except Complaint.DoesNotExist:
            return JsonResponse({"error": "Complaint not found"}, status=404)
        except Exception as e:
            print("❌ Update complaint status error:", e)
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid request method"}, status=405)

@csrf_exempt
def complaint_detail(request, complaint_id):
    if request.method == "GET":
        try:
            from django.forms.models import model_to_dict
            complaint = Complaint.objects.get(complaint_id=complaint_id)
            data = model_to_dict(complaint)

            # If you have a Victim model linked, include it
            if hasattr(complaint, "victim"):
                data["victim_name"] = complaint.victim.full_name
                data["victim_email"] = complaint.victim.email
                data["victim_phone"] = complaint.victim.phone
                data["victim_address"] = complaint.victim.address

            return JsonResponse(data, status=200)
        except Complaint.DoesNotExist:
            return JsonResponse({"error": "Complaint not found"}, status=404)
        except Exception as e:
            print("❌ Complaint detail error:", e)
            return JsonResponse({"error": str(e)}, status=500)
    return JsonResponse({"error": "Invalid request"}, status=405)


