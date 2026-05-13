require "test_helper"

class UserTest < ActiveSupport::TestCase
  test "creates a guest user with a guest token" do
    user = User.create_guest!(name: "ゲスト")

    assert user.persisted?
    assert_equal "ゲスト", user.name
    assert_equal "guest", user.provider
    assert user.guest?
    assert user.guest_token.present?
  end

  test "requires a name" do
    user = User.new(name: "", provider: "guest")

    assert_not user.valid?
    assert_includes user.errors[:name], "can't be blank"
  end
end
