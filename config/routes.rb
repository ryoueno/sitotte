Rails.application.routes.draw do

  get '/user', to: 'users#index'

  get '/group/new', :as => :group_new
  get '/group/:id', to: 'group#show', :as => :group
  get '/group/:id/invite', to: 'group#invite'
  get '/group/:id/enter', to: 'group#enter'
  post '/group/create', to: 'group#create'
  post '/group/:id/create_guest', to: 'group#create_guest'

  devise_for :user
  root 'home#index'

  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
