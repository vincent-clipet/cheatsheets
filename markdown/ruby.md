---
layout: default
permalink: /ruby
---

# Ruby Cheatsheet





<br>

### **Install**

<hr>

**Install old version from repository & `rbenv`** :
```bash
sudo apt install ruby rbenv
```

**Update [`ruby-build`](https://github.com/rbenv/ruby-build) for `rbenv` :**
```bash
git clone https://github.com/rbenv/ruby-build.git "$(rbenv root)"/plugins/ruby-build
git -C "$(rbenv root)"/plugins/ruby-build pull
```

**Initialize `rbenv` and add the returned command to your `~/.bash_profile` :**
```bash
rbenv init
```

**The command to add to your `~/.bash_profile` :**
```bash
eval "$(rbenv init -)"
```

**Start a new console.**





<br>

### **rbenv**

<hr>

Update latest list of available versions if needed :
```bash
git -C "$(rbenv root)"/plugins/ruby-build pull
```

List all available versions :
```bash
rbenv install --list
```

Install a specific version (no YJIT) :
```bash
rbenv install [specific_version]
```

Install a specific version (with YJIT) :
```bash
apt install rustc
RUBY_CONFIGURE_OPTS="--enable-yjit" rbenv install [specific_version]
```

Set a specific version as the default for all consoles / everything / only the current directory :
```bash
rbenv shell [specific_version]
rbenv global [specific_version]
rbenv local [specific_version]
```