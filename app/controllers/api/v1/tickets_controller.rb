class Api::V1::TicketsController < ApplicationController
  def index
    @data = Ticket.all
  end

  def create
    @ticket = Ticket.create(ticket_params)
    render :show, status: :created
  end

  private

  def ticket_params
    params.permit(:assign_to, :title, :body, :state_id).merge(:created_by => current_user.id)
  end
end
