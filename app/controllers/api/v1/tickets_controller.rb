class Api::V1::TicketsController < ApplicationController
  def index
    @data = Ticket.all.order("updated_at desc")
    @data = @data.where(assign_to: params[:assign_to]) unless params[:assign_to].blank?
  end

  def create
    @ticket = Ticket.create(ticket_params)
    render :show, status: :created
  end

  private

  def ticket_params
    permited = params.permit(:group_id, :assign_to, :title, :body, :state_id, :priority_id, :deadline, :created_by)
    permited[:number] = Ticket.where(:group_id => permited[:group_id]).count + 1
    permited
  end
end
