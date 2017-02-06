class LoginController < ApplicationController
  skip_before_action :force_login

  def index
    unless auth_account
      render file: 'app/views/login/_google.html.erb'
    # elsif ! session['user_id']
    #   render file: 'app/views/login/_users.html.erb'
    else
      redirect_to till_path
    end
  end
end
