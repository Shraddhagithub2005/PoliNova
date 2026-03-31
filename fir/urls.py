from django.urls import path
from . import views
from .views import save_suspect
from .views import get_suspects
from .views import get_suspect_by_complaint

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
    path("suspect/save/", save_suspect),
    path("suspects/", get_suspects),
    path('suspect/<int:complaint_id>/', get_suspect_by_complaint),
    
 

    #  Police can update complaint status (Accept / Reject)
    path("victim/complaint/update-status/<str:complaint_id>/", views.update_complaint_status, name="update_complaint_status"),
    path("victim/complaint/detail/<str:complaint_id>/", views.complaint_detail, name="complaint_detail"),
    path("victim/complaint/delete/<str:complaint_id>/", views.delete_complaint, name="delete_complaint"),
    path("legal-chatbot/", views.legal_chatbot_api, name="legal_chatbot_api"),
    path("legal-assistant/chat/", views.legal_assistant_chat, name="legal_assistant_chat"),

]
