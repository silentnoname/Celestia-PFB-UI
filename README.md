This is a UI for submitting [Celestia PayForBlob transactions](https://docs.celestia.org/developers/node-tutorial/#submit-a-pfb-transaction)

## Prerequisites

You must have installed nodejs and npm. If you don't have them, you can install them from [here](https://nodejs.org/en/download/)

### install the dependencies
```bash
npm install
```

### set the environment variables
```bash
cp .env.example .env
```

and then edit the .env file to set the following variables:
* `NEXT_PUBLIC_PROXY_PORT`: the port of the proxy server, default is 3090
* `NEXT_PUBLIC_PROXY_URL`: the url of the proxy server, not including port, default is http://localhost Can be http://ip or http://domain
* `NODE_SERVER`: the url of the celestia light node(need open gateway), default is http://localhost:26659


## Run in development mode

### run the proxy server, the default port is 3090.

```bash
npm run proxy
```

### run the UI, the default port is 3000.

```bash
npm run dev
```

Go to http://127.0.0.1:3000/ and submit your PayForBlob transaction.

## Run in production 
### build
```bash
npm run build
```
### Run the proxy server, the default port is 3090.

```bash
npm run proxy
```
### start
```bash
npm run start
```

## Website
http://celestia-pfb.silentvalidator.com/

![](https://i.imgur.com/bfRjlQK.jpg)