# ScreenDriver Serverless REST API with DynamoDB and offline support

## Setup

1. ```npm install -g serverless```
1. ```npm i```

## Run service offline
Setup dynamodb-local before start:

* ```sls dynamodb install```

Use ```npm run start-local``` to run locally perform.

## Deploy
###  Before:
Before run deploy commands, set environment variables to have access to AWS services:
* ```export AWS_ACCESS_KEY_ID=<Your_AWS_access_key>```
* ```export AWS_SECRET_ACCESS_KEY=<Your_AWS_secret_access_key>```

###  Deploy all service:
Use ```npm run deploy ``` to deploy the service


###  Deploy function:
Use ```npm run deploy-function <function_name> ``` to deploy single function


##Invoke remote function
To invoke remote function use:
* ```npm run invoke <function_name>```

To invoke with logging use ``-l`` flag (i.e. ```npm run invoke <function_name> -l```)

## Resources
Used plugins:

* [serverless-offline](https://github.com/dherault/serverless-offline)
* [serverless-dynamodb-local](https://github.com/99xt/serverless-dynamodb-local)
* [serverless-dynamodb-client](https://github.com/99xt/serverless-dynamodb-client)
