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
SHOW INDEXES FROM @table;
```

Drop index :
```sql
DROP INDEX @index_name ON @table;
```





<br>

### Foreign Keys

<hr>

List FK on a table :
```sql
SELECT * FROM information_schema.TABLE_CONSTRAINTS 
WHERE information_schema.TABLE_CONSTRAINTS.CONSTRAINT_TYPE = 'FOREIGN KEY' 
AND information_schema.TABLE_CONSTRAINTS.TABLE_SCHEMA = @db
AND information_schema.TABLE_CONSTRAINTS.TABLE_NAME = @name;
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
KILL @process_id;
```