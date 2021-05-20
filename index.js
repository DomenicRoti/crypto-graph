const express = require('express');
var cors = require('cors')
const morgan = require("morgan");
const rp = require('request-promise');

var corsOptions = {
  origin: 'http://localhost:8080'
}
// const { createProxyMiddleware } = require('http-proxy-middleware');

// Creating a proxy server to hit the coin marketplace api
// based off of: https://www.twilio.com/blog/node-js-proxy-server

// CoinMarketCap API Documentation: https://coinmarketcap.com/api/documentation/v1/#section/Quick-Start-Guide

// Create Express Server
const app = express();

// Configuration
const PORT = 3000;
const HOST = "localhost";
const API_SERVICE_URL = "https://pro-api.coinmarketcap.com/v1/cryptocurrency";
const API_KEY = "dc94fbfa-3153-41f2-8026-ab4aaf62abae";

// Logging
app.use(morgan('dev'));

// Proxy endpoints
// app.use('/json_placeholder', createProxyMiddleware({
//   target: API_SERVICE_URL,
//   changeOrigin: true,
//   pathRewrite: {
//       [`^/json_placeholder`]: '',
//   },
// }));

app.use('/listings/:symbol?', cors(corsOptions), (req, res) => {
  const symbol = req.params.symbol;
  const requestOptions = {
    method: 'GET',
    uri: `${API_SERVICE_URL}/listings/latest`,
    qs: {
      'start': '1',
      'limit': '50',
      'convert': 'USD',
      symbol
    },
    headers: {
      'X-CMC_PRO_API_KEY': API_KEY
    },
    json: true,
    gzip: true
  };

  rp(requestOptions).then(response => {
    res.send(response.body.status);
  }).catch((err) => {
    res.send(err);
  });
})

// https://pro-api.coinmarketcap.com/v1/cryptocurrency/ohlcv/historical
app.use('/ohlcv/:symbol?', cors(corsOptions), (req, res) => {
  const symbol = req.params.symbol;
  const date = new Date()
  const startDate = new Date(date.setDate(date.getDate()-30))
  const requestOptions = {
    method: 'GET',
    uri: `${API_SERVICE_URL}/ohlcv/historical`,
    qs: {
      time_start: startDate,
      symbol
    },
    headers: {
      'X-CMC_PRO_API_KEY': API_KEY
    },
    json: true,
    gzip: true
  };

  rp(requestOptions).then(response => {
    res.send(response);
  }).catch((err) => {
    res.send(err);
  });
})

// Start the Proxy
app.listen(PORT, HOST, () => {
  console.log(`Starting Proxy at ${HOST}:${PORT}`);
});