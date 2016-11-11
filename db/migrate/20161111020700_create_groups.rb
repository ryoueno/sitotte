class CreateGroups < ActiveRecord::Migration[5.0]
  def change
    create_table :groups do |t|
      t.integer :admin_id, :null => false
      t.string :name
      t.integer :limit

      t.timestamps
    end
  end
end
