class CreateUserUsageMetrics < ActiveRecord::Migration[8.1]
  def change
    create_table :user_usage_metrics do |t|
      t.references :user, null: false, foreign_key: true, index: { unique: true }
      t.integer :visit_count, null: false, default: 0
      t.datetime :last_visited_at
      t.integer :max_combination_count, null: false, default: 0
      t.integer :recalculation_count, null: false, default: 0

      t.timestamps
    end
  end
end
