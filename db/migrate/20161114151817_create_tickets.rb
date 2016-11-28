class CreateTickets < ActiveRecord::Migration[5.0]
  def change
    create_table :tickets do |t|
      t.integer :assign_to, :null => false
      t.string :title, :null => false
      t.text :body, :null => false
      t.integer :state_id, :null => false, :default => 1
      t.integer :priority_id, :null => false, :default => 1
      t.date :deadline
      t.integer :created_by, :null => false

      t.timestamps
    end
  end
end
