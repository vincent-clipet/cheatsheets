---
layout: default
permalink: /unix
---

# UNIX Cheatsheet





<br>

### ls / find

<hr>

Find biggest files :
```md
find <folder> -type f -exec du -Sh {} + | sort -rh | head -n <number_of_results>
find . -type f -exec du -Sh {} + | sort -rh | head -n 20
```

Find biggest directories :
```md
# Top-level only
du -hs * | sort -rh | head -<number_of_results>
du -hs * | sort -rh | head -20

# Recursive, will have duplicate entries from subdirectories
du -a <search_root> | sort -n -r | head -n <number_of_results>
du -a . | sort -n -r | head -n 20
```





<br>

### sed / grep

<hr>

Find first line matching a pattern in a file :
```md
sed '/<pattern>/!d;=;Q' <file>>
```

Cut a slice of a file, between 2 given line numbers :
```md
sed -n '<first_line>,<last_line>p;<last_line_plus_1>q' <input_file> > <output_file>
```





<br>

### tar / zip

<hr>

tar :
```md
tar -cvf <archive.tar> <folder_to_archive>
tar -zcvf <archive.tar.gz> <folder_to_archive>
```

untar :
```md
tar -xvf <archive.tar> (-C <destination_folder>)
tar -zxvf <archive.tar.gz> (-C <destination_folder>)
```

List files inside archive :
```md
tar –tf <archive.tar>
tar –tzf <archive.tar.gz>
unzip -l <archive.zip>
```





<br>

### Rsync

<hr>

Copy from local to remote :
```md
rsync -avzh -e ssh <local_folder> <user>@<host>:<remote_folder_or_file>
```

Copy from remote to local : 
```md
rsync -avzh -e ssh <user>@<host>:<remote_folder_or_file> <local_folder>
```

<hr>

#### Useful options

Dry-run :
```
--dry-run
```

Include or exclude some files from the target folder :
```md
--include='*.txt'
--exclude='*.git'
```

Delete the target file if it already exist :
```md
--delete
```

Delete the source file after successful transfer :
```md
--remove-source-files
```

Delete all remote file in target folder that were not present in the source local folder :
```md
--delete-after
```

Limit bandwidth :
```md
--bwlimit=<size_in_kbps>
```





<br>

### Fresh install

<hr>

Setup root password :
```md
sudo passwd root
```

Create a new user and its `/home` directory :
```md
sudo useradd -m test
```

Add SSH keys :
```md
sudo mkdir /home/<user>/.ssh
sudo nano /home/<user>/.ssh/authorized_keys
```

Change the default shell to bash :
```md
sudo chsh -s /bin/bash <user>
```





<br>

### Misc

<hr>

List all crontabs for all users :
```bash
for user in $(cut -f1 -d: /etc/passwd); do crontab -u $user -l; done
```
