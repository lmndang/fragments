# tests/integration/put-fragments.hurl
# Authenticated POST to /v1/fragments
POST http://localhost:8080/v1/fragments

# user1@email.com:password1
Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==

# We're sending a text/plain; charset=utf-8 type fragment
Content-Type: text/plain

# Send a text in the body
```This is a text fragment!```

# We expect to get back an HTTP 201
HTTP/1.1 201

# Capture the Location URL into a variable named `url`
[Captures]
url: header "Location"

# 2. Try to GET the fragment we just posted by its URL
PUT {{url}}
Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==

# We're sending a text/plain; charset=utf-8 type fragment
Content-Type: text/plain

# Send a text in the body
```This is a updated fragment!```

HTTP/1.1 200
