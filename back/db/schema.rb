# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.1].define(version: 2026_06_13_065714) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "commutes", force: :cascade do |t|
    t.integer "commute_minutes", null: false
    t.datetime "created_at", null: false
    t.bigint "residence_id", null: false
    t.datetime "updated_at", null: false
    t.bigint "user_id", null: false
    t.bigint "workplace_id", null: false
    t.index ["residence_id"], name: "index_commutes_on_residence_id"
    t.index ["user_id", "workplace_id", "residence_id"], name: "index_commutes_on_user_id_and_workplace_id_and_residence_id", unique: true
    t.index ["user_id"], name: "index_commutes_on_user_id"
    t.index ["workplace_id"], name: "index_commutes_on_workplace_id"
    t.check_constraint "commute_minutes >= 0 AND commute_minutes <= 360", name: "commutes_minutes_range"
  end

  create_table "residences", force: :cascade do |t|
    t.string "city", limit: 50
    t.datetime "created_at", null: false
    t.string "name", limit: 50, null: false
    t.string "prefecture", limit: 10, null: false
    t.integer "rent", null: false
    t.datetime "updated_at", null: false
    t.bigint "user_id", null: false
    t.index ["user_id"], name: "index_residences_on_user_id"
    t.check_constraint "char_length(name::text) >= 1 AND char_length(name::text) <= 50", name: "residences_name_length"
    t.check_constraint "city IS NULL OR char_length(city::text) <= 50", name: "residences_city_length"
    t.check_constraint "prefecture::text = ANY (ARRAY['北海道'::character varying, '青森県'::character varying, '岩手県'::character varying, '宮城県'::character varying, '秋田県'::character varying, '山形県'::character varying, '福島県'::character varying, '茨城県'::character varying, '栃木県'::character varying, '群馬県'::character varying, '埼玉県'::character varying, '千葉県'::character varying, '東京都'::character varying, '神奈川県'::character varying, '新潟県'::character varying, '富山県'::character varying, '石川県'::character varying, '福井県'::character varying, '山梨県'::character varying, '長野県'::character varying, '岐阜県'::character varying, '静岡県'::character varying, '愛知県'::character varying, '三重県'::character varying, '滋賀県'::character varying, '京都府'::character varying, '大阪府'::character varying, '兵庫県'::character varying, '奈良県'::character varying, '和歌山県'::character varying, '鳥取県'::character varying, '島根県'::character varying, '岡山県'::character varying, '広島県'::character varying, '山口県'::character varying, '徳島県'::character varying, '香川県'::character varying, '愛媛県'::character varying, '高知県'::character varying, '福岡県'::character varying, '佐賀県'::character varying, '長崎県'::character varying, '熊本県'::character varying, '大分県'::character varying, '宮崎県'::character varying, '鹿児島県'::character varying, '沖縄県'::character varying]::text[])", name: "residences_prefecture_allowed"
    t.check_constraint "rent >= 0 AND rent <= 1000000", name: "residences_rent_range"
  end

  create_table "user_usage_metrics", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.datetime "last_visited_at"
    t.integer "max_combination_count", default: 0, null: false
    t.integer "recalculation_count", default: 0, null: false
    t.datetime "updated_at", null: false
    t.bigint "user_id", null: false
    t.integer "visit_count", default: 0, null: false
    t.index ["user_id"], name: "index_user_usage_metrics_on_user_id", unique: true
    t.check_constraint "max_combination_count >= 0 AND max_combination_count <= 1000000", name: "usage_metrics_max_combination_count_range"
    t.check_constraint "recalculation_count >= 0 AND recalculation_count <= 1000000", name: "usage_metrics_recalculation_count_range"
    t.check_constraint "visit_count >= 0 AND visit_count <= 1000000", name: "usage_metrics_visit_count_range"
  end

  create_table "users", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "guest_token", limit: 64, null: false
    t.string "name", limit: 50, null: false
    t.string "provider", limit: 20, default: "guest", null: false
    t.string "uid"
    t.datetime "updated_at", null: false
    t.index ["guest_token"], name: "index_users_on_guest_token", unique: true
    t.index ["provider", "uid"], name: "index_users_on_provider_and_uid", unique: true, where: "(uid IS NOT NULL)"
    t.check_constraint "char_length(name::text) >= 1 AND char_length(name::text) <= 50", name: "users_name_length"
    t.check_constraint "provider::text = 'guest'::text", name: "users_provider_allowed"
  end

  create_table "workplaces", force: :cascade do |t|
    t.string "city", limit: 50
    t.datetime "created_at", null: false
    t.string "name", limit: 50, null: false
    t.string "prefecture", limit: 10, null: false
    t.integer "salary", null: false
    t.datetime "updated_at", null: false
    t.bigint "user_id", null: false
    t.index ["user_id"], name: "index_workplaces_on_user_id"
    t.check_constraint "char_length(name::text) >= 1 AND char_length(name::text) <= 50", name: "workplaces_name_length"
    t.check_constraint "city IS NULL OR char_length(city::text) <= 50", name: "workplaces_city_length"
    t.check_constraint "prefecture::text = ANY (ARRAY['北海道'::character varying, '青森県'::character varying, '岩手県'::character varying, '宮城県'::character varying, '秋田県'::character varying, '山形県'::character varying, '福島県'::character varying, '茨城県'::character varying, '栃木県'::character varying, '群馬県'::character varying, '埼玉県'::character varying, '千葉県'::character varying, '東京都'::character varying, '神奈川県'::character varying, '新潟県'::character varying, '富山県'::character varying, '石川県'::character varying, '福井県'::character varying, '山梨県'::character varying, '長野県'::character varying, '岐阜県'::character varying, '静岡県'::character varying, '愛知県'::character varying, '三重県'::character varying, '滋賀県'::character varying, '京都府'::character varying, '大阪府'::character varying, '兵庫県'::character varying, '奈良県'::character varying, '和歌山県'::character varying, '鳥取県'::character varying, '島根県'::character varying, '岡山県'::character varying, '広島県'::character varying, '山口県'::character varying, '徳島県'::character varying, '香川県'::character varying, '愛媛県'::character varying, '高知県'::character varying, '福岡県'::character varying, '佐賀県'::character varying, '長崎県'::character varying, '熊本県'::character varying, '大分県'::character varying, '宮崎県'::character varying, '鹿児島県'::character varying, '沖縄県'::character varying]::text[])", name: "workplaces_prefecture_allowed"
    t.check_constraint "salary >= 0 AND salary <= 10000000", name: "workplaces_salary_range"
  end

  add_foreign_key "commutes", "residences"
  add_foreign_key "commutes", "users"
  add_foreign_key "commutes", "workplaces"
  add_foreign_key "residences", "users"
  add_foreign_key "user_usage_metrics", "users"
  add_foreign_key "workplaces", "users"
end
