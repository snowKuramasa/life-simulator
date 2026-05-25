require "test_helper"

class Api::V1::ResidencesControllerTest < ActionDispatch::IntegrationTest
  test "lists residences for the current user" do
    post "/api/v1/auth/guest", params: { name: "住居一覧テストユーザー" }, as: :json
    user_id = JSON.parse(response.body).dig("user", "id")
    first_residence = Residence.create!(
      user_id:,
      name: "候補A",
      rent: 80_000,
      prefecture: "東京都",
      city: "品川区"
    )
    second_residence = Residence.create!(
      user_id:,
      name: "候補B",
      rent: 95_000,
      prefecture: "神奈川県",
      city: "横浜市"
    )

    get "/api/v1/residences", as: :json

    assert_response :ok

    response_json = JSON.parse(response.body)
    residences = response_json.fetch("residences")
    assert_equal 2, residences.size
    assert_equal [ first_residence.id, second_residence.id ], residences.pluck("id")
    assert_equal [ "候補A", "候補B" ], residences.pluck("name")
    assert_equal [ 80000, 95000 ], residences.pluck("rent")
    assert_equal [ "東京都", "神奈川県" ], residences.pluck("prefecture")
    assert_equal [ "品川区", "横浜市" ], residences.pluck("city")
  end

  test "does not include another user's residences in index" do
    post "/api/v1/auth/guest", params: { name: "住居一覧テストユーザー" }, as: :json

    get "/api/v1/residences", as: :json

    assert_response :ok
    assert_empty JSON.parse(response.body).fetch("residences")
  end

  test "returns unauthorized when listing without a signed in user" do
    get "/api/v1/residences", as: :json

    assert_response :unauthorized
    assert_equal "ログインが必要です", JSON.parse(response.body)["error"]
  end

  test "shows a residence for the current user" do
    post "/api/v1/auth/guest", params: { name: "住居詳細テストユーザー" }, as: :json
    user_id = JSON.parse(response.body).dig("user", "id")
    residence = Residence.create!(
      user_id:,
      name: "候補A",
      rent: 80_000,
      prefecture: "東京都",
      city: "品川区"
    )

    get "/api/v1/residences/#{residence.id}", as: :json

    assert_response :ok

    response_json = JSON.parse(response.body)
    assert_equal residence.id, response_json.dig("residence", "id")
    assert_equal "候補A", response_json.dig("residence", "name")
    assert_equal 80000, response_json.dig("residence", "rent")
    assert_equal "東京都", response_json.dig("residence", "prefecture")
    assert_equal "品川区", response_json.dig("residence", "city")
  end

  test "returns unauthorized when showing without a signed in user" do
    residence = residences(:one)

    get "/api/v1/residences/#{residence.id}", as: :json

    assert_response :unauthorized
    assert_equal "ログインが必要です", JSON.parse(response.body)["error"]
  end

  test "returns not found when showing another user's residence" do
    post "/api/v1/auth/guest", params: { name: "住居詳細テストユーザー" }, as: :json
    residence = residences(:two)

    get "/api/v1/residences/#{residence.id}", as: :json

    assert_response :not_found
    assert_equal "住居が見つかりません", JSON.parse(response.body)["error"]
  end

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

  test "updates a residence for the current user" do
    post "/api/v1/auth/guest", params: { name: "住居編集テストユーザー" }, as: :json
    user_id = JSON.parse(response.body).dig("user", "id")
    residence = Residence.create!(
      user_id:,
      name: "候補A",
      rent: 80_000,
      prefecture: "東京都",
      city: "品川区"
    )

    patch "/api/v1/residences/#{residence.id}",
          params: {
            residence: {
              name: "候補B",
              rent: 95_000,
              prefecture: "神奈川県",
              city: "横浜市"
            }
          },
          as: :json

    assert_response :ok

    response_json = JSON.parse(response.body)
    residence.reload

    assert_equal "候補B", residence.name
    assert_equal 95_000, residence.rent
    assert_equal "神奈川県", residence.prefecture
    assert_equal "横浜市", residence.city
    assert_equal residence.id, response_json.dig("residence", "id")
    assert_equal "候補B", response_json.dig("residence", "name")
    assert_equal 95000, response_json.dig("residence", "rent")
    assert_equal "神奈川県", response_json.dig("residence", "prefecture")
    assert_equal "横浜市", response_json.dig("residence", "city")
  end

  test "returns unauthorized when updating without a signed in user" do
    residence = residences(:one)

    patch "/api/v1/residences/#{residence.id}",
          params: {
            residence: {
              name: "候補B",
              rent: 95_000,
              prefecture: "神奈川県",
              city: "横浜市"
            }
          },
          as: :json

    assert_response :unauthorized
    assert_equal "ログインが必要です", JSON.parse(response.body)["error"]
    assert_equal "MyString", residence.reload.name
  end

  test "returns not found when updating another user's residence" do
    post "/api/v1/auth/guest", params: { name: "住居編集テストユーザー" }, as: :json
    residence = residences(:two)

    patch "/api/v1/residences/#{residence.id}",
          params: {
            residence: {
              name: "候補B",
              rent: 95_000,
              prefecture: "神奈川県",
              city: "横浜市"
            }
          },
          as: :json

    assert_response :not_found
    assert_equal "住居が見つかりません", JSON.parse(response.body)["error"]
    assert_equal "MyString", residence.reload.name
  end

  test "returns validation errors when update params are invalid" do
    post "/api/v1/auth/guest", params: { name: "住居編集テストユーザー" }, as: :json
    user_id = JSON.parse(response.body).dig("user", "id")
    residence = Residence.create!(
      user_id:,
      name: "候補A",
      rent: 80_000,
      prefecture: "東京都",
      city: "品川区"
    )

    patch "/api/v1/residences/#{residence.id}",
          params: {
            residence: {
              name: "",
              rent: -1,
              prefecture: "",
              city: ""
            }
          },
          as: :json

    assert_response :unprocessable_entity

    response_json = JSON.parse(response.body)
    assert_includes response_json.dig("errors", "name"), "Name can't be blank"
    assert_includes response_json.dig("errors", "rent"), "Rent must be greater than or equal to 0"
    assert_includes response_json.dig("errors", "prefecture"), "Prefecture can't be blank"
    assert_includes response_json.dig("errors", "city"), "City can't be blank"
    assert_equal "候補A", residence.reload.name
  end

  test "destroys a residence for the current user" do
    post "/api/v1/auth/guest", params: { name: "住居削除テストユーザー" }, as: :json
    user_id = JSON.parse(response.body).dig("user", "id")
    residence = Residence.create!(
      user_id:,
      name: "候補A",
      rent: 80_000,
      prefecture: "東京都",
      city: "品川区"
    )

    assert_difference "Residence.count", -1 do
      delete "/api/v1/residences/#{residence.id}", as: :json
    end

    assert_response :no_content
    assert_empty response.body
  end

  test "returns unauthorized when destroying without a signed in user" do
    residence = residences(:one)

    assert_no_difference "Residence.count" do
      delete "/api/v1/residences/#{residence.id}", as: :json
    end

    assert_response :unauthorized
    assert_equal "ログインが必要です", JSON.parse(response.body)["error"]
  end

  test "returns not found when destroying another user's residence" do
    post "/api/v1/auth/guest", params: { name: "住居削除テストユーザー" }, as: :json
    residence = residences(:two)

    assert_no_difference "Residence.count" do
      delete "/api/v1/residences/#{residence.id}", as: :json
    end

    assert_response :not_found
    assert_equal "住居が見つかりません", JSON.parse(response.body)["error"]
  end
end
