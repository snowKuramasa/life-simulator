require "test_helper"

class UserUsageMetricTest < ActiveSupport::TestCase
  test "records the highest combination count" do
    usage_metric = UserUsageMetric.create!(user: users(:one))

    usage_metric.record_result_view!(combination_count: 4)
    usage_metric.record_result_view!(combination_count: 2)

    assert_equal 4, usage_metric.reload.max_combination_count
  end

  test "increments recalculation count" do
    usage_metric = UserUsageMetric.create!(user: users(:one))

    assert_difference -> { usage_metric.reload.recalculation_count }, 1 do
      usage_metric.increment_recalculation_count!
    end
  end
end
