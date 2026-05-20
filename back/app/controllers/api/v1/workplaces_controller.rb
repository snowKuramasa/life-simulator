module Api
  module V1
    # 勤務先候補を扱うAPIコントローラーです。
    #
    # 勤務先はログイン中のユーザーに紐づけて保存します。
    class WorkplacesController < ApplicationController
      # 勤務先候補を作成します。
      #
      # @route POST /api/v1/workplaces
      # @param workplace [Hash] 勤務先の入力値
      # @option workplace [String] :name 勤務先候補名
      # @option workplace [Integer] :salary 手取り給与
      # @option workplace [String] :prefecture 勤務地の都道府県
      # @option workplace [String] :city 勤務地の市区町村
      # @return [JSON] 作成された勤務先情報
      def create
        return render_unauthorized unless current_user

        workplace = current_user.workplaces.build(workplace_params)

        if workplace.save
          render json: { workplace: workplace_json(workplace) }, status: :created
        else
          render json: { errors: workplace.errors.to_hash(true) }, status: :unprocessable_entity
        end
      end

      private

      # フロントエンドから受け取る勤務先パラメータを制限します。
      #
      # @return [ActionController::Parameters]
      def workplace_params
        params.require(:workplace).permit(:name, :salary, :prefecture, :city)
      end

      # 勤務先APIで返すJSONの形をそろえます。
      #
      # @param workplace [Workplace] レスポンスに含める勤務先
      # @return [Hash] フロントエンドへ返す勤務先情報
      def workplace_json(workplace)
        {
          id: workplace.id,
          name: workplace.name,
          salary: workplace.salary,
          prefecture: workplace.prefecture,
          city: workplace.city
        }
      end

      # 未ログイン時のレスポンスを返します。
      #
      # @return [JSON]
      def render_unauthorized
        render json: { error: "ログインが必要です" }, status: :unauthorized
      end
    end
  end
end
