class CreateUsers < ActiveRecord::Migration[8.1]
  def change
    create_table :users do |t|
      t.string :name, null: false
      t.string :guest_token, null: false
      t.string :provider, null: false, default: "guest"
      t.string :uid

      t.timestamps
    end

    # guest_token はゲストユーザーを一意に識別するために使います。
    add_index :users, :guest_token, unique: true
    # Googleログインなどを後で追加するとき、provider + uid の重複登録を防ぎます。
    # ゲストユーザーは uid を持たないため、uid がある行だけを unique 対象にします。
    add_index :users, [ :provider, :uid ], unique: true, where: "uid IS NOT NULL"
  end
end
