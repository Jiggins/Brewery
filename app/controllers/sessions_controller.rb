class SessionsController < ApplicationController
  # skip_before_action :force_login

  def create
    account = Account.from_omniauth(env["omniauth.auth"])
    session[:auth_id] = account.id
    redirect_to till_path
  end

  def destroy
    session[:auth_id] = nil
    session[:user_id] = nil
    redirect_to root_path
  end
end
