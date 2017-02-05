class SessionsController < ApplicationController
  def create
    user = Account.from_omniauth(env["omniauth.auth"])
    session[:auth_id] = user.id
    redirect_to root_path
  end

  def destroy
    session[:auth_id] = nil
    redirect_to root_path
  end
end
