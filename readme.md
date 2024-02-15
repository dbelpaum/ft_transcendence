# FT_TRANSCENDENCE

A website where you can play pong and chat with your friends

![](https://github.com/dbelpaum/ft_transcendence/blob/master/demo%20transcendence.gif)


Running under NestJS (backend) and React (frontend), written in TypeScript.

#Build
Requires Docker. [Get Docker](Https://Docs.Docker.Com/Get-Docker/)
Copy the following to a `.env` file at the root of the repo.
```
#Postgres database information
POSTGRES_USER=samir
POSTGRES_PASSWORD=samir
POSTGRES_DB=transcendance

#URL for prisma to connect with postgres
DATABASE_URL=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@postgres:5432

#42 API authentification
## Create your own 42 app : https://profile.intra.42.fr/oauth/applications/
FORTYTWO_APP_ID="YOUR_APP_ID"
FORTYTWO_APP_SECRET="YOUR_APP_SECRET"
FORTYTWO_CALLBACK=http://localhost:4000/authentification/42/callback

# Secret key for JWT
SECRET_JWT=azpxmvfsdozpw46fd54wxj78a9ze16mlk56

# Secret key for internal requests
INTERNAL_SECRET_WORD=wnaq7y3F2j6Q3C3w7a9z3m6dn5

AUTH_NAME="Transcendance"
```

Then you can run `docker compose up --build`
