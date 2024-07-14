from django.core.management.base import BaseCommand
from django.contrib.auth.models import User

class Command(BaseCommand):
    help = 'Creates a demo user'

    def handle(self, *args, **kwargs):
        username = 'Roulettech'
        password = 'Roulettech123'
        if not User.objects.filter(username=username).exists():
            User.objects.create_user(username=username, password=password)
            self.stdout.write(self.style.SUCCESS(f'Successfully created user: {username}'))
        else:
            self.stdout.write(self.style.Warning(f'User {username} already exists'))