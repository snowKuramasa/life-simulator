class Commute < ApplicationRecord
  belongs_to :user
  belongs_to :workplace
  belongs_to :residence

  validates :commute_minutes, presence: true, numericality: { only_integer: true, greater_than_or_equal_to: 0 }
  validates :workplace_id, uniqueness: { scope: %i[user_id residence_id] }
  validate :workplace_belongs_to_user
  validate :residence_belongs_to_user

  private

  def workplace_belongs_to_user
    return if user_id.blank? || workplace.blank?
    return if workplace.user_id == user_id

    errors.add(:workplace, "must belong to user")
  end

  def residence_belongs_to_user
    return if user_id.blank? || residence.blank?
    return if residence.user_id == user_id

    errors.add(:residence, "must belong to user")
  end
end
