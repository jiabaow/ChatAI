import time
from django.core.cache import cache
from django.utils.deprecation import MiddlewareMixin
from django.http import JsonResponse


class RateLimitMiddleware(MiddlewareMixin):
    def __init__(self, get_response=None):
        super().__init__(get_response)
        self.get_response = get_response
        self.rate_limit = 5
        self.rate_period = 60

    def process_request(self, request):
        user = request.user
        if user.is_authenticated:
            user_id = user.id
            key = f'rate-limit-{user_id}'
            request_times = cache.get(key, [])

            now = time.time()

            request_times = [timestamp for timestamp in request_times if now - timestamp < self.rate_period]

            if len(request_times) >= self.rate_limit:
                return JsonResponse({'error': 'rate limit exceeded'}, status=429)

            request_times.append(now)
            cache.set(key, request_times, timeout=self.rate_period)

        return self.get_response(request)