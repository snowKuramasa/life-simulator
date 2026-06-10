class UserUsageMetric < ApplicationRecord
  VISIT_INTERVAL = 24.hours

  belongs_to :user

  validates :visit_count, numericality: { only_integer: true, greater_than_or_equal_to: 0 }
  validates :max_combination_count, numericality: { only_integer: true, greater_than_or_equal_to: 0 }
  validates :recalculation_count, numericality: { only_integer: true, greater_than_or_equal_to: 0 }

  def record_result_view!(combination_count:)
    normalized_combination_count = [ combination_count.to_i, 0 ].max

    with_lock do
      next_visit_count = new_visit? ? visit_count + 1 : visit_count

      update!(
        visit_count: next_visit_count,
        last_visited_at: Time.current,
        max_combination_count: [ max_combination_count, normalized_combination_count ].max
      )
    end
  end

  def increment_recalculation_count!
    increment!(:recalculation_count)
  end

  private

  def new_visit?
    last_visited_at.blank? || last_visited_at <= VISIT_INTERVAL.ago
  end
end
