class Member < ApplicationRecord
  belongs_to :users, optional: true
  belongs_to :group, optional: true
end
