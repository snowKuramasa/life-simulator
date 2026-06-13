require "test_helper"

class CommuteTest < ActiveSupport::TestCase
  test "requires commute minutes within maximum" do
    commute = Commute.new(
      user: users(:one),
      workplace: workplaces(:one),
      residence: residences(:one),
      commute_minutes: Commute::MAX_COMMUTE_MINUTES + 1
    )

    assert_not commute.valid?
    assert_includes commute.errors[:commute_minutes],
                    "must be less than or equal to #{Commute::MAX_COMMUTE_MINUTES}"
  end
end
