# Build a Voting App

A Free Code Camp Dynamic Web Application Project. A Full Stack Javascript App using Node, Express, Passport, MongoDB, React/Redux and Bootstrap.

This is the API server side of the Fullstack App. The client side can be found at https://github.com/minhkashyu/voting-app-frontend.

You can run the App at https://mks-voting-app.herokuapp.com/.

NOTE: This app on heroku has a web dyno, and if the web dyno receives no traffic in a 30 minute period, the web dyno will sleep. If you access the app when the web dyno is sleeping, you will experience a short delay. After that, the web dyno will become active and the app will run normally. Also the api of the app has another web dyno, and as a result, the first data loading will have a delay as well.

## User Stories

* As an authenticated user, I can keep my polls and come back later to access them.

* As an authenticated user, I can share my polls with my friends.

* As an authenticated user, I can see the aggregate results of my polls.

* As an authenticated user, I can delete polls that I decide I don't want anymore.

* As an authenticated user, I can create a poll with any number of possible items.

* As an unauthenticated or authenticated user, I can see and vote on everyone's polls.

* As an unauthenticated or authenticated user, I can see the results of polls in chart form. (This could be implemented using Chart.js or Google Charts.)

* As an authenticated user, if I don't like the options on a poll, I can create a new option.