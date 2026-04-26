module Api
  module V1
    class HealthController < ApplicationController
      def show
        disposable_income = CalculateDisposableIncomeService.new(
          monthly_income: 280_000,
          fixed_costs: 120_000,
        ).call

        render json: {
          status: "ok",
          message: "Backend API is ready",
          sample_calculation: {
            monthly_income: 280_000,
            fixed_costs: 120_000,
            disposable_income: disposable_income,
          },
          timestamp: Time.current.iso8601,
        }
      end
    end
  end
end
