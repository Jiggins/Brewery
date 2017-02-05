Rails.application.routes.draw do
  root 'till#index'

  get 'auth/:provider/callback', to: 'sessions#create'
  get 'auth/failure', to: redirect('/')
  get 'signout', to: 'sessions#destroy', as: 'signout'

  resources :sessions, only: [:create, :delete]

  resources :products
  resources :sales, only: [:index, :destroy, :show, :edit, :create, :update] do
    post 'export', on: :collection
  end

  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
