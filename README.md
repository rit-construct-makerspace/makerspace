# Installations:

-Clone project from github 

-Install postgres 
On Mac: brew install postgresql
*Make sure you only have one version of postgres on machine

-Install Docker Desktop: 
  * if in starting state: go into git bash run command 
  * 'C:\Program Files\Docker\Docker\DockerCli.exe' -SwitchDaemon

-Install pgAdmin(/postgres)

-Install node.js

-Install openssl
  On Mac: 
    - brew install openssl
  On Windows:
    - available with git bash
    - https://www.openssl.org



# Development Environment Setup:

Open the project in your favorite IDE.

Add a file called .env to the server folder containing the following…
POSTGRES_USER=makerspace
POSTGRES_PASSWORD=makerspace_secret
POSTGRES_DB=makerspace
POSTGRES_ENDPOINT=localhost:5432
CALLBACK_URL=https://localhost:3000/login/callback
ENTRY_POINT=https://samltest.id/idp/profile/SAML2/Redirect/SSO
ISSUER=<unique>
SESSION_SECRET=<secret>
REACT_APP_URL=https://localhost:3001
SAML_IDP=TEST
GRAPHQL_ENDPOINT=https://localhost:3000
Put .env database user and pass into pgadmin
For the ISSUER, replace <unique> with any unique string you’d like. Make it special.

Create a folder inside the /server directory called cert. In this folder, create a file called idp_cert.pem containing…

Test IdP certificate from: https://samltest.id/download/

Inside your IDEs terminal, enter:
>> cd server/cert
>> openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -nodes -days 900

Complete the instructions that are presented. This should create 2 new files (cert.pem and key.pem). Make sure these files are in the cert folder you created previously.

Inside terminal again, within the server directory, enter the following commands:
>> cd ../client
>> npm install
>> cd ../server
>> npm install
>> docker-compose build
>> docker-compose up -d db
>> npm run build
>> npm run knex:migrate:latest
>> npm run start:dev

In a web browser, navigate to https://localhost:3000/Shibboleth.sso/metadata (if running locally). Save the contents of this page into an xml file, and upload that file to https://samltest.id/upload.php.
When the upload is complete and successful, restart the server:
>> CTRL+C
>> npm run start:dev

Then, in another terminal window, navigate to the project’s client directory and start up the client.
>> npm start
