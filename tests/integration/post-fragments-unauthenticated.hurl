# tests/integration/post-fragments-unauthenticated.hurl
# Authenticated POST to /v1/fragments
POST http://localhost:8080/v1/fragments

# We expect to get back an HTTP 401 (unauthenticated user)
HTTP/1.1 401
