module Api
  module V1
    # 勤務先と住居の組み合わせに対する通勤時間を扱うAPIコントローラーです。
    #
    # 通勤時間はログイン中のユーザーに紐づけて保存します。
    class CommutesController < ApplicationController
      # 通勤時間設定の一覧を取得します。
      #
      # @route GET /api/v1/commutes
      # @return [JSON] ログイン中ユーザーの通勤時間設定一覧
      def index
        return render_unauthorized unless current_user

        commutes = current_user.commutes.includes(:workplace, :residence).order(:created_at, :id)

        render json: { commutes: commutes.map { |commute| commute_json(commute) } }, status: :ok
      end

      # 通勤時間設定を取得します。
      #
      # @route GET /api/v1/commutes/:id
      # @param id [Integer] 取得対象の通勤時間設定ID
      # @return [JSON] 通勤時間設定
      def show
        return render_unauthorized unless current_user

        commute = current_user.commutes.find_by(id: params[:id])
        return render_not_found unless commute

        render json: { commute: commute_json(commute) }, status: :ok
      end

      # 通勤時間設定を作成します。
      #
      # @route POST /api/v1/commutes
      # @param commute [Hash] 通勤時間設定の入力値
      # @option commute [Integer] :workplace_id 勤務先ID
      # @option commute [Integer] :residence_id 住居ID
      # @option commute [Integer] :commute_minutes 片道の通勤時間（分）
      # @return [JSON] 作成された通勤時間設定
      def create
        return render_unauthorized unless current_user

        commute = build_commute
        return render_not_found unless commute

        if commute.save
          render json: { commute: commute_json(commute) }, status: :created
        else
          render json: { errors: commute.errors.to_hash(true) }, status: :unprocessable_entity
        end
      end

      # 通勤時間設定を更新します。
      #
      # @route PATCH/PUT /api/v1/commutes/:id
      # @param id [Integer] 更新対象の通勤時間設定ID
      # @param commute [Hash] 通勤時間設定の入力値
      # @option commute [Integer] :workplace_id 勤務先ID
      # @option commute [Integer] :residence_id 住居ID
      # @option commute [Integer] :commute_minutes 片道の通勤時間（分）
      # @return [JSON] 更新された通勤時間設定
      def update
        return render_unauthorized unless current_user

        commute = current_user.commutes.find_by(id: params[:id])
        return render_not_found unless commute

        attributes = commute_attributes
        return render_not_found unless attributes

        if commute.update(attributes)
          render json: { commute: commute_json(commute) }, status: :ok
        else
          render json: { errors: commute.errors.to_hash(true) }, status: :unprocessable_entity
        end
      end

      # 通勤時間設定を削除します。
      #
      # @route DELETE /api/v1/commutes/:id
      # @param id [Integer] 削除対象の通勤時間設定ID
      # @return [nil] 削除成功時はレスポンス本文なし
      def destroy
        return render_unauthorized unless current_user

        commute = current_user.commutes.find_by(id: params[:id])
        return render_not_found unless commute

        commute.destroy!
        head :no_content
      end

      private

      # フロントエンドから受け取る通勤時間設定パラメータを制限します。
      #
      # @return [ActionController::Parameters]
      def commute_params
        params.require(:commute).permit(:workplace_id, :residence_id, :commute_minutes)
      end

      # 通勤時間設定を現在のユーザーの勤務先・住居に紐づけて組み立てます。
      #
      # @return [Commute, nil]
      def build_commute
        attributes = commute_attributes
        return unless attributes

        current_user.commutes.build(attributes)
      end

      # IDで渡された勤務先・住居が現在のユーザーのものか確認した上で属性を返します。
      #
      # @return [Hash, nil]
      def commute_attributes
        permitted_params = commute_params
        workplace = current_user.workplaces.find_by(id: permitted_params[:workplace_id])
        residence = current_user.residences.find_by(id: permitted_params[:residence_id])
        return unless workplace && residence

        {
          workplace:,
          residence:,
          commute_minutes: permitted_params[:commute_minutes]
        }
      end

      # 通勤時間設定APIで返すJSONの形をそろえます。
      #
      # @param commute [Commute] レスポンスに含める通勤時間設定
      # @return [Hash] フロントエンドへ返す通勤時間設定
      def commute_json(commute)
        {
          id: commute.id,
          workplace_id: commute.workplace_id,
          residence_id: commute.residence_id,
          commute_minutes: commute.commute_minutes
        }
      end

      # 未ログイン時のレスポンスを返します。
      #
      # @return [JSON]
      def render_unauthorized
        render json: { error: "ログインが必要です" }, status: :unauthorized
      end

      # 対象の通勤時間設定、勤務先、住居が見つからない場合のレスポンスを返します。
      #
      # @return [JSON]
      def render_not_found
        render json: { error: "通勤時間設定が見つかりません" }, status: :not_found
      end
    end
  end
end
