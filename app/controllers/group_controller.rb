class GroupController < ApplicationController
  before_action :authenticate_user!
  def show

  end

  def new
    @group = Group.new
  end

  def create
    @group  = Group.create(params.require(:group).permit(:name))
    @member = @group.members.create(:group_id => @group.id, :user_id => current_user.id, :is_admin => true)
    if @group and @member
      redirect_to "/group/#{@group.id}", notice: "グループを登録しました。"
    else
      redirect_to "/group/new", notice: "グループを作成できませんでした"
    end
  end

end
