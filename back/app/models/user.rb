class User < ApplicationRecord
  has_many :workplaces, dependent: :destroy
  has_many :residences, dependent: :destroy
  has_many :commutes, dependent: :destroy

  # ゲストユーザーを識別するためのランダムトークンを作成時に付与します。
  before_validation :set_guest_token, on: :create

  validates :name, presence: true, length: { maximum: 50 }
  validates :guest_token, presence: true, uniqueness: true
  validates :provider, presence: true

  # MVP用のゲストユーザーを作成します。
  #
  # @param name [String] ゲストユーザーの表示名
  # @return [User] 作成されたゲストユーザー
  # @raise [ActiveRecord::RecordInvalid] validation に失敗した場合
  def self.create_guest!(name:)
    create!(
      name: name,
      provider: "guest",
      uid: nil
    )
  end

  # ゲストログインで作られたユーザーかどうかを返します。
  #
  # @return [Boolean]
  def guest?
    provider == "guest"
  end

  private

  # guest_token が未設定ならランダムなURL-safe文字列を設定します。
  #
  # @return [String] 設定後の guest_token
  def set_guest_token
    self.guest_token ||= SecureRandom.urlsafe_base64(24)
  end
end
