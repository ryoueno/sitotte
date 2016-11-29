class Ticket < ApplicationRecord
  belongs_to :member, foreign_key: 'assign_to'
  belongs_to :state
  belongs_to :priority
end
