# Soundiiz API Extensions

## Overview
Soundiiz API Extensions is a collection of additional functionalities and scripts designed to enhance and extend the capabilities of the Soundiiz API.


Soundiiz is a comprehensive online tool that enables users to transfer playlists and favorite tracks between various music streaming platforms.
Check them out at [soundiiz.com](https://soundiiz.com/).

## Features
- **Run a Batch Transfer by Playlist IDs**: Transfer multiple playlists between services using a list of playlist IDs. This is useful, because sometimes the batch transfer wizard on the Soundiiz front end takes a long time to load Artists and Songs, when in reality you probably just want to transfer playlists from platform to platform.
- **Run a Collection of Syncs**: Runs multiple playlist syncs. This is useful because Soundiiz only allows you to have 2 syncs running at a time, but you may want to run more than 2 syncs at once. This feature will run until all your syncs have been kicked off, waiting for 1 minute between each request when 2 syncs are already running. 

## Usage
### Prerequisites:
- Ensure you have a Soundiiz account with at least 2 streaming service platforms linked to it.
### Node Implementation:
- Install Node.js version >=21.5.0: https://nodejs.org/en/download/
- Install the dependencies: `npm install`
- Run the script: `node main.js`
### Kotlin Implementation (Coming Soon):
- Install Java JDK version >=11: https://www.oracle.com/java/technologies/downloads/#java11
- Install Kotlin version >=1.5.31: https://kotlinlang.org/docs/jvm-get-started.html
- Install gradle version >=7.2: https://gradle.org/install/
- Install the dependencies: `gradle build`
- Run the script: `kotlin -cp .:./lib/* MainKt`

### Configuration:
Configuration is stored in `config.json` in the root of the project. This file is ignored in `.gitignore`, but you can find an example of this file at `config-example.json` The following fields are required:
- `soundiizAccessToken`: Your Soundiiz access token
- `soundiizCookie`: Your Soundiiz cookie


### Finding your Access Token and Cookie:
- Unfortunately some endpoints in the Soundiiz API require a cookie and some require an access token. In the future I may implement fetching/refreshing the access token automatically, but the cookie will always need to be pasted in manually.
#### Access Token:
- Open devtools in Google Chrome (F12)
- Navigate to the Network tab and filter by Fetch/XHR
- Navigate to the Soundiiz website and login
- Find the request to `https://soundiiz.com/api/v1/me` and copy the `access_token` from the Response (alternatively you can copy the value after `Bearer` in the `Authorization` request header)
#### Cookie:
- Open devtools in Google Chrome (F12)
- Navigate to the Network tab and filter by Fetch/XHR
- Navigate to the Soundiiz website and login
- Find the request to `https://soundiiz.com/api/v1/me` and copy the `Cookie` from the Request Headers