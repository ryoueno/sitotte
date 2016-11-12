class CreateMembers < ActiveRecord::Migration[5.0]
  def change
    create_table :members do |t|
      t.integer :group_id, :null => false
      t.integer :user_id, :null => false
      t.boolean :is_admin, :null => false, :default => false

      t.timestamps
    end
  end
end
