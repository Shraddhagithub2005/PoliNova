from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("fir", "0010_remove_complaint_id_remove_complaint_incident_date_and_more"),
    ]

    operations = [
        migrations.AddField(
            model_name="complaint",
            name="status",
            field=models.CharField(default="Pending", max_length=20),
        ),
    ]
