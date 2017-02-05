class HomeController < ApplicationController
  def index
    if user_signed_in?
      redirect_to '/user'
    end
  end
end
