class CreateResidences < ActiveRecord::Migration[8.1]
  def change
    create_table :residences do |t|
      t.references :user, null: false, foreign_key: true
      t.string :name, null: false
      t.integer :rent, null: false
      t.string :prefecture, null: false
      t.string :city, null: false

      t.timestamps
    end
  end
end
