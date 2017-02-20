class LoginController < ApplicationController
  skip_before_action :force_login

  def index
    render file: 'app/views/login/_google.html.erb'
  end

  def users
    if auth_account
      return render file: 'app/views/login/_users.html.erb'
    else
      redirect_to login_path 
    end
  end

  def switch_user
    session[:user_id] = User.find(params[:user_id]).id
    redirect_to till_path
  end
end
