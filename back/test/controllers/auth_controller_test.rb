require "test_helper"

class AuthControllerTest < ActionDispatch::IntegrationTest
  test "creates a guest user and stores the session" do
    assert_difference "User.count", 1 do
      post "/api/v1/auth/guest", params: { name: "テストゲスト" }, as: :json
    end

    assert_response :success

    response_json = JSON.parse(response.body)
    user = User.last

    assert_equal true, response_json["authenticated"]
    assert_equal user.id, response_json.dig("user", "id")
    assert_equal "テストゲスト", response_json.dig("user", "name")
    assert_equal "guest", response_json.dig("user", "provider")
    assert_equal true, response_json.dig("user", "guest")
  end

  test "uses default guest name when name is blank" do
    post "/api/v1/auth/guest", params: { name: "" }, as: :json

    assert_response :success
    assert_equal "ゲスト", JSON.parse(response.body).dig("user", "name")
  end

  test "returns current user from the session" do
    post "/api/v1/auth/guest", as: :json
    created_user_id = JSON.parse(response.body).dig("user", "id")

    get "/api/v1/auth/me"

    assert_response :success
    assert_equal true, JSON.parse(response.body)["authenticated"]
    assert_equal created_user_id, JSON.parse(response.body).dig("user", "id")
  end

  test "returns unauthorized when no user is signed in" do
    get "/api/v1/auth/me"

    assert_response :unauthorized
    assert_equal false, JSON.parse(response.body)["authenticated"]
  end

  test "logs out the current user" do
    post "/api/v1/auth/guest", as: :json

    delete "/api/v1/auth/logout"

    assert_response :no_content

    get "/api/v1/auth/me"

    assert_response :unauthorized
  end
end
