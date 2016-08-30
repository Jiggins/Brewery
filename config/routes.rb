Rails.application.routes.draw do
  root 'home#index'

  resources :products
  resources :hot_drinks_sit_in,    controller: 'products', type: 'HotDrinkSitIn'
  resources :hot_drinks_take_out,  controller: 'products', type: 'HotDrinkTakeOut'
  resources :cold_drinks,          controller: 'products', type: 'ColdDrink'
  resources :food,                 controller: 'products', type: 'Food'

  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
