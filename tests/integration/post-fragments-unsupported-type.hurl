# tests/integration/post-fragments-unsupported-type.hurl
# Authenticated POST to /v1/fragments
POST http://localhost:8080/v1/fragments

# user1@email.com:password1
Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==

# We're sending a unsupported type fragment
Content-Type: application/xml

# Body of the request goes in ```...``` when it's a string
```Nothing to send```

# We expect to get back an HTTP 415 (unsupported type)
HTTP/1.1 415
