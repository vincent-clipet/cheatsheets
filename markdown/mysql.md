---
layout: default
permalink: /mysql
---

# MySQL Cheatsheet






<br>

### Indexes

<hr>

List indexes :
```sql
SHOW INDEXES FROM <table>;
```

Drop index :
```sql
DROP INDEX <index_name> ON <table>;
```





<br>

### Performance / Investigation

<hr>

List currently running processes : 
```sql
SHOW PROCESSLIST;
```

List currently running processes and their corresponding queries :
```sql
SHOW FULL PROCESSLIST;
```

Kill a running process :
```sql
KILL <process_id>;
```