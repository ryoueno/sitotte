class GroupController < ApplicationController
  before_action :authenticate_user!
  def show
    authenticate_group!
    @members = User.includes(:members).joins(:group).where(:members => {:group_id => params[:id]})
    redirect_to "/group/#{params[:id]}/invite" if @members.length <= 1
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

  def invite
    authenticate_group!
    @group = Group.find(params[:id])
    @message = "#{@group.name}に招待されました！%0D%0A以下にアクセスして承認してください(*´∇｀*)%0D%0Ahttp://192.168.11.6/group/#{@group.id}/enter"
  end

  def enter
    @group = Group.find(params[:id])
  end

private
  def authenticate_group!
    @members = User.includes(:members).joins(:group).where(:members => {:group_id => params[:id]})
    redirect_to "/user", alert: "グループの権限がありません" unless @members.exists?(id: current_user.id)
  end

end
