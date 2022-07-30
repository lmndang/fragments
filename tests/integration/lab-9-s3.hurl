# tests/integration/lab-9-s3.hurl


# 1. POST a new text fragment to http://localhost:8080 as an authorized user.
#    The fragment's body should be the string, Hello S3!.
POST http://localhost:8080/v1/fragments
Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==
Content-Type: text/plain
```Hello S3!```

# 2. Confirm that the server returns a 201
#    Capture the Location header value to a variable named url
HTTP/1.1 201
[Captures]
url: header "Location"

# 3. GET the fragment you just created using the url as an authorized user.
GET {{url}}
Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==

# 4. Confirm that the server returns a 200
#    The type of the fragment is text/plain
#    The body is equal to Hello S3!
HTTP/1.1 200
Content-Type: text/plain
[Asserts]
body == "Hello S3!"

# 5. DELETE the fragment using the url as an authorized user.
DELETE {{url}}
Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==

# 6. Confirm that the server returns a 200.
HTTP/1.1 200

# 7. Try to GET the fragment again using the url as an authorized user.
GET {{url}}
Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==

# 8. Confirm that the server returns a 404, since the fragment should be deleted.
HTTP/1.1 404
