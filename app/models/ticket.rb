class Ticket < ApplicationRecord
  belongs_to :member, foreign_key: 'assign_to'
end
