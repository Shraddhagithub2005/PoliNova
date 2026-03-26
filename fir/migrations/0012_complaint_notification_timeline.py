from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("fir", "0011_complaint_status"),
    ]

    operations = [
        migrations.AddField(
            model_name="complaint",
            name="notification",
            field=models.CharField(blank=True, default="", max_length=255),
        ),
        migrations.AddField(
            model_name="complaint",
            name="timeline",
            field=models.JSONField(blank=True, default=list),
        ),
    ]
