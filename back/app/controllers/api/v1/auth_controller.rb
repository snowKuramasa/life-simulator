module Api
  module V1
    # ゲストログインを扱うAPIコントローラーです。
    #
    # MVPではGoogleログインなどは扱わず、session cookie に user_id を保存して
    # 「ゲストユーザーとしてログイン済み」の状態を作ります。
    class AuthController < ApplicationController
      # ゲストユーザーとしてログインします。
      #
      # すでに session に user_id がある場合は同じユーザーを使い回し、
      # 未ログインの場合だけ新しいゲストユーザーを作成します。
      #
      # @route POST /api/v1/auth/guest
      # @param name [String, nil] 任意の表示名。空なら「ゲスト」を使います。
      # @return [JSON] authenticated と user 情報
      def guest
        user = current_user || User.create_guest!(name: guest_name)
        session[:user_id] = user.id

        render json: {
          authenticated: true,
          user: user_json(user)
        }, status: :ok
      end

      # 現在ログイン中のユーザーを返します。
      #
      # フロントエンドがページ表示時に「ログイン済みか」を確認するためのAPIです。
      #
      # @route GET /api/v1/auth/me
      # @return [JSON] ログイン中なら authenticated: true と user 情報
      # @return [JSON] 未ログインなら authenticated: false
      def me
        if current_user
          render json: {
            authenticated: true,
            user: user_json(current_user)
          }
        else
          render json: {
            authenticated: false,
            user: nil
          }, status: :unauthorized
        end
      end

      # 現在の session から user_id を削除してログアウトします。
      #
      # @route DELETE /api/v1/auth/logout
      # @return [void] 成功時は 204 No Content
      def logout
        session.delete(:user_id)

        head :no_content
      end

      private

      # リクエストされた名前をゲストユーザー名として整形します。
      #
      # @return [String] 空白だけの場合はデフォルト名「ゲスト」
      def guest_name
        name = params[:name].to_s.strip
        name.presence || "ゲスト"
      end
    end
  end
end
