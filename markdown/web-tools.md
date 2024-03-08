---
layout: default
permalink: /web-tools
---

# Web Tools Cheatsheet

A bunch of useful commands for various tools used for web development.





<br>

### nvm

<hr>

> nvm : https://github.com/nvm-sh/nvm

> nvm-windows : https://github.com/coreybutler/nvm-windows

<hr>

Install the latest NodeJS version :
```bash
nvm install node
```

Install a specific version :
```bash
# List available versions
nvm ls-remote
nvm install [version]
```

Temporarily change the used version :
```bash
nvm use [version]
nvm run node --version
```

Permanently change the used version :
```bash
# Set latest
nvm alias default node

# Set specific
nvm alias default 18.12
```

Install the most recent NPM version for the current Node version :
```bash
nvm install-latest-npm
```





<br>

### pm2

<hr>

> PM2 : https://pm2.keymetrics.io/docs/usage/quick-start/

<hr>

Install PM2 :
```bash
npm install pm2@latest -g
```

Add a new app to PM2 & run it :
```bash
pm2 start index.js
pm2 start index.js --name [name]
pm2 start index.js --watch # real-time reload
```

Run an app with a specific NodeJS version (through `nvm`) :
```bash
sudo pm2 start --name [name] index.js --interpreter=/home/[user]/.nvm/[version]/bin/node
```

Generate an auto-startup file, and save currently running apps to the config :
```bash
pm2 startup
pm2 save
```

Manage PM2 apps :
```bash
pm2 list
pm2 restart [name_or_id]
pm2 reload [name_or_id]
pm2 stop [name_or_id]
pm2 delete [name_or_id]
```

Show the starting command used for an app, and NodeJS info :
```bash
pm2 show [name_or_id]
```
```
│ script path       │ /path/to/app/index.js │
│ script args       │ N/A                   │
│ interpreter       │ node                  │
│ interpreter args  │ N/A                   │
│ node.js version   │ 10.23.0               │
│ node env          │ N/A                   │
```

Display logs from all apps :
```bash
pm2 logs
pm2 logs --lines 50
```

Display monitoring UI for all apps :
```bash
pm2 dash
```





<br>

### certbot

<hr>

Dry-run :
```bash
certbot renew --dry-run
```

Renew existing certifcates :
```bash
certbot renew
```

Add a certificate to a newly-created Apache2 vhost :
```bash
certbot --apache -d [vhost]
```