class UsersController < ApplicationController
  before_action :authenticate_user!
  protect_from_forgery with: :exception
  def index
  end
end
