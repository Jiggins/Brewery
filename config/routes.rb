Rails.application.routes.draw do
  root 'home#index'

  resources :products
  resources :sales, only: [:index, :destroy, :show, :edit, :create, :update] do
    post 'export', on: :collection
  end

  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
