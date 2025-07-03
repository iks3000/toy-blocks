# Toy Blocks

## Backend API on Render.com

The backend (Node.js/Express server) is deployed on [Render.com](https://render.com/):

- **API URL:** https://toy-block-server.onrender.com
- Endpoints:
  - `/api/v1/status` — returns node status
  - `/api/v1/blocks` — returns mock blocks data

This API is used as Node 4 in the application and is available from anywhere (including Netlify, Vercel, or local frontend).

## Installation

1. `git clone repo`
2. `cd toy-blocks`
3. `nvm use`
4. `npm i`
5. `npm start`
6. `npm test`
7. `npm run build`

## Quick Start (Recommended)

### Fast start (recommended)

```bash
./start.sh
```

This script will automatically start all components of the application.

### Manual start

To fully test the application with a local server:

```bash
npm run dev
```

This will start both the React app and the local server on port 3002.

## CORS Issues

### Problem

The app tries to connect to external Heroku servers, which do not allow CORS requests from localhost:3000.

### Solutions

#### 1. Use the local test server

Start the local server for testing:

```bash
npm run server
```

#### 2. Use a CORS proxy

For development, you can use a CORS proxy:

- https://cors-anywhere.herokuapp.com/
- https://api.allorigins.win/

#### 3. Disable CORS in your browser (for development only)

Chrome:

```bash
chrome.exe --user-data-dir="C://Chrome dev session" --disable-web-security
```

Firefox:

- Open about:config
- Set security.fileuri.strict_origin_policy to false

## Application Structure

The current application displays a list of nodes. Each node represents a server. Each server implements the same API but returns different data. The important endpoints you need to know for each server are:

- `/api/v1/status` - check server status
- `/api/v1/blocks` - get block data

Each node has many blocks, and the blocks for each node are returned from the blocks endpoint.

## Nodes

The application connects to the following servers:

1. https://thawing-springs-53971.herokuapp.com (Node 1)
2. https://secret-lowlands-62331.herokuapp.com (Node 2)
3. https://calm-anchorage-82141.herokuapp.com (Node 3)
4. https://toy-block-server.onrender.com (Node 4 - backend on Render)

## Debugging

- Check the browser console for CORS errors
- Make sure the local server is running on port 3002 (if using local backend)
- Use the Network tab in DevTools to monitor requests

---
