require "test_helper"

class Api::V1::UsageMetricsControllerTest < ActionDispatch::IntegrationTest
  include ActiveSupport::Testing::TimeHelpers

  test "shows usage metric for the current user" do
    post "/api/v1/auth/guest", params: { name: "指標確認ユーザー" }, as: :json

    get "/api/v1/usage_metric", as: :json

    assert_response :ok

    usage_metric = JSON.parse(response.body).fetch("usage_metric")
    assert_equal 0, usage_metric.fetch("visit_count")
    assert_nil usage_metric.fetch("last_visited_at")
    assert_equal 0, usage_metric.fetch("max_combination_count")
    assert_equal 0, usage_metric.fetch("recalculation_count")
  end

  test "records result view without creating duplicate metric rows" do
    post "/api/v1/auth/guest", params: { name: "指標記録ユーザー" }, as: :json

    assert_difference "UserUsageMetric.count", 1 do
      post "/api/v1/usage_metric/result_view", params: { combination_count: 4 }, as: :json
    end

    assert_no_difference "UserUsageMetric.count" do
      post "/api/v1/usage_metric/result_view", params: { combination_count: 2 }, as: :json
    end

    assert_response :ok

    usage_metric = JSON.parse(response.body).fetch("usage_metric")
    assert_equal 1, usage_metric.fetch("visit_count")
    assert_equal 4, usage_metric.fetch("max_combination_count")
  end

  test "counts a revisit after the visit interval" do
    post "/api/v1/auth/guest", params: { name: "再訪問ユーザー" }, as: :json

    travel_to Time.zone.local(2026, 6, 10, 9, 0, 0) do
      post "/api/v1/usage_metric/result_view", params: { combination_count: 1 }, as: :json
    end

    travel_to Time.zone.local(2026, 6, 11, 10, 0, 0) do
      post "/api/v1/usage_metric/result_view", params: { combination_count: 3 }, as: :json
    end

    usage_metric = JSON.parse(response.body).fetch("usage_metric")
    assert_equal 2, usage_metric.fetch("visit_count")
    assert_equal 3, usage_metric.fetch("max_combination_count")
  end

  test "returns unauthorized without a signed in user" do
    post "/api/v1/usage_metric/result_view", params: { combination_count: 4 }, as: :json

    assert_response :unauthorized
    assert_equal "ログインが必要です", JSON.parse(response.body).fetch("error")
  end
end
