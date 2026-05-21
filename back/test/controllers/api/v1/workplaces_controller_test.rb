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

  test "updates a workplace for the current user" do
    post "/api/v1/auth/guest", params: { name: "勤務先編集テストユーザー" }, as: :json
    user_id = JSON.parse(response.body).dig("user", "id")
    workplace = Workplace.create!(
      user_id:,
      name: "候補A",
      salary: 220_000,
      prefecture: "東京都",
      city: "品川区"
    )

    patch "/api/v1/workplaces/#{workplace.id}",
          params: {
            workplace: {
              name: "候補B",
              salary: 250_000,
              prefecture: "神奈川県",
              city: "横浜市"
            }
          },
          as: :json

    assert_response :ok

    response_json = JSON.parse(response.body)
    workplace.reload

    assert_equal "候補B", workplace.name
    assert_equal 250_000, workplace.salary
    assert_equal "神奈川県", workplace.prefecture
    assert_equal "横浜市", workplace.city
    assert_equal workplace.id, response_json.dig("workplace", "id")
    assert_equal "候補B", response_json.dig("workplace", "name")
    assert_equal 250000, response_json.dig("workplace", "salary")
    assert_equal "神奈川県", response_json.dig("workplace", "prefecture")
    assert_equal "横浜市", response_json.dig("workplace", "city")
  end

  test "returns unauthorized when updating without a signed in user" do
    workplace = workplaces(:one)

    patch "/api/v1/workplaces/#{workplace.id}",
          params: {
            workplace: {
              name: "候補B",
              salary: 250_000,
              prefecture: "神奈川県",
              city: "横浜市"
            }
          },
          as: :json

    assert_response :unauthorized
    assert_equal "ログインが必要です", JSON.parse(response.body)["error"]
    assert_equal "MyString", workplace.reload.name
  end

  test "returns not found when updating another user's workplace" do
    post "/api/v1/auth/guest", params: { name: "勤務先編集テストユーザー" }, as: :json
    workplace = workplaces(:two)

    patch "/api/v1/workplaces/#{workplace.id}",
          params: {
            workplace: {
              name: "候補B",
              salary: 250_000,
              prefecture: "神奈川県",
              city: "横浜市"
            }
          },
          as: :json

    assert_response :not_found
    assert_equal "勤務先が見つかりません", JSON.parse(response.body)["error"]
    assert_equal "MyString", workplace.reload.name
  end

  test "returns validation errors when update params are invalid" do
    post "/api/v1/auth/guest", params: { name: "勤務先編集テストユーザー" }, as: :json
    user_id = JSON.parse(response.body).dig("user", "id")
    workplace = Workplace.create!(
      user_id:,
      name: "候補A",
      salary: 220_000,
      prefecture: "東京都",
      city: "品川区"
    )

    patch "/api/v1/workplaces/#{workplace.id}",
          params: {
            workplace: {
              name: "",
              salary: -1,
              prefecture: "",
              city: ""
            }
          },
          as: :json

    assert_response :unprocessable_entity

    response_json = JSON.parse(response.body)
    assert_includes response_json.dig("errors", "name"), "Name can't be blank"
    assert_includes response_json.dig("errors", "salary"), "Salary must be greater than or equal to 0"
    assert_includes response_json.dig("errors", "prefecture"), "Prefecture can't be blank"
    assert_includes response_json.dig("errors", "city"), "City can't be blank"
    assert_equal "候補A", workplace.reload.name
  end

  test "destroys a workplace for the current user" do
    post "/api/v1/auth/guest", params: { name: "勤務先削除テストユーザー" }, as: :json
    user_id = JSON.parse(response.body).dig("user", "id")
    workplace = Workplace.create!(
      user_id:,
      name: "候補A",
      salary: 220_000,
      prefecture: "東京都",
      city: "品川区"
    )

    assert_difference "Workplace.count", -1 do
      delete "/api/v1/workplaces/#{workplace.id}", as: :json
    end

    assert_response :no_content
    assert_empty response.body
  end

  test "returns unauthorized when destroying without a signed in user" do
    workplace = workplaces(:one)

    assert_no_difference "Workplace.count" do
      delete "/api/v1/workplaces/#{workplace.id}", as: :json
    end

    assert_response :unauthorized
    assert_equal "ログインが必要です", JSON.parse(response.body)["error"]
  end

  test "returns not found when destroying another user's workplace" do
    post "/api/v1/auth/guest", params: { name: "勤務先削除テストユーザー" }, as: :json
    workplace = workplaces(:two)

    assert_no_difference "Workplace.count" do
      delete "/api/v1/workplaces/#{workplace.id}", as: :json
    end

    assert_response :not_found
    assert_equal "勤務先が見つかりません", JSON.parse(response.body)["error"]
  end
end
