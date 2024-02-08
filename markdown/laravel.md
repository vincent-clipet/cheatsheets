---
layout: default
permalink: /laravel
---

# Laravel Cheatsheet

A bunch of useful commands & info about Laravel.





<br>

### Commands

<hr>

Refresh the `.env` file used by the application :
```bash
php artisan config:clear
```





<br>

### Migrations

<hr>

> [Official Documentation](https://laravel.com/docs/10.x/migrations)

Create a new migration file :
```bash
php artisan make:migration <your_migration_name>
```

Check which migrations have been run on current DB :
```bash
php artisan migrate:status
```

Preview the queries that will be executed when running the migration :
```bash
php artisan migrate --pretend
```

Run all migrations :
```bash
php artisan migrate
```

Rollback migrations :
```bash
# 1 migration
php artisan migrate:rollback
# X migrations
php artisan migrate:rollback --step=<X>
# All migrations
php artisan migrate:reset
```