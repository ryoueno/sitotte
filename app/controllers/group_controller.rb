class GroupController < ApplicationController
  before_action :authenticate_user!
  def show
    authenticate_group!
    @members = User.includes(:members).joins(:group).where(:members => {:group_id => params[:id]})
    @group = Group.find(params[:id])
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

private
  def authenticate_group!
    @members = User.includes(:members).joins(:group).where(:members => {:group_id => params[:id]})
    redirect_to "/user", alert: "グループの権限がありません" unless @members.exists?(id: current_user.id)
  end

end
