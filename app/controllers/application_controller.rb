class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception
  helper_method :auth_account

  def auth_account
    @auth_account ||= Account.find(session[:user_id]) if session[:user_id]
  end
end
