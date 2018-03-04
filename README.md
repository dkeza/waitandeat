# Wait and it
Give phone number to restaurant, and receive SMS when there is table free.

I also used [Zapier](https://zapier.com) and [Twilio](https://www.twilio.com/) to send E-Mail and SMS.

## My firebase security rules:

```json
{
  "rules": {
    "emails": {
      "$emailId": {
        ".read": "false",
        ".write": "auth != null"
      }
    },
    "textMessages": {
      "$textMessageId": {
        ".read": "false",
        ".write": "auth != null"
      }
    },
    "users": {
      "$userId": {
        ".read": "auth != null && auth.id == $userId",
        ".write": "auth != null && auth.id == $userId"
      }
    }
  }
}
```

---
Code was adapted from angularcourse.com