class CreateWorkplaces < ActiveRecord::Migration[8.1]
  def change
    create_table :workplaces do |t|
      t.references :user, null: false, foreign_key: true
      t.string :name, null: false
      t.integer :salary, null: false
      t.string :prefecture, null: false
      t.string :city, null: false

      t.timestamps
    end
  end
end
