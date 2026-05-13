class ApplicationController < ActionController::API
  # API-only Rails では Cookie 関連の機能が標準では薄いため、
  # session cookie を使う認証処理で cookies/session を扱えるようにします。
  include ActionController::Cookies

  private

  # session に保存した user_id から、現在ログイン中のユーザーを取得します。
  #
  # @return [User, nil] ログイン中なら User、未ログインなら nil
  def current_user
    @current_user ||= User.find_by(id: session[:user_id])
  end

  # 認証系APIで返すユーザーJSONの形をそろえます。
  #
  # @param user [User] レスポンスに含めるユーザー
  # @return [Hash] フロントエンドへ返すユーザー情報
  def user_json(user)
    {
      id: user.id,
      name: user.name,
      provider: user.provider,
      guest: user.guest?
    }
  end
end
