# tests/integration/lab-10-dynamodb.hurl

# 1. POST a new JSON fragment as an authorized user.
POST http://localhost:8080/v1/fragments
Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==
Content-Type: application/json
{ "service": "DynamoDB" }

# 2. Confirm that the server returns a 201 and capture values
HTTP/1.1 201
[Captures]
fragment1_url: header "Location"
fragment1_id: jsonpath "$.fragment.id"

# 3. GET the fragment info
GET {{fragment1_url}}/info
Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==
HTTP/1.1 200
[Asserts]
jsonpath "$.status" == "ok"
jsonpath "$.fragment.id" == {{fragment1_id}}
jsonpath "$.fragment.type" == "application/json"

# 4. POST a second Markdown fragment
POST http://localhost:8080/v1/fragments
Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==
Content-Type: text/plain
```DynamoDB is **great**.```

# 5. Confirm that the server returns a 201 and capture values
HTTP/1.1 201
[Captures]
fragment2_url: header "Location"
fragment2_id: jsonpath "$.fragment.id"

# 6. GET the fragment info
GET {{fragment2_url}}/info
Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==
HTTP/1.1 200
[Asserts]
jsonpath "$.status" == "ok"
jsonpath "$.fragment.id" == {{fragment2_id}}
jsonpath "$.fragment.type" == "text/plain"

# 7. GET all of the fragments
GET http://localhost:8080/v1/fragments
Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==
HTTP/1.1 200
[Asserts]
jsonpath "$.fragments" includes {{fragment1_id}}
jsonpath "$.fragments" includes {{fragment2_id}}

# 8. DELETE the first fragment
DELETE {{fragment1_url}}
Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==

# 9. Confirm that the server returns a 200
HTTP/1.1 200

# 10. Try to GET the first fragment
GET {{fragment1_url}}/info
Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==

# 11. Confirm that the server returns a 404
HTTP/1.1 404

# 12. GET all of the fragments, confirm that the first id is NOT included
GET http://localhost:8080/v1/fragments
Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==
HTTP/1.1 200
[Asserts]
jsonpath "$.fragments" not includes {{fragment1_id}}
jsonpath "$.fragments" includes {{fragment2_id}}
