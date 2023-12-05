---
layout: default
permalink: /git
---

# Git Cheatsheet

<br>

### compare / diff / log

<hr>

Display diff between staging area and working directory :
```md
git diff --staged
```

Show commit logs with paths that moved :
```md
git log --stat -M
```

RIGHT OUTER JOIN **branch_A** ON **branch_B** :
```md
git log branch_B..branch_A
git diff branch_B...branch_A
```





<br>

### Interact with remote

<hr>


Add a git URL as a remote named *[alias]* :
```md
git remote add [alias] [URL]
```

Publish a local branch onto the remote, and set it as upstream :
```md
git push --set-upstream origin [branch]
```

Delete a remote branch :
```md
git push origin --delete [branch]
```

Print detailed info of the remote & its content (remotes branches for example) :
```md
git remote show origin
```





<br>

### Interact with upstream

<hr>

List all remotes & upstreams :
```md
git remote -v
```

Add an *upstream*, from a fork for example :
```md
git remote add upstream https://github.com/[user]/[project].git
```

Pull from *upstream* :
```md
git fetch upstream
git merge upstream/[branch]
```





<br>

### revert / reset / rm

<hr>

Unstage all files staged since last commit :
```md
git reset HEAD^
```
Rollback to commit \<ref\>, but keep everything modified as unstaged files :
```md
git reset <ref>
```

Unstage \<file\> :
```md
git reset HEAD <file>
```

Rollack the last **N** commits :
```md
# Hard : All changes will be lost
git reset --hard [HEAD~N]

# Soft : All changes are staged
git reset --soft [HEAD~N]

# Mixed : All changes are kept but not staged
git reset --mixed [HEAD~N]
```

Interactive rollback. Pick an action for each rollbacked commit 1-by-1 :
```md
git reset --keep
```

Overwrite the current branch with the version stored on the server (forced pull) :
```md
git fetch --all
git branch backup-master
git reset --hard origin/master
```

Reset the date (and author) after an interactive rebase :
```md
git commit --amend --reset-author
```

Dry-run of `rm` :
```md
rm -n
```




<br>

### Deep purge

<hr>

> In case you uploaded a password or API key

Install `git-filter-repo` :
```md
apt-get install git-filter-repo
```

Move the current project, and clone a fresh copy.
<br/>
If not a clean clone, add `--force` to the `git-filter-repo` command instead.
```md
mv -r ./<project> ./<project_backup>
git clone <remote_url> 
```

The critical part :
```md
git-filter-repo --path <file_to_remove> --invert-paths --force
```

Re-set the remote_url, and force-push the new repo :
```md
git remote add origin <remote_url>
git push --set-upstream origin main -f
```




<br>

### Stash

<hr>

Save current non-staged edits into the stash :
```md
git stash push (-m [message])
```

List stash entries :
```md
git stash show [<id>]
git stash list
```

Apply a stash entry to the working directory & staging area :
```md
# Entry will be removed from stash
git stash pop [<id>]
```
```md
# Entry will stay in stash
git stash apply [<id>]
```

Apply a stash entry on top of its parent commit, on a new branch :
```md
git stash branch <new_branch> [<id>]
```

Delete a stash entry :
```md
# single entry
git stash drop [<id>]
```
```md
# wipe all entries
git stash clear
```





<br>

### Tags

<hr>

Add a tag to the current commit :
```md
git tag <tag_name>
git tag -m "<description>" <tag_name>

# Push to remote
git push --tags
```

Tag an older commit / other branch :
```md
git tag <tag_name> <ref>
```

Delete a tag :
```md
git tag --delete <tag_name>
git push --delete origin <tag_name>
```

Overwrite (= move) an existing tag :
```md
git tag -f <tag_name> <ref>
```





<br>

### Misc

<hr>

Move `file` in the working directory and in the index
```md
git mv <file>
```

Quickly find which commit introduced a bug
```md
git bisect (command)
```

Find on which commit `file` was deleted
```md
git rev-list HEAD -n 1 -- <file>
```

Merge 2 repos together
```md
cd <A>
git remote add -f <B> <B_url>
git merge <B>/master

mkdir <B>

dir -exclude B | %{git mv $_.Name <B>}
# or
git mv <file> <B>
```
