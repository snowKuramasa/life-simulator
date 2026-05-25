module Api
  module V1
    # 住居候補を扱うAPIコントローラーです。
    #
    # 住居はログイン中のユーザーに紐づけて保存します。
    class ResidencesController < ApplicationController
      # 住居候補を作成します。
      #
      # @route POST /api/v1/residences
      # @param residence [Hash] 住居の入力値
      # @option residence [String] :name 住居候補名
      # @option residence [Integer] :rent 家賃
      # @option residence [String] :prefecture 住居の都道府県
      # @option residence [String] :city 住居の市区町村
      # @return [JSON] 作成された住居情報
      def create
        return render_unauthorized unless current_user

        residence = current_user.residences.build(residence_params)

        if residence.save
          render json: { residence: residence_json(residence) }, status: :created
        else
          render json: { errors: residence.errors.to_hash(true) }, status: :unprocessable_entity
        end
      end

      private

      # フロントエンドから受け取る住居パラメータを制限します。
      #
      # @return [ActionController::Parameters]
      def residence_params
        params.require(:residence).permit(:name, :rent, :prefecture, :city)
      end

      # 住居APIで返すJSONの形をそろえます。
      #
      # @param residence [Residence] レスポンスに含める住居
      # @return [Hash] フロントエンドへ返す住居情報
      def residence_json(residence)
        {
          id: residence.id,
          name: residence.name,
          rent: residence.rent,
          prefecture: residence.prefecture,
          city: residence.city
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
