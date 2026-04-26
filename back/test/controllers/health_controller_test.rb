require "test_helper"

class HealthControllerTest < ActionDispatch::IntegrationTest
  test "returns health response with sample calculation" do
    get "/api/v1/health"

    assert_response :success

    response_json = JSON.parse(response.body)

    assert_equal "ok", response_json["status"]
    assert_equal "Backend API is ready", response_json["message"]
    assert_equal 160000, response_json.dig("sample_calculation", "disposable_income")
  end
end
