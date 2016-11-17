class UsersController < ApplicationController
  before_action :authenticate_user!
  protect_from_forgery with: :exception
  def index
    @groups = current_user.groups.all
    redirect_to '/group/new' if @groups.empty?
  end
end
