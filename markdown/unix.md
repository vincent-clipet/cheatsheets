---
layout: default
permalink: /unix
---

# UNIX Cheatsheet





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

