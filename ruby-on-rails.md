
# Ruby on Rails Cheatsheet

<br>

Table of content :

- [Project setup / run](#project-setup--run)
- [Scaffolding](#scaffolding)
- [Migrations](#migrations)
	- [Migration file syntax](#migration-file-syntax)





<br>

### **Project setup / run**

<hr>

Setup a new project
```md
rails new <project_name>
bundle install
```

Start server
```md
# start server
rails server

# start irb
rails console
```





<br>

### **Scaffolding**

<hr>

Full scaffolding
```md
# rails g scaffold User name:string
# rails g scaffold Comment author:references
rails g scaffold <Entity>s <field_name>:<type>
```

Model scaffolding (*includes migration*)
```md
# rails g model User name:string
rails g model <Entity> <field_name>:<type>
```

Controller scaffolding
```md
# rails g controller Users index show new create edit update delete
rails g controller <Entity>s <list_of_actions>
```

Show all routes
```md
rails routes
```





<br>

### **Migrations**

<hr>

Run migrations
```md
rails db:migrate
rails db:migrate RAILS_ENV=dev
rails db:migrate VERSION=<timestamp>
```

Run rollback
```md
rails db:rollback
rails db:rollback STEP=3
```

Reset DB / re-seed
```md
# Reset + seed
rails db:reset

# Just re-seed
rails db:seed
```


Create a new migration
```ruby
# Example formats
CreateProducts 			           name:string
AddDetailsToProducts               part_number:string price:decimal
AddPartNumberToProducts            part_number:string
AddUserRefToProducts               user:references
CreateJoinTableCustomerProduct     customer product
```

```md
# Add a new Entity with fields
rails g migration Create<Entity>s <field_name>:<type>

# Add a new field to an Entity
rails g migration <Migration_Name> <field_name>:<type>

# set the new field as an index
rails g migration <Migration_Name> <field_name>:<type>:index

# remove a field
rails g migration <Migration_Name> <field_name>:<type>

# create a 'join' table for a 'many-to-many' relationship
rails g migration CreateJoinTable<EntityA><EntityB> <entity_a> <entity_b>
```





<br>

### **Migration file syntax**
[Official documentation](https://guides.rubyonrails.org/active_record_migrations.html)

<hr>

Fields
```ruby
add_column :products, :description, :text, :limit => 1000
add_column :products, :price, precision: 8, scale: 2

add_reference :users, :role, index: false
add_reference :users, :role, foreign_key: true
add_foreign_key :articles, :authors
```


Create table
```ruby
create_table :products do |t|
  t.string :name, index: true
  t.decimal :price, precision: 8, scale: 2
  t.references :color, null: false, foreign_key: true
  t.timestamps
end

# Create 'join' table
create_join_table :products, :categories, column_options: { null: true } do |t|
  t.index :product_id
  t.index :category_id
end
```

Edit table
```ruby
add_column :products, :description, :text

change_table :products do |t|
  t.remove :description, :name
  t.string :part_number
  t.index :part_number
  t.rename :upccode, :upc_code
end

# Set special values
change_column_null :products, :name, false
change_column_default :products, :approved, from: true, to: false
```

Hand-made SQL
```ruby
Product.connection.execute("UPDATE products SET price = 'free' WHERE 1=1")
```

<br>