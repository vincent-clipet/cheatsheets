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

# generate all actions ( index show new create edit update delete )
rails g scaffold_controller <Entity>s
```

**Show all routes :**
```md
rails routes
```





<br>

### **Migrations**

<hr>

> Documentation : [Active Record Migrations](https://guides.rubyonrails.org/active_record_migrations.html)

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
```

**Create 'join' table :**
```ruby
create_join_table :products, :categories, column_options: { null: true } do |t|
  t.index :product_id
  t.index :category_id
end
```

**Add a reference with a custom name :**
```ruby
t.references :author, foreign_key: { to_table: :users }
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

> Documentation : [Routing](https://guides.rubyonrails.org/routing.html)

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
> Documentation : [Association basics](https://guides.rubyonrails.org/association_basics.html)

```ruby
has_many :books
has_one :author
belongs_to :author
has_and_belongs_to_many :parts

# Enfore constraint in DB
belongs_to :author, foreign_key: true

# Add a relationship with a custom name
belongs_to :author, class_name: "User", foreign_key: "author_id"

# ON DELETE CASCADE
has_many :books, dependent: :destroy
```

<details markdown="1">
  <summary>
  <b>Many to Many - Specific table</b>
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
> Documentation : [Active Record Validations](https://guides.rubyonrails.org/active_record_validations.html)

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
> Documentation : [Callbacks](https://api.rubyonrails.org/classes/ActiveRecord/Callbacks.html)

```ruby
before_destroy :ensure_not_reference_by_any_invoices 
before_save :downcase_email 

before_action :set_post, only: [ :show, :edit, :update, :destroy ]
private
  def set_post
  ...
```





<br>

### **Controllers**

<hr>

> Documentation : [Action Controller](https://guides.rubyonrails.org/action_controller_overview.html)

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





<br>

### **Active Record**

<hr>

> Documentation : [Active Record](https://guides.rubyonrails.org/active_record_querying.html)

```ruby
Article.find(params[:id])                # will error if not found
Article.find_by(product_id: product_id)  # will not error if no results
Article.find_by_name("Blaster 3000")
Article.find_by_name_and_parts_count("Blaster 3000", 3)
```
```ruby
Article.where('quantity > 1')
Article.where(cat_id: cat_id)
Article.where(model: model).or(Article.where(cat_id: cat_id))
Article.where("title LIKE ?", "%" + params[:q] + "%")
Article.join(:categories).where(categories: { id: 2 } )
Article.offset(5).limit(10).all
Article.select(:id).map(&:id)
```
```ruby
Article.count
Article.all
Article.delete_all
Article.ids
Article.exists?(1)
```

> Documentation : [Calculations](https://guides.rubyonrails.org/active_record_querying.html#calculations) \| [Grouping](https://guides.rubyonrails.org/active_record_querying.html#grouping)

```ruby
Article.group(:product_id).sum(:quantity)
Article.select("created_at, sum(total) as total_price")
  .group("created_at").having("sum(total) > ?", 200)
```

> Documentation : [Joining](https://guides.rubyonrails.org/active_record_querying.html#joining-tables) \| [n+1 Eager Loading](https://guides.rubyonrails.org/active_record_querying.html#eager-loading-associations)

```ruby
# Join
User.joins(:posts).select('distinct users.*')
User.joins(:posts).select(“users.id, posts.published as published”).where(id: 1)

# Preload (can't use WHERE here)
User.preload(:posts) # 

# Includes
User.includes(:posts).where(posts: { published: true })
Post.includes({ comments: [:author] }, :author).find(params[:id])

# Eager load
User.eager_load(:posts).where("posts.published = ?", true)
```
> Documentation : [Find or create](https://guides.rubyonrails.org/active_record_querying.html#find-or-build-a-new-object)

```ruby
Customer.find_or_create_by(first_name: 'Andy')
nina = Customer.find_or_initialize_by(first_name: 'Nina')
```

> Documentation : [Scopes](https://guides.rubyonrails.org/active_record_querying.html#scopes)

```ruby
class Book < ApplicationRecord
  scope :out_of_print, -> { where(out_of_print: true) }
  scope :out_of_print_and_expensive, -> { out_of_print.where("price > 500") }

  scope :costs_more_than, ->(amount) { where("price > ?", amount) }

  scope :created_before, ->(time) { where(created_at: ...time) if time.present? }

  # Apply to all queries in this model
  default_scope { where(out_of_print: false) }
end

class BookController < ApplicationController
  Book.out_of_print
  author.books.out_of_print

  Book.costs_more_than(100.10)
end
```

> Documentation : [Enums](https://guides.rubyonrails.org/active_record_querying.html#enums)

```ruby
class Order < ApplicationRecord
  enum :status, [:shipped, :being_packaged, :complete, :cancelled]
end

class OrderController < ApplicationController
  all_shipped_orders = Order.shipped
  order = Order.shipped.first
  order.shipped?
end
```