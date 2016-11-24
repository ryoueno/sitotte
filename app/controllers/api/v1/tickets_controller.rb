class Api::V1::TicketsController < ApplicationController
  def index
    @data = Ticket.all.order("updated_at desc")
  end

  def create
    @ticket = Ticket.create(ticket_params)
    render :show, status: :created
  end

  private

  def ticket_params
    params.permit(:assign_to, :title, :body, :state_id, :created_by)
  end
end
