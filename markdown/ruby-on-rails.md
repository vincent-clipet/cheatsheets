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
rails server
```

**Start IRB :**
```md
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
```
```md
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
rails db:drop
rails db:reset
rails db:seed
```
<hr>

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

<hr>

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

**Routes generated for resources :**
```
index
show
new   ->  create
edit  ->  update
destroy
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
validates :title, uniqueness: true
validates_uniqueness_of :title

validates :email, format: { with: /\A[^@\s]+@[^@\s]+\z/, message: 'Invalid email'}
validates :title, length: { minimum: 3, maximum: 100 }
validates :status, allow_blank: true
validates_numericality_of :rating, { only_integer: true, allow_nil: true }
validates_numericality_of :rating, { only_integer: true, greater_than_equal_to: 0, lesser_than_or_equal_to: 10 }
validates_inclusion_of :rating, :in => 0..10

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

<hr>

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

<hr>

> Documentation : [Calculations](https://guides.rubyonrails.org/active_record_querying.html#calculations) \| [Grouping](https://guides.rubyonrails.org/active_record_querying.html#grouping)

```ruby
Article.group(:product_id).sum(:quantity)
Article.select("created_at, sum(total) as total_price")
  .group("created_at").having("sum(total) > ?", 200)
```

<hr>

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

<hr>

> Documentation : [Find or create](https://guides.rubyonrails.org/active_record_querying.html#find-or-build-a-new-object)

```ruby
Customer.find_or_create_by(first_name: 'Andy')
nina = Customer.find_or_initialize_by(first_name: 'Nina')
```

<hr>

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

<hr>

> Documentation : [Enums](https://guides.rubyonrails.org/active_record_querying.html#enums)

```ruby
create_table :orders do |t|
  t.integer :status, default: 0
end
```

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





<br>

### **Views**

> Document : [Layouts and Rendering](https://guides.rubyonrails.org/layouts_and_rendering.html)

**The usual ones :**
```erb
<%= @user.name %>
<% if @user.name == 'Mike' %>

<%# link_to %>
<%= link_to 'Show', @product %>
<%= link_to 'About', about_path, class: 'nav-link' %>
<%= link_to 'Item record', item_path(@item) %>
<%= link_to category_path do %>
  <%= @product.category.name %>
<% end %>

<%# Delete link %>
<%= link_to 'Destroy', product, method: :delete, data: { confirm: 'Are you sure?' } %>
<%# Post link %>
<%= button_to 'Add to Cart', line_items_path(product_id: product) %>
<%# Button form %>
<%= button_to 'Logout', logout_path, method: :delete %>

<%# Image %>
<%= image_tag "rails.png" %>
```

**Render a collection :**
```erb
<% @users.each do |user| %>
  <%= user.name %>
<% end %>

<%# Will be rendered by _user.html.erb %>
<%= render @users %> 
```

**Utils :**
```erb
<%# Format currency %>
<%= number_to_currency(product.price) %>

<%# Safe Html through sanitization %>
<%= sanitize(product.description) %>

<%# Check current url %>
<%= request.path.include?('post') ? 'active' : '' %>">
<%= current_page?('about') ? 'active' : '' %>">
```

**Partial views :**
```erb
<%= render partial: 'shared/navbar' %>
<%# Pass variable @post as "post" to partial view %>
<%= render partial: "post_with_comments", object: @post, as: :post %>

<%= render 'form', product: @product %>
```

**Error messages :**
```erb
<% if @post.errors.any? %> 
<% if form.object.errors.any? %>

<% if @post.errors.empty? %>
  <% @post.errors.full_messages.each do |message| %>
    <p class='error'><%= message %></p>
  <%= user.errors.count %>
<%= post.errors[:description] %>

<%# Flash messages %>
<% flash.each do |msg_type, msg| %>
  <div class="alert alert-<%= msg_type %>">
    <%= msg %>
  </div>
<% end %>
```





<br>

### **Views - Forms**

> Documentation : [Form helpers](https://guides.rubyonrails.org/form_helpers.html)

**Model form :**
```erb
<%= form_with(model: product) do |form| %>
  <%= form.label :title %>
  <%= form.text_field :title, class: 'form-control' %>
  <%= form.submit %>
<% end %>
```

**Other form :**
```erb
<%# Add 'local: false' for external API calls %>
<%= form_with url: "/search", method: :get do |form| %>
  <%= form.label :query, "Search for:" %>
  <%= form.text_field :query, placeholder: 'search' %>
  <%= form.submit "Search", class: 'btn btn-primary' %>
<% end %>
```

<hr>

**Textarea :**
```erb
<%# Textarea %>
<%= form.text_area :description, rows: 10, cols: 60 %>
```

**Select / Options :**
```erb
<%= form.select :type, Customer.types.keys, prompt: 'Select a type' %>
<%= form.select :rating, (1..5) %>

<%= form.select :city, [["Berlin", "BE"], ["Chicago", "CHI"]], selected: "CHI" %>
<%= form.select :city,
      {
        "Europe" => [ ["Berlin", "BE"], ["Madrid", "MD"] ],
        "North America" => [ ["Chicago", "CHI"] ],
      },
      selected: "CHI" %>

# Date select
<%= form_with model: @person do |form| %>
  <%= form.date_select :birth_date %>
<% end %>

<%# Select (field, collection, key, value, label) %>
<%= form.collection_select :category_id,
                           Category.all,
                           :id,
                           :name,
                           {include_blank: '- Select a Category -'}, {class: 'form-select'}
```

**Checkbox & Radio :**
```erb
<%= form.check_box :pet_dog %>
<%= form.label :pet_dog, "I own a dog" %>

<%= form.radio_button :age, "adult" %>
<%= form.label :age_adult, "I am over 21" %>
```

> Documentation : [Other helpers](https://guides.rubyonrails.org/form_helpers.html#other-helpers-of-interest)

<hr>

**Misc :**
```erb
<%# if form in new or edit mode change submit text %> 
<%= form.submit @product.new_record? ? 'Create' : 'Update' %>
```





<br>

### **Flash, Session and Cookie**

**Flash :**
```rb
# Create flash (reset every new request)
flash[:success] = 'User created with success!'

# Create flash.now (reset every new view render)
flash.now[:error] = 'Please select a user!'
```

**Session :**
```rb
# Create session (reset every browser close)
session[:user_id] = user.id

# Check if session exist
session[:user_id].nil?

# Remove / wipe
session.delete(:user_id)
reset_session      
```

**Cookie :**
```rb
# Create cookie
cookies.permanent[:remember_token] = remember_token

# Encrypted cookie
cookies.permanent.encrypted[:user_id] = user.id

# Delete cookie
cookies.delete(:user_id)
```





<br>
<hr>

Some parts of this cheatsheet come from [My beloved Ruby on Rails cheat sheet](https://dev.to/ericchapman/my-beloved-ruby-on-rails-cheat-sheet-50pi) made by [Eric The Coder](https://github.com/rickavmaniac).