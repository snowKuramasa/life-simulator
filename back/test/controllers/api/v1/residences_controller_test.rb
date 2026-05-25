require "test_helper"

class Api::V1::ResidencesControllerTest < ActionDispatch::IntegrationTest
  test "creates a residence for the current user" do
    post "/api/v1/auth/guest", params: { name: "住居テストユーザー" }, as: :json
    user_id = JSON.parse(response.body).dig("user", "id")

    assert_difference "Residence.count", 1 do
      post "/api/v1/residences",
           params: {
             residence: {
               name: "候補A",
               rent: 80_000,
               prefecture: "東京都",
               city: "品川区"
             }
           },
           as: :json
    end

    assert_response :created

    response_json = JSON.parse(response.body)
    residence = Residence.last

    assert_equal user_id, residence.user_id
    assert_equal residence.id, response_json.dig("residence", "id")
    assert_equal "候補A", response_json.dig("residence", "name")
    assert_equal 80000, response_json.dig("residence", "rent")
    assert_equal "東京都", response_json.dig("residence", "prefecture")
    assert_equal "品川区", response_json.dig("residence", "city")
  end

  test "returns unauthorized when no user is signed in" do
    assert_no_difference "Residence.count" do
      post "/api/v1/residences",
           params: {
             residence: {
               name: "候補A",
               rent: 80_000,
               prefecture: "東京都",
               city: "品川区"
             }
           },
           as: :json
    end

    assert_response :unauthorized
    assert_equal "ログインが必要です", JSON.parse(response.body)["error"]
  end

  test "returns validation errors when residence params are invalid" do
    post "/api/v1/auth/guest", as: :json

    assert_no_difference "Residence.count" do
      post "/api/v1/residences",
           params: {
             residence: {
               name: "",
               rent: -1,
               prefecture: "",
               city: ""
             }
           },
           as: :json
    end

    assert_response :unprocessable_entity

    response_json = JSON.parse(response.body)
    assert_includes response_json.dig("errors", "name"), "Name can't be blank"
    assert_includes response_json.dig("errors", "rent"), "Rent must be greater than or equal to 0"
    assert_includes response_json.dig("errors", "prefecture"), "Prefecture can't be blank"
    assert_includes response_json.dig("errors", "city"), "City can't be blank"
  end
end
