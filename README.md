# NachoNight Authentication API

> Documentation: [https://github.com/NachoNight/documentation/blob/master/docs/auth/README.md](https://github.com/NachoNight/documentation/blob/master/docs/auth/README.md)

---

### Requirements:

> Development:

- Node.js (v.10.16.3)

- Docker (v.19.03.2)

- Docker-Compose (v.1.24.1)

- Postgres (v.11.5)

---

### Scripts:

- `npm start` - Runs the Node server.

- `npm run dev` - Runs the server using Nodemon.

- `npm test` - Runs the test suite.

---

### Environmental Variables:

> You will need to create a .env file in the root directory of the file structure.

> Example file has been provided. `.env.example`

> Make sure to avoid conflicts between the variables set by Docker and the variables set in the file.

```
NODE_ENV=
DB_NAME=
DB_USER=
DB_PASSWORD=
DB_HOST=
DB_DIALECT=
DB_PORT=
SMTP_HOSTNAME=
MAIL_PORT=
MAIL_USER=
MAIL_PASSWORD=
MAIL_SENDER=
SECRET=
GOOGLE_OAUTH_CLIENT_ID=
GOOGLE_OAUTH_CLIENT_SECRET=
DISCORD_OAUTH_CLIENT_ID=
DISCORD_OAUTH_CLIENT_SECRET=
TWITTER_OAUTH_CONSUMER_KEY=
TWITTER_OAUTH_CONSUMER_SECRET=
```

---