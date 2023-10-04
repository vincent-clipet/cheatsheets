---
layout: default
permalink: /ruby-on-rails
---

# Ruby on Rails Cheatsheet

<br>

### **Project setup / run**

<hr>

**Setup a new project :**
```md
rails new <project_name>
bundle install
```

**Start server :**
```md
# start server
rails server

# start irb
rails console
```





<br>

### **Scaffolding**

<hr>

**Full scaffolding :**
```md
rails g scaffold <Entity>s <field_name>:<type>
```

**Model scaffolding** (*includes migration*) **:**
```md
rails g model <Entity> <field_name>:<type>
```

**Controller scaffolding :**
```md
rails g controller <Entity>s <list_of_actions>
# index show new create edit update delete
```

**Show all routes :**
```md
rails routes
```





<br>

### **Migrations**

<hr>

> Official documentation : [https://guides.rubyonrails.org/active_record_migrations.html](https://guides.rubyonrails.org/active_record_migrations.html)

**Run migrations :**
```bash
rails db:migrate # RAILS_ENV=dev VERSION=<timestamp>
```

**Run rollback :**
```bash
rails db:rollback # STEP=3
```

**Reset DB / re-seed :**
```md
# Reset + seed
rails db:reset

# Just re-seed
rails db:seed
```

**Create a new migration :**
```ruby
# Example formats
CreateProducts                     name:string
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
rails g migration <Migration_Name> <field_name>:<type>:index

# remove a field
rails g migration Remove<Field_name>From<Entity> <field_name>:<type>

# create a 'join' table for a 'many-to-many' relationship
rails g migration CreateJoinTable<EntityA><EntityB> <entity_a> <entity_b>
```





<br>

### **Migration file syntax**

<hr>

**Field types :**
```ruby
add_column :products, :description, :text, :limit => 1000
add_column :products, :price, precision: 8, scale: 2

add_reference :users, :role, index: false
add_reference :users, :role, foreign_key: true
add_foreign_key :articles, :authors
```

**Create table :**
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

**Edit table :**
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

**Hand-made SQL :**
```ruby
Product.connection.execute("UPDATE products SET price = 'free' WHERE 1=1")
```





<br>

### **Routing**

<hr>

> Official documentation : [https://guides.rubyonrails.org/routing.html](https://guides.rubyonrails.org/routing.html)

**Explicit route :**
```ruby
get 'profile', to: 'users#show'
get 'products/:id', to: 'products#show'
get 'exit', to: 'sessions#destroy', as: :logout
get '/stories', to: redirect('/articles')
```

**Automatically generate routes for an Entity :**
```ruby
resources :products
resources :products, only: [:index, :show]
resources :products, except: [:delete]

# generate everything except 'index'
resource :geocoder
```

**Routes generated for resources :**
```
index
show
new   ->  create
edit  ->  update
destroy
```

**Nested entities :**
```ruby
resources :products do
  resources :reviews
end
```

**Group routes into a namespace for clarity :**
```ruby
namespace :admin do
  resources :articles
end
```





<br>

### **Models**

<hr>

**Relationships :**
> Official documentation : [https://guides.rubyonrails.org/association_basics.html](https://guides.rubyonrails.org/association_basics.html)

```ruby
has_many :books
has_one :author
belongs_to :author

# Enfore constraint in DB
belong_to :author, foreign_key: true

# ON DELETE CASCADE
has_many :books, dependent: :destroy
```

<details markdown="1">
  <summary>
  <b>Relationship - Many to Many</b>
  </summary>

```ruby
class Physician < ApplicationRecord
  has_many :appointments
  has_many :patients, through: :appointments
end

class Appointment < ApplicationRecord
  belongs_to :physician
  belongs_to :patient
end

class Patient < ApplicationRecord
  has_many :appointments
  has_many :physicians, through: :appointments
end
```
</details>

<hr>

**Validations :**
> Official documentation : [https://guides.rubyonrails.org/active_record_validations.html](https://guides.rubyonrails.org/active_record_validations.html)

```ruby
validates :first_name, presence: true
validates :email, format: { with: /\A[^@\s]+@[^@\s]+\z/, message: 'Invalid email'}
validates :price, numericality: { greater_than_equal_to: 0.01 }
validates :title, uniqueness: true
validates :title, length: { minimum: 3, maximum: 100 }

# Also validate related entities when creating/updating both
validates_associated :books
```

**Check validity in controller :**
```ruby
Person.create(name: "John Doe").valid?

# list of validation errors
p.errors
p.errors.objects.first.full_message
```

**Hooks / Callbacks :**
> API Documentation : [https://api.rubyonrails.org/classes/ActiveRecord/Callbacks.html](https://api.rubyonrails.org/classes/ActiveRecord/Callbacks.html)

```ruby
before_destroy :ensure_not_reference_by_any_invoices 
before_save :downcase_email 
```





<br>

### **Controllers**

<hr>

> Official documentation : [https://guides.rubyonrails.org/action_controller_overview.html](https://guides.rubyonrails.org/action_controller_overview.html)

<details markdown="1">
  <summary><b>Full controller example</b></summary>

```ruby
def index
  if session[:q].present?
    params[:page] = 1
    @posts = Post.where "title like ?", "%" + session[:q] + "%"
  else
    @posts = Post.all
  end
  @posts = @posts.order("created_at DESC")
  session[:q] = nil
end

def show
end

def new
  @post = Post.new
end

def edit
end

def create
  @post = Post.new(post_params)
    if @post.save
      redirect_to @post, notice: 'Created successfully !'
    else
      render :new 
    end
end

def update
  if @post.update(post_params)
      redirect_to @post, notice: 'Updated successfully !'
    else
      render :edit 
    end
end

def destroy
  @post.destroy
  redirect_to posts_url, notice: 'Deleted successfully !' 
end
```

```ruby
private
  # Util methods
  def set_post
    @post = Post.find(params[:id])
  end

  # Filter request params
  def post_params
    params.require(:post).permit(:title, :body, :image_url)
  end
end
```
</details>

<br>