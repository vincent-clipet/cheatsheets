---
layout: default
permalink: /git
---

# Git Cheatsheet

<br>

### compare / diff / log

<hr>

Display diff between staging area and working directory :
```bash
git diff --staged
```

Show commit logs with paths that moved :
```bash
git log --stat -M
```

RIGHT OUTER JOIN **branch_A** ON **branch_B** :
```bash
git log branch_B..branch_A
git diff branch_B...branch_A
```





<br>

### Interact with remote

<hr>


Add a git URL as a remote named *[alias]* :
```bash
git remote add [alias] [URL]
```

Publish a local branch onto the remote, and set it as upstream :
```bash
git push --set-upstream origin [branch]
```

Delete a remote branch :
```bash
git push origin --delete [branch]
```

Print detailed info of the remote & its content (remotes branches for example) :
```bash
git remote show origin
```





<br>

### Interact with upstream

<hr>

List all remotes & upstreams :
```bash
git remote -v
```

Add an *upstream*, from a fork for example :
```bash
git remote add upstream https://github.com/[user]/[project].git
```

Pull from *upstream* :
```bash
git fetch upstream
git merge upstream/[branch]
```





<br>

### revert / reset / rm

<hr>

Unstage all files staged since last commit :
```bash
git reset HEAD^
```
Rollback to commit \<ref\>, but keep everything modified as unstaged files :
```bash
git reset <ref>
```

Unstage \<file\> :
```bash
git reset HEAD <file>
```

Rollack the last **N** commits :
```bash
# Hard : All changes will be lost
git reset --hard [HEAD~N]

# Soft : All changes are staged
git reset --soft [HEAD~N]

# Mixed : All changes are kept but not staged
git reset --mixed [HEAD~N]
```

Interactive rollback. Pick an action for each rollbacked commit 1-by-1 :
```bash
git reset --keep
```

Overwrite the current branch with the version stored on the server (forced pull) :
```bash
git fetch --all
git branch backup-master
git reset --hard origin/master
```

Dry-run of `rm` :
```bash
rm -n
```




<br>

### Deep purge

<hr>

> In case you uploaded a password or API key

Install `git-filter-repo` :
```bash
apt-get install git-filter-repo
```

Move the current project, and clone a fresh copy.
<br/>
If not a clean clone, add `--force` to the `git-filter-repo` command instead.
```bash
mv -r ./<project> ./<project_backup>
git clone <remote_url> 
```

The critical part :
```bash
git-filter-repo --path <file_to_remove> --invert-paths --force
```

Re-set the remote_url, and force-push the new repo :
```bash
git remote add origin <remote_url>
git push --set-upstream origin main -f
```




<br>

### stash

<hr>

Save current non-staged edits into the stash :
```bash
git stash push (-m [message])
```

List stash entries :
```bash
git stash show [<id>]
git stash list
```

Apply a stash entry to the working directory & staging area :
```bash
# Entry will be removed from stash
git stash pop [<id>]
```
```bash
# Entry will stay in stash
git stash apply [<id>]
```

Apply a stash entry on top of its parent commit, on a new branch :
```bash
git stash branch <new_branch> [<id>]
```

Delete a stash entry :
```bash
# single entry
git stash drop [<id>]
```
```bash
# wipe all entries
git stash clear
```





<br>

### Misc

<hr>

Move `file` in the working directory and in the index
```bash
git mv <file>
```

Quickly find which commit introduced a bug
```bash
git bisect (command)
```

Find on which commit `file` was deleted
```bash
git rev-list HEAD -n 1 -- <file>
```

Merge 2 repos together
```bash
# In repo A

git remote add -f <B> <B_url>
git merge <B>/master

mkdir <B>

dir -exclude B | %{git mv $_.Name <B>}
# or
git mv <file> <B>
```
