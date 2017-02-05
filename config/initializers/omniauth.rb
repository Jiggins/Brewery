OmniAuth.config.logger = Rails.logger

Rails.application.config.middleware.use OmniAuth::Builder do
  provider :google_oauth2, ENV['BREWERY_CLIENT_ID'], ENV['BREWERY_SECRET_ID'], {}
end
