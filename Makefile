deploy:
	npm run build
	firebase deploy

lint:
	./node_modules/.bin/eslint