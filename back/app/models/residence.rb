class Residence < ApplicationRecord
  belongs_to :user

  validates :name, presence: true, length: { maximum: 50 }
  validates :rent, presence: true, numericality: { only_integer: true, greater_than_or_equal_to: 0 }
  validates :prefecture, presence: true, length: { maximum: 20 }
  validates :city, presence: true, length: { maximum: 50 }
end
