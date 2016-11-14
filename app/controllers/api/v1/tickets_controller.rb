class Api::V1::TicketsController < ApplicationController
  def index
    @data = [
      { author: '上野涼', text: "I am **GOD's child**" },
      { author: '宮下紅葉', text: 'I am **GOD**' }
    ]
  end
end
