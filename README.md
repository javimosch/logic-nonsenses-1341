#SMC WEB APP

 - Develop using npm run local
 - Generate a release version using npm run release
 - Deploy to production via FTP using npm run deploy
 
## Features

 - Ftp deploy
 - Live sync editing using firebase
 - Heroku compatible. Just push the app and is working.
 
## Enviromental vars

 - PORT
 - ROOT_MODE: When you are in development mode (npm run local), ROOT_MODE allow you to generate the app in domain/ rather than domain/smc. For SMC, default to 1.
 - PROD: Indicate that is a release build. Default to 1. But its managed automatically depends on the commands above. 
 - API_ENDPOINT (IMPORTANT): Indicate the api endpoint for SMC when generating the config file. Important for release and deploy.