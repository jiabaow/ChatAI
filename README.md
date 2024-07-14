This is a simple version of Chat-GPT based on OpenAI API. 

To run this app: 

Go to /backend \
change OPENAI_API_KEY in .env to your API KEY \
do: \
`python manage.py makemigrations` \
`python manage.py migrate` \
`python manage.py runserver`

Go to /fronted, do: \
`npm start`

Then log in with the given username and password
