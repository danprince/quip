start-client:
	cd client && yarn dev

start-server:
	cd client && yarn dev

build-client:
	cd client && yarn build

deploy-client:
	cd client && yarn deploy

deploy-server:
	cd server && yarn deploy

build:
	@make build-client

deploy:
	echo "Deploying client"
	@make deploy-client
	echo "Deploying server"
	@make deploy-server
