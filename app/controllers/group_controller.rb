class GroupController < ApplicationController
  before_action :authenticate_user!
  def show
    return unless authenticate_group!
    @members = @members = Group.find(params[:id]).users.select('*')
    redirect_to "/group/#{params[:id]}/invite" if @members.length <= 1
    @group = Group.find(params[:id])
    render :layout => 'app_2column'
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
    @members = @group.users
    redirect_to "/group/#{@group.id}" if @members.exists?(id: current_user.id)
  end

  def create_guest
    @group = Group.find(params[:id])
    @members = @group.users.select('*')
    if @members.exists?(:users => {id: current_user.id})
      redirect_to "/group/#{@group.id}" and return
    end
    @member = @group.members.create(:group_id => @group.id, :user_id => current_user.id, :is_accept => false)
    if @member
      redirect_to "/group/#{@group.id}"
    else
      redirect_to "/group/#{@group.id}", notice: "失敗しました"
    end
  end

private
  def authenticate_group!
    @members = Group.find(params[:id]).users.select('*')
    @user = @members.find(current_user.id)
    unless @user
      redirect_to "/user", alert: "グループの権限がありません"
      return false
    end
    if @user.is_accept == 0
      redirect_to "/user", alert: "承認待ちです。しばらくお待ちください"
      return false
    end
    true
  end

end
