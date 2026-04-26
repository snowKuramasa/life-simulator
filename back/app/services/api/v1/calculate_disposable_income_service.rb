module Api
  module V1
    class CalculateDisposableIncomeService
      def initialize(monthly_income:, fixed_costs:)
        @monthly_income = monthly_income
        @fixed_costs = fixed_costs
      end

      def call
        monthly_income - fixed_costs
      end

      private

      attr_reader :monthly_income, :fixed_costs
    end
  end
end
