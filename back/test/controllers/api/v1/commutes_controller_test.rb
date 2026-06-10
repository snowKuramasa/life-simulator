require "test_helper"

class Api::V1::CommutesControllerTest < ActionDispatch::IntegrationTest
  test "lists commutes for the current user" do
    post "/api/v1/auth/guest", params: { name: "通勤時間一覧テストユーザー" }, as: :json
    user_id = JSON.parse(response.body).dig("user", "id")
    workplace = Workplace.create!(
      user_id:,
      name: "候補A",
      salary: 220_000,
      prefecture: "東京都",
      city: "品川区"
    )
    residence = Residence.create!(
      user_id:,
      name: "住居A",
      rent: 80_000,
      prefecture: "東京都",
      city: "杉並区"
    )
    commute = Commute.create!(
      user_id:,
      workplace:,
      residence:,
      commute_minutes: 35
    )

    get "/api/v1/commutes", as: :json

    assert_response :ok

    commutes = JSON.parse(response.body).fetch("commutes")
    assert_equal 1, commutes.size
    assert_equal commute.id, commutes.first.fetch("id")
    assert_equal workplace.id, commutes.first.fetch("workplace_id")
    assert_equal residence.id, commutes.first.fetch("residence_id")
    assert_equal 35, commutes.first.fetch("commute_minutes")
  end

  test "does not include another user's commutes in index" do
    post "/api/v1/auth/guest", params: { name: "通勤時間一覧テストユーザー" }, as: :json

    get "/api/v1/commutes", as: :json

    assert_response :ok
    assert_empty JSON.parse(response.body).fetch("commutes")
  end

  test "returns unauthorized when listing without a signed in user" do
    get "/api/v1/commutes", as: :json

    assert_response :unauthorized
    assert_equal "ログインが必要です", JSON.parse(response.body)["error"]
  end

  test "shows a commute for the current user" do
    post "/api/v1/auth/guest", params: { name: "通勤時間詳細テストユーザー" }, as: :json
    user_id = JSON.parse(response.body).dig("user", "id")
    workplace = Workplace.create!(
      user_id:,
      name: "候補A",
      salary: 220_000,
      prefecture: "東京都",
      city: "品川区"
    )
    residence = Residence.create!(
      user_id:,
      name: "住居A",
      rent: 80_000,
      prefecture: "東京都",
      city: "杉並区"
    )
    commute = Commute.create!(
      user_id:,
      workplace:,
      residence:,
      commute_minutes: 35
    )

    get "/api/v1/commutes/#{commute.id}", as: :json

    assert_response :ok

    response_json = JSON.parse(response.body)
    assert_equal commute.id, response_json.dig("commute", "id")
    assert_equal workplace.id, response_json.dig("commute", "workplace_id")
    assert_equal residence.id, response_json.dig("commute", "residence_id")
    assert_equal 35, response_json.dig("commute", "commute_minutes")
  end

  test "returns unauthorized when showing without a signed in user" do
    commute = commutes(:one)

    get "/api/v1/commutes/#{commute.id}", as: :json

    assert_response :unauthorized
    assert_equal "ログインが必要です", JSON.parse(response.body)["error"]
  end

  test "returns not found when showing another user's commute" do
    post "/api/v1/auth/guest", params: { name: "通勤時間詳細テストユーザー" }, as: :json
    commute = commutes(:two)

    get "/api/v1/commutes/#{commute.id}", as: :json

    assert_response :not_found
    assert_equal "通勤時間設定が見つかりません", JSON.parse(response.body)["error"]
  end

  test "creates a commute for the current user" do
    post "/api/v1/auth/guest", params: { name: "通勤時間テストユーザー" }, as: :json
    user_id = JSON.parse(response.body).dig("user", "id")
    workplace = Workplace.create!(
      user_id:,
      name: "候補A",
      salary: 220_000,
      prefecture: "東京都",
      city: "品川区"
    )
    residence = Residence.create!(
      user_id:,
      name: "住居A",
      rent: 80_000,
      prefecture: "東京都",
      city: "杉並区"
    )

    assert_difference "Commute.count", 1 do
      post "/api/v1/commutes",
           params: {
             commute: {
               workplace_id: workplace.id,
               residence_id: residence.id,
               commute_minutes: 35
             }
           },
           as: :json
    end

    assert_response :created

    response_json = JSON.parse(response.body)
    commute = Commute.last

    assert_equal user_id, commute.user_id
    assert_equal commute.id, response_json.dig("commute", "id")
    assert_equal workplace.id, response_json.dig("commute", "workplace_id")
    assert_equal residence.id, response_json.dig("commute", "residence_id")
    assert_equal 35, response_json.dig("commute", "commute_minutes")
  end

  test "returns unauthorized when creating without a signed in user" do
    assert_no_difference "Commute.count" do
      post "/api/v1/commutes",
           params: {
             commute: {
               workplace_id: workplaces(:one).id,
               residence_id: residences(:one).id,
               commute_minutes: 35
             }
           },
           as: :json
    end

    assert_response :unauthorized
    assert_equal "ログインが必要です", JSON.parse(response.body)["error"]
  end

  test "returns not found when creating with another user's workplace or residence" do
    post "/api/v1/auth/guest", params: { name: "通勤時間テストユーザー" }, as: :json
    user_id = JSON.parse(response.body).dig("user", "id")
    residence = Residence.create!(
      user_id:,
      name: "住居A",
      rent: 80_000,
      prefecture: "東京都",
      city: "杉並区"
    )

    assert_no_difference "Commute.count" do
      post "/api/v1/commutes",
           params: {
             commute: {
               workplace_id: workplaces(:two).id,
               residence_id: residence.id,
               commute_minutes: 35
             }
           },
           as: :json
    end

    assert_response :not_found
    assert_equal "通勤時間設定が見つかりません", JSON.parse(response.body)["error"]
  end

  test "returns validation errors when commute params are invalid" do
    post "/api/v1/auth/guest", params: { name: "通勤時間テストユーザー" }, as: :json
    user_id = JSON.parse(response.body).dig("user", "id")
    workplace = Workplace.create!(
      user_id:,
      name: "候補A",
      salary: 220_000,
      prefecture: "東京都",
      city: "品川区"
    )
    residence = Residence.create!(
      user_id:,
      name: "住居A",
      rent: 80_000,
      prefecture: "東京都",
      city: "杉並区"
    )

    assert_no_difference "Commute.count" do
      post "/api/v1/commutes",
           params: {
             commute: {
               workplace_id: workplace.id,
               residence_id: residence.id,
               commute_minutes: -1
             }
           },
           as: :json
    end

    assert_response :unprocessable_entity
    assert_includes JSON.parse(response.body).dig("errors", "commute_minutes"),
                    "Commute minutes must be greater than or equal to 0"
  end

  test "returns validation errors when creating a duplicate commute combination" do
    post "/api/v1/auth/guest", params: { name: "通勤時間重複テストユーザー" }, as: :json
    user_id = JSON.parse(response.body).dig("user", "id")
    workplace = Workplace.create!(
      user_id:,
      name: "候補A",
      salary: 220_000,
      prefecture: "東京都",
      city: "品川区"
    )
    residence = Residence.create!(
      user_id:,
      name: "住居A",
      rent: 80_000,
      prefecture: "東京都",
      city: "杉並区"
    )
    Commute.create!(
      user_id:,
      workplace:,
      residence:,
      commute_minutes: 35
    )

    assert_no_difference "Commute.count" do
      post "/api/v1/commutes",
           params: {
             commute: {
               workplace_id: workplace.id,
               residence_id: residence.id,
               commute_minutes: 40
             }
           },
           as: :json
    end

    assert_response :unprocessable_entity
    assert_includes JSON.parse(response.body).dig("errors", "workplace_id"), "Workplace has already been taken"
  end

  test "updates a commute for the current user" do
    post "/api/v1/auth/guest", params: { name: "通勤時間編集テストユーザー" }, as: :json
    user_id = JSON.parse(response.body).dig("user", "id")
    workplace = Workplace.create!(
      user_id:,
      name: "候補A",
      salary: 220_000,
      prefecture: "東京都",
      city: "品川区"
    )
    residence = Residence.create!(
      user_id:,
      name: "住居A",
      rent: 80_000,
      prefecture: "東京都",
      city: "杉並区"
    )
    commute = Commute.create!(
      user_id:,
      workplace:,
      residence:,
      commute_minutes: 35
    )

    patch "/api/v1/commutes/#{commute.id}",
          params: {
            commute: {
              workplace_id: workplace.id,
              residence_id: residence.id,
              commute_minutes: 45
            }
          },
          as: :json

    assert_response :ok

    response_json = JSON.parse(response.body)
    commute.reload

    assert_equal 45, commute.commute_minutes
    assert_equal commute.id, response_json.dig("commute", "id")
    assert_equal workplace.id, response_json.dig("commute", "workplace_id")
    assert_equal residence.id, response_json.dig("commute", "residence_id")
    assert_equal 45, response_json.dig("commute", "commute_minutes")
  end

  test "returns unauthorized when updating without a signed in user" do
    commute = commutes(:one)

    patch "/api/v1/commutes/#{commute.id}",
          params: {
            commute: {
              workplace_id: workplaces(:one).id,
              residence_id: residences(:one).id,
              commute_minutes: 45
            }
          },
          as: :json

    assert_response :unauthorized
    assert_equal "ログインが必要です", JSON.parse(response.body)["error"]
    assert_equal 30, commute.reload.commute_minutes
  end

  test "returns not found when updating another user's commute" do
    post "/api/v1/auth/guest", params: { name: "通勤時間編集テストユーザー" }, as: :json
    commute = commutes(:two)

    patch "/api/v1/commutes/#{commute.id}",
          params: {
            commute: {
              workplace_id: workplaces(:two).id,
              residence_id: residences(:two).id,
              commute_minutes: 45
            }
          },
          as: :json

    assert_response :not_found
    assert_equal "通勤時間設定が見つかりません", JSON.parse(response.body)["error"]
    assert_equal 45, commute.reload.commute_minutes
  end

  test "returns not found when updating to another user's workplace or residence" do
    post "/api/v1/auth/guest", params: { name: "通勤時間編集テストユーザー" }, as: :json
    user_id = JSON.parse(response.body).dig("user", "id")
    workplace = Workplace.create!(
      user_id:,
      name: "候補A",
      salary: 220_000,
      prefecture: "東京都",
      city: "品川区"
    )
    residence = Residence.create!(
      user_id:,
      name: "住居A",
      rent: 80_000,
      prefecture: "東京都",
      city: "杉並区"
    )
    commute = Commute.create!(
      user_id:,
      workplace:,
      residence:,
      commute_minutes: 35
    )

    patch "/api/v1/commutes/#{commute.id}",
          params: {
            commute: {
              workplace_id: workplaces(:two).id,
              residence_id: residence.id,
              commute_minutes: 45
            }
          },
          as: :json

    assert_response :not_found
    assert_equal "通勤時間設定が見つかりません", JSON.parse(response.body)["error"]
    assert_equal 35, commute.reload.commute_minutes
  end

  test "returns validation errors when update params are invalid" do
    post "/api/v1/auth/guest", params: { name: "通勤時間編集テストユーザー" }, as: :json
    user_id = JSON.parse(response.body).dig("user", "id")
    workplace = Workplace.create!(
      user_id:,
      name: "候補A",
      salary: 220_000,
      prefecture: "東京都",
      city: "品川区"
    )
    residence = Residence.create!(
      user_id:,
      name: "住居A",
      rent: 80_000,
      prefecture: "東京都",
      city: "杉並区"
    )
    commute = Commute.create!(
      user_id:,
      workplace:,
      residence:,
      commute_minutes: 35
    )

    patch "/api/v1/commutes/#{commute.id}",
          params: {
            commute: {
              workplace_id: workplace.id,
              residence_id: residence.id,
              commute_minutes: -1
            }
          },
          as: :json

    assert_response :unprocessable_entity
    assert_includes JSON.parse(response.body).dig("errors", "commute_minutes"),
                    "Commute minutes must be greater than or equal to 0"
    assert_equal 35, commute.reload.commute_minutes
  end

  test "destroys a commute for the current user" do
    post "/api/v1/auth/guest", params: { name: "通勤時間削除テストユーザー" }, as: :json
    user_id = JSON.parse(response.body).dig("user", "id")
    workplace = Workplace.create!(
      user_id:,
      name: "候補A",
      salary: 220_000,
      prefecture: "東京都",
      city: "品川区"
    )
    residence = Residence.create!(
      user_id:,
      name: "住居A",
      rent: 80_000,
      prefecture: "東京都",
      city: "杉並区"
    )
    commute = Commute.create!(
      user_id:,
      workplace:,
      residence:,
      commute_minutes: 35
    )

    assert_difference "Commute.count", -1 do
      delete "/api/v1/commutes/#{commute.id}", as: :json
    end

    assert_response :no_content
    assert_empty response.body
  end

  test "returns unauthorized when destroying without a signed in user" do
    commute = commutes(:one)

    assert_no_difference "Commute.count" do
      delete "/api/v1/commutes/#{commute.id}", as: :json
    end

    assert_response :unauthorized
    assert_equal "ログインが必要です", JSON.parse(response.body)["error"]
  end

  test "returns not found when destroying another user's commute" do
    post "/api/v1/auth/guest", params: { name: "通勤時間削除テストユーザー" }, as: :json
    commute = commutes(:two)

    assert_no_difference "Commute.count" do
      delete "/api/v1/commutes/#{commute.id}", as: :json
    end

    assert_response :not_found
    assert_equal "通勤時間設定が見つかりません", JSON.parse(response.body)["error"]
  end
end
