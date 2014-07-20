## Build DDP Site/Network
##
## docker build -t discodonniepresents/www.discodonniepresents.com:0.1.0 --rm .
##

NAME 			= discodonniepresents/www.discodonniepresents.com
VERSION 	= 0.1.0

default:
	make install

# Build Docker Image for deployment
docker:
	cd application/static/etc && \
	docker build -t $(NAME):$(VERSION) --rm .

# Build for Distribution
build:
	npm install --silent --production && \
	composer install --prefer-dist && \
	grunt install --environment=production --system=linux --type=cluster

# Install for Development
install:
	npm install --silent --development && \
	composer install --prefer-source && \
	grunt install --environment=development --system=linux --type=cluster
