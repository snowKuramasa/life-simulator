class Workplace < ApplicationRecord
  include PrefectureList

  MAX_SALARY = 10_000_000

  belongs_to :user
  has_many :commutes, dependent: :destroy

  validates :name, presence: true, length: { maximum: 50 }
  validates :salary,
            presence: true,
            numericality: {
              only_integer: true,
              greater_than_or_equal_to: 0,
              less_than_or_equal_to: MAX_SALARY
            }
  validates :prefecture, presence: true, inclusion: { in: PREFECTURES }
  validates :city, length: { maximum: 50 }, allow_blank: true
end
