Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  namespace :api do
    namespace :v1 do
      resources :workplaces, only: %i[create update destroy]
      get "health", to: "health#show"
      post "auth/guest", to: "auth#guest"
      get "auth/me", to: "auth#me"
      delete "auth/logout", to: "auth#logout"
    end
  end

  # Defines the root path route ("/")
  # root "posts#index"
end
