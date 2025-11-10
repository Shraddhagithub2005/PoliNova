from django.urls import path
from . import views

urlpatterns = [
    # Email verification & QR
    path("send-verification-email/", views.send_verification_email, name="send_verification_email"),
    path("verify-email/", views.verify_email, name="verify_email"),
    path("generate-qr/", views.generate_qr, name="generate_qr"),
    path("verify-otp/", views.verify_otp, name="verify_otp"),

    # Authentication
    path("signup/", views.signup, name="signup"),
    path("login-victim/", views.login_victim, name="login_victim"),  
    path("login-police/", views.login_police, name="login_police"),  

    # Victim Profile APIs
    path("victim/profile/save/", views.save_profile, name="save_profile"), 
    path("victim/profile/<str:email>/", views.get_profile, name="get_profile"),

    # Complaint APIs
    path("victim/complaint/save/", views.save_complaint, name="save_complaint"),
    path("victim/complaint/list/", views.complaint_list, name="complaint_list"),
 

    #  Police can update complaint status (Accept / Reject)
    path("victim/complaint/update-status/<str:complaint_id>/", views.update_complaint_status, name="update_complaint_status"),
    path("victim/complaint/detail/<str:complaint_id>/", views.complaint_detail, name="complaint_detail"),

]
