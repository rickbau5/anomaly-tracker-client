# Anomaly Tracker Client
A client for interacting with [anomaly-tracker-server](https://github.com/rickbau5/anomaly-tracker-server).

![Anomaly Tracker](images/first.png?raw=true "Anomaly Tracker")

## Installation
This is an Electron app, as such `npm` is used:

```
$ git clone https://github.com/rickbau5/anomaly-tracker-client
$ cd anomaly-tracker-client
$ npm install
$ npm start
```

## Running
This currently requires a local instance of the server running and only operates
on the first user's API key. This will of course change in the future.

To get a local instance of the server running, follow the instructions in the [anomaly-tracker-server repo](https://github.com/rickbau5/anomaly-tracker-server#setting-up-the-project).

Once this is done, ensure that the reference to the server endpoint is correct within [tracker.js](source/tracker.js).