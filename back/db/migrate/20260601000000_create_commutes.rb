class CreateCommutes < ActiveRecord::Migration[8.1]
  def change
    create_table :commutes do |t|
      t.references :user, null: false, foreign_key: true
      t.references :workplace, null: false, foreign_key: true
      t.references :residence, null: false, foreign_key: true
      t.integer :commute_minutes, null: false

      t.timestamps
    end

    add_index :commutes, %i[user_id workplace_id residence_id], unique: true
  end
end
