import os

from django.http import StreamingHttpResponse
from django.shortcuts import render
from rest_framework import generics, permissions
from rest_framework.response import Response
from knox.models import AuthToken
from .serializers import UserSerializer, LoginSerializer
from django.contrib.auth import login
from openai import OpenAI
import openai


class LoginAPI(generics.CreateAPIView):
    serializer_class = LoginSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        if not serializer.is_valid():
            print(serializer.errors)
            return Response(serializer.errors, status=400)

        user = serializer.validated_data
        login(request, user)
        _, token = AuthToken.objects.create(user)

        return Response({
            "user": UserSerializer(user).data,
            "token": token
        })


class ChatAPI(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        user_input = request.data.get('message', '')
        api_key = os.getenv("OPENAI_API_KEY")

        if not api_key:
            return Response({"error": "OpenAI API key not found."}, status=500)

        try:
            client = OpenAI(api_key=api_key)

            def stream_response():
                response = client.chat.completions.create(
                    messages=[
                        {
                            "role": "user",
                            "content": user_input,
                        }
                    ],
                    stream=True,
                    model="gpt-3.5-turbo",
                )
                for chunk in response:
                    content = chunk.choices[0].delta.content or ""
                    yield content

            return StreamingHttpResponse(stream_response(), content_type='text/plain')
        except openai.RateLimitError as e:
            return Response({"error": "Rate limit exceeded. Please try again later."}, status=429)
        except Exception as e:
            return Response({"error": f"An unexpected error occurred: {str(e)}"}, status=500)


def IndexView(request):
    return render(request, 'index.html')
