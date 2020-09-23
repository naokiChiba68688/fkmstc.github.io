```sequence
Frontend->Backend:get or post
Backend->Redis:get
Redis->Redis:get model
Redis-->MySQL:get model (When data is not found on Redis)
Redis-->Backend:mohdel
Backend-->Frontend:json
Frontend->Frontend:build DOM