class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception
  helper_method :auth_account
  before_filter :force_login

  def auth_account
    @auth_account ||= Account.find(session[:auth_id]) if session[:auth_id]
  end

  def current_user
    @current_user ||= User.find(session[:user_id]) if session[:user_id]
  end

  private

  def force_login
    if ! auth_account
      Rails.logger.info "Account not logged in, redirecting to #{login_url}"
      redirect_to login_url
    elsif ! current_user
      Rails.logger.info "User not logged in, redirecting to #{users_path} for account #{auth_account.name}, #{auth_account.uid}"
      redirect_to users_path
    end
  end
end
