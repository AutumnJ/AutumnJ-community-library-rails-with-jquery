Rails.application.routes.draw do

  devise_for :users, controllers: { omniauth_callbacks: 'users/omniauth_callbacks', registrations: 'users/registrations' }

  # sets the index action for the books controller as the root path for a signed in user 
  # sets up the log in page as root path for an unauthenticated user

  authenticated :user do
    root 'books#index', as: 'authenticated_root'
  end

  devise_scope :user do
    root 'devise/sessions#new'
  end

  #view borrowable books/borrow book 
  get '/books/:id/borrow', to: 'books#show_available_to_borrow', as:'view_borrowable_book'
  post '/books/:id/borrow', to: 'books#borrow_book', as:'borrow_book'

  #view borrowed books/return book 
  get '/books/:id/borrowed', to: 'books#show_borrowed', as:'borrowed_book'
  post '/books/:id/return', to: 'books#return_book', as: 'return_book'

  #nested this way for clarity, as new comments are instantiated from borrowed books only
  #comment belongs_to book and borrowed is "nested" under books/:id
  #so comment CRUD routes live with books#show -- books/:book_id/comments/:id
  resources :books, only: [:show_borrowed] do
    resources :comments, only: [:new, :create, :edit, :update, :destroy, :index, :show]
  end

  #powers comment index, which allows editing and deletion by linking to nested routes above
  resources :comments, only: [:index, :new]
 
  resources :books, only: [:index, :show, :new, :create, :edit, :update, :destroy]
  resources :genres, only: [:show]
  resources :authors, only: [:show]

end
