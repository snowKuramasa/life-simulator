class AddValidationConstraints < ActiveRecord::Migration[8.1]
  def change
    change_column :users, :name, :string, limit: 50, null: false
    change_column :users, :provider, :string, limit: 20, null: false, default: "guest"
    change_column :users, :guest_token, :string, limit: 64, null: false

    change_column :workplaces, :name, :string, limit: 50, null: false
    change_column :workplaces, :prefecture, :string, limit: 10, null: false
    change_column :workplaces, :city, :string, limit: 50
    change_column :residences, :name, :string, limit: 50, null: false
    change_column :residences, :prefecture, :string, limit: 10, null: false
    change_column :residences, :city, :string, limit: 50

    add_check_constraint :users, "char_length(name) BETWEEN 1 AND 50", name: "users_name_length"
    add_check_constraint :users, "provider IN ('guest')", name: "users_provider_allowed"
    add_check_constraint :workplaces, "salary BETWEEN 0 AND 10000000", name: "workplaces_salary_range"
    add_check_constraint :workplaces, "char_length(name) BETWEEN 1 AND 50", name: "workplaces_name_length"
    add_check_constraint :workplaces, prefecture_check_sql("prefecture"), name: "workplaces_prefecture_allowed"
    add_check_constraint :workplaces, "city IS NULL OR char_length(city) <= 50", name: "workplaces_city_length"
    add_check_constraint :residences, "rent BETWEEN 0 AND 1000000", name: "residences_rent_range"
    add_check_constraint :residences, "char_length(name) BETWEEN 1 AND 50", name: "residences_name_length"
    add_check_constraint :residences, prefecture_check_sql("prefecture"), name: "residences_prefecture_allowed"
    add_check_constraint :residences, "city IS NULL OR char_length(city) <= 50", name: "residences_city_length"
    add_check_constraint :commutes, "commute_minutes BETWEEN 0 AND 360", name: "commutes_minutes_range"
    add_check_constraint :user_usage_metrics, "visit_count BETWEEN 0 AND 1000000", name: "usage_metrics_visit_count_range"
    add_check_constraint :user_usage_metrics,
                         "max_combination_count BETWEEN 0 AND 1000000",
                         name: "usage_metrics_max_combination_count_range"
    add_check_constraint :user_usage_metrics,
                         "recalculation_count BETWEEN 0 AND 1000000",
                         name: "usage_metrics_recalculation_count_range"
  end

  private

  def prefecture_check_sql(column_name)
    prefectures = %w[
      北海道 青森県 岩手県 宮城県 秋田県 山形県 福島県 茨城県 栃木県 群馬県
      埼玉県 千葉県 東京都 神奈川県 新潟県 富山県 石川県 福井県 山梨県 長野県
      岐阜県 静岡県 愛知県 三重県 滋賀県 京都府 大阪府 兵庫県 奈良県 和歌山県
      鳥取県 島根県 岡山県 広島県 山口県 徳島県 香川県 愛媛県 高知県 福岡県
      佐賀県 長崎県 熊本県 大分県 宮崎県 鹿児島県 沖縄県
    ]
    allowed_values = prefectures.map { |prefecture| quote(prefecture) }.join(", ")

    "#{column_name} IN (#{allowed_values})"
  end
end
