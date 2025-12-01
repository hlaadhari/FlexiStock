.PHONY: build up down seed logs

build:
	docker-compose build

up:
	docker-compose up -d

down:
	docker-compose down

seed:
	docker-compose exec backend npm run seed

logs:
	docker-compose logs -f
