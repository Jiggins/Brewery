class SessionsController < ApplicationController
  skip_before_action :force_login

  def create
    account = Account.from_omniauth(env["omniauth.auth"])
    Rails.logger.info "Successful login for #{account.name}, id: #{account.id}, uid: #{account.uid}"
    session[:auth_id] = account.id
    redirect_to users_path
  end

  def destroy
    Rails.logger.info "Logging out #{account.name}, id: #{account.id}, uid: #{account.uid}"
    session[:auth_id] = nil
    session[:user_id] = nil
    redirect_to root_path
  end
end
