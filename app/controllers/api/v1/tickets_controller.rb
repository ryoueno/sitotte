class Api::V1::TicketsController < ApplicationController
  def index
    @data = Ticket.all.order("updated_at desc")
    @data = @data.where(assign_to: params[:assign_to]) unless params[:assign_to].blank?
  end

  def create
    @ticket = Ticket.create(create_ticket_params)
    render :json => @ticket, status: :created
  end

  def update
    render :json => {:message => "見つかりませんでした"}, status: 404 if params[:id].nil? or not Ticket.exists?(params[:id])
    @ticket = Ticket.find(params[:id])
    @ticket.update(update_ticket_params)
    render :json => @ticket, states: :updated
  end

  private

  def create_ticket_params
    permited = params.permit(:group_id, :assign_to, :title, :body, :state_id, :priority_id, :deadline, :created_by)
    permited[:number] = Ticket.where(:group_id => permited[:group_id]).count + 1
    permited
  end

  def update_ticket_params
    params.permit(:assign_to, :title, :body, :state_id, :priority_id, :deadline)
  end
end
