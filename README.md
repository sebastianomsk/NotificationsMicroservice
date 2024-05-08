# NotificationsMicroservice
Notifications Microservice is a notifications administrator.

## Index

* [Download][download].
* [How is it used?][how_is_it_used].
* [Endpoints][endpoints].

## Download

### Source code
```shell
$ git clone git@github.com:sebastianomsk/NotificationsMicroservice.git
$ cd NotificationsMicroservice
$ npm install
```

## How is it used?

### Run

Create a .env file or export the required environment variables based on the .env.* files and then run one of the following commands:

```shell
# Development
npm run dev
# Development - Watch changes
npm run dev:watch

# Production
npm start

# Docker
docker-compose up -d --build
```

## Endpoints
* `GET` [/ping](#get-ping) Get Ping return Pong if it is alive.
* `POST` [/notifications](#post-notifications) Create Notification.

#### GET `/ping`

Get Ping return Pong if it is alive.

##### Request Examples
###### Response Example:

```json
{
  message: pong
}
```

##### Response Body (Error)
| Name         | Type      | Description                          |
|:-------------|:----------|:-------------------------------------|
| code      | Integer     |  Error status code |
| error      | String     |  Error message |
| extra      | Object     | _**(Optional)**_ Additional information |

##### Response XXX (Error):

```json
{
  "code": XXX,
  "error": "<message>"
}
// Example: { "code": 404, "error": "Not Found" }
```

#### POST `/notifications`

Create Notification.
##### Request Parameters
| Name         | Type      | Group      | Description                          |
|:-------------|:----------|:-----------|:-------------------------------------|
| metadata      | Object     | Body |  Metadata used to assemble the settings and the body of the notification. |
| metadata[subject]      | String     | Body |  Subject (Email: email subject). |
| metadata[to]      | String     | Body |  Sender (Email: email to). |
| metadata[Text]      | String     | Body |  All needed information to send. |

##### Request Examples
###### Send **Email** Request Example:

```json
{
  "files": ...,
  "metadata": {
    "to": "test@test.com"
    "subject": "Test",
    "text": "Holaaa!",
  }
}
```

##### Response Body (Error)
| Name         | Type      | Description                          |
|:-------------|:----------|:-------------------------------------|
| code      | Integer     |  Error status code |
| error      | String     |  Error message |
| extra      | Object     | _**(Optional)**_ Additional information |

##### Response XXX (Error):

```json
{
  "code": XXX,
  "error": "<message>"
}
// Example: { "code": 404, "error": "Not Found" }
```

## Tests

In order to see more concrete examples, **I INVITE YOU TO LOOK AT THE TESTS :)**

### Run the unit tests
```shell
npm test
```

<!-- deep links -->
[download]: #download
[how_is_it_used]: #how-is-it-used
[endpoints]: #endpoints
[tests]: #tests
