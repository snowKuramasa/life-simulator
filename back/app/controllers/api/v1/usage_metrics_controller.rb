module Api
  module V1
    class UsageMetricsController < ApplicationController
      def show
        return render_unauthorized unless current_user

        render json: { usage_metric: usage_metric_json(current_user.usage_metric!) }, status: :ok
      end

      def result_view
        return render_unauthorized unless current_user

        usage_metric = current_user.usage_metric!
        usage_metric.record_result_view!(combination_count: params[:combination_count])

        render json: { usage_metric: usage_metric_json(usage_metric) }, status: :ok
      end

      private

      def usage_metric_json(usage_metric)
        {
          visit_count: usage_metric.visit_count,
          last_visited_at: usage_metric.last_visited_at&.iso8601,
          max_combination_count: usage_metric.max_combination_count,
          recalculation_count: usage_metric.recalculation_count
        }
      end

      def render_unauthorized
        render json: { error: "ログインが必要です" }, status: :unauthorized
      end
    end
  end
end
