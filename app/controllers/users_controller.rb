class UsersController < ApplicationController
  before_action :authenticate_user!
  protect_from_forgery with: :exception
  def index
    @groups = Group.all
    redirect_to '/users/create' if @groups.empty?
  end
end
