class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception
  helper_method :auth_account
  before_filter :force_login

  def auth_account
    @auth_account ||= Account.find(session[:auth_id]) if session[:auth_id]
  end

  private

  def force_login
    unless auth_account
      redirect_to login_url
    end
  end
end
