class GroupController < ApplicationController
  def new
    @group = Group.new
  end

  def create
    @group = Group.new(params.require(:group).permit(:name, :admin_id))
    if @group.save
      redirect_to '/users', notice: "グループを登録しました。"
    else
      render 'new'
    end
  end

end
