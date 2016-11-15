class CreateTickets < ActiveRecord::Migration[5.0]
  def change
    create_table :tickets do |t|
      t.integer :user_id
      t.string :title
      t.text :body
      t.integer :state_id

      t.timestamps
    end
  end
end
