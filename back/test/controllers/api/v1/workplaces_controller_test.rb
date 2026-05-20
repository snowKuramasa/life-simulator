require "test_helper"

class Api::V1::WorkplacesControllerTest < ActionDispatch::IntegrationTest
  test "creates a workplace for the current user" do
    post "/api/v1/auth/guest", params: { name: "勤務先テストユーザー" }, as: :json
    user_id = JSON.parse(response.body).dig("user", "id")

    assert_difference "Workplace.count", 1 do
      post "/api/v1/workplaces",
           params: {
             workplace: {
               name: "候補A",
               salary: 220_000,
               prefecture: "東京都",
               city: "品川区"
             }
           },
           as: :json
    end

    assert_response :created

    response_json = JSON.parse(response.body)
    workplace = Workplace.last

    assert_equal user_id, workplace.user_id
    assert_equal workplace.id, response_json.dig("workplace", "id")
    assert_equal "候補A", response_json.dig("workplace", "name")
    assert_equal 220000, response_json.dig("workplace", "salary")
    assert_equal "東京都", response_json.dig("workplace", "prefecture")
    assert_equal "品川区", response_json.dig("workplace", "city")
  end

  test "returns unauthorized when no user is signed in" do
    assert_no_difference "Workplace.count" do
      post "/api/v1/workplaces",
           params: {
             workplace: {
               name: "候補A",
               salary: 220_000,
               prefecture: "東京都",
               city: "品川区"
             }
           },
           as: :json
    end

    assert_response :unauthorized
    assert_equal "ログインが必要です", JSON.parse(response.body)["error"]
  end

  test "returns validation errors when workplace params are invalid" do
    post "/api/v1/auth/guest", as: :json

    assert_no_difference "Workplace.count" do
      post "/api/v1/workplaces",
           params: {
             workplace: {
               name: "",
               salary: -1,
               prefecture: "",
               city: ""
             }
           },
           as: :json
    end

    assert_response :unprocessable_entity

    response_json = JSON.parse(response.body)
    assert_includes response_json.dig("errors", "name"), "Name can't be blank"
    assert_includes response_json.dig("errors", "salary"), "Salary must be greater than or equal to 0"
    assert_includes response_json.dig("errors", "prefecture"), "Prefecture can't be blank"
    assert_includes response_json.dig("errors", "city"), "City can't be blank"
  end
end
