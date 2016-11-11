Rails.application.routes.draw do
  get 'group/new'

  get '/users', to: 'users#index'

  get 'users/create', to: 'group#new'
  post 'group/create', to: 'group#create'

  devise_for :users
  root 'home#index'

  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
