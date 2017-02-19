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
end
