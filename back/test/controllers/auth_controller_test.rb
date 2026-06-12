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
    assert_equal true, response_json["first_login"]
  end

  test "returns false for first login when a guest user already exists in the session" do
    post "/api/v1/auth/guest", params: { name: "初回ゲスト" }, as: :json
    created_user_id = JSON.parse(response.body).dig("user", "id")

    assert_no_difference "User.count" do
      post "/api/v1/auth/guest", params: { name: "再ログインゲスト" }, as: :json
    end

    assert_response :success

    response_json = JSON.parse(response.body)

    assert_equal true, response_json["authenticated"]
    assert_equal created_user_id, response_json.dig("user", "id")
    assert_equal false, response_json["first_login"]
  end

  test "uses default guest name when name is blank" do
    post "/api/v1/auth/guest", params: { name: "" }, as: :json

    assert_response :success
    assert_equal "ゲスト", JSON.parse(response.body).dig("user", "name")
  end

  test "returns auth session from the session" do
    post "/api/v1/auth/guest", as: :json
    created_user_id = JSON.parse(response.body).dig("user", "id")

    get "/api/v1/auth/session"

    assert_response :success
    assert_equal true, JSON.parse(response.body)["authenticated"]
    assert_equal created_user_id, JSON.parse(response.body).dig("user", "id")
  end

  test "keeps legacy auth me route compatible" do
    post "/api/v1/auth/guest", as: :json
    created_user_id = JSON.parse(response.body).dig("user", "id")

    get "/api/v1/auth/me"

    assert_response :success
    assert_equal true, JSON.parse(response.body)["authenticated"]
    assert_equal created_user_id, JSON.parse(response.body).dig("user", "id")
  end

  test "returns unauthorized when no user is signed in" do
    get "/api/v1/auth/session"

    assert_response :unauthorized
    assert_equal false, JSON.parse(response.body)["authenticated"]
  end

  test "logs out and destroys the current guest user with saved data" do
    post "/api/v1/auth/guest", as: :json
    user = User.find(JSON.parse(response.body).dig("user", "id"))
    workplace = user.workplaces.create!(
      name: "テスト勤務先",
      salary: 220_000,
      prefecture: "東京都",
      city: "渋谷区"
    )
    residence = user.residences.create!(
      name: "テスト住居",
      rent: 80_000,
      prefecture: "東京都",
      city: "世田谷区"
    )
    user.commutes.create!(
      workplace: workplace,
      residence: residence,
      commute_minutes: 30
    )

    assert_difference -> { User.count }, -1 do
      assert_difference -> { Workplace.count }, -1 do
        assert_difference -> { Residence.count }, -1 do
          assert_difference -> { Commute.count }, -1 do
            delete "/api/v1/auth/logout"
          end
        end
      end
    end

    assert_response :no_content

    get "/api/v1/auth/session"

    assert_response :unauthorized
  end
end
