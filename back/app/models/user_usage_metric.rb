class UserUsageMetric < ApplicationRecord
  VISIT_INTERVAL = 24.hours
  MAX_COUNTER = 1_000_000

  belongs_to :user

  validates :visit_count,
            numericality: { only_integer: true, greater_than_or_equal_to: 0, less_than_or_equal_to: MAX_COUNTER }
  validates :max_combination_count,
            numericality: { only_integer: true, greater_than_or_equal_to: 0, less_than_or_equal_to: MAX_COUNTER }
  validates :recalculation_count,
            numericality: { only_integer: true, greater_than_or_equal_to: 0, less_than_or_equal_to: MAX_COUNTER }

  def record_result_view!(combination_count:)
    normalized_combination_count = combination_count.to_i.clamp(0, MAX_COUNTER)

    with_lock do
      next_visit_count = new_visit? ? [ visit_count + 1, MAX_COUNTER ].min : visit_count

      update!(
        visit_count: next_visit_count,
        last_visited_at: Time.current,
        max_combination_count: [ max_combination_count, normalized_combination_count ].max
      )
    end
  end

  def increment_recalculation_count!
    with_lock do
      update!(recalculation_count: [ recalculation_count + 1, MAX_COUNTER ].min)
    end
  end

  private

  def new_visit?
    last_visited_at.blank? || last_visited_at <= VISIT_INTERVAL.ago
  end
end
