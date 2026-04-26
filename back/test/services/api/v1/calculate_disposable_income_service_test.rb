require "test_helper"

module Api
  module V1
    class CalculateDisposableIncomeServiceTest < ActiveSupport::TestCase
      test "subtracts fixed costs from monthly income" do
        result = CalculateDisposableIncomeService.new(
          monthly_income: 280_000,
          fixed_costs: 120_000,
        ).call

        assert_equal 160_000, result
      end

      test "returns a negative number when fixed costs exceed income" do
        result = CalculateDisposableIncomeService.new(
          monthly_income: 150_000,
          fixed_costs: 190_000,
        ).call

        assert_equal(-40_000, result)
      end
    end
  end
end
