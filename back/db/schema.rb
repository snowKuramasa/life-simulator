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

ActiveRecord::Schema[8.1].define(version: 2026_05_25_000000) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "residences", force: :cascade do |t|
    t.string "city", null: false
    t.datetime "created_at", null: false
    t.string "name", null: false
    t.string "prefecture", null: false
    t.integer "rent", null: false
    t.datetime "updated_at", null: false
    t.bigint "user_id", null: false
    t.index ["user_id"], name: "index_residences_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "guest_token", null: false
    t.string "name", null: false
    t.string "provider", default: "guest", null: false
    t.string "uid"
    t.datetime "updated_at", null: false
    t.index ["guest_token"], name: "index_users_on_guest_token", unique: true
    t.index ["provider", "uid"], name: "index_users_on_provider_and_uid", unique: true, where: "(uid IS NOT NULL)"
  end

  create_table "workplaces", force: :cascade do |t|
    t.string "city", null: false
    t.datetime "created_at", null: false
    t.string "name", null: false
    t.string "prefecture", null: false
    t.integer "salary", null: false
    t.datetime "updated_at", null: false
    t.bigint "user_id", null: false
    t.index ["user_id"], name: "index_workplaces_on_user_id"
  end

  add_foreign_key "residences", "users"
  add_foreign_key "workplaces", "users"
end
