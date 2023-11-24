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
```md
nvm install node
```

Install a specific version :
```md
# List available versions
nvm ls-remote
nvm install <version>
```

Temporarily change the used version :
```md
nvm use <version>
nvm run node --version
```

Permanently change the used version :
```md
# Set latest
nvm alias default node

# Set specific
nvm alias default 18.12
```



