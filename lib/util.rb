include CoreExtensions::Array
include CoreExtensions::Object

module Util
  def merge(xs, ys)
    mergeBy :id, xs, ys
  end

  def mergeBy(f, xs, ys)
    return [] if xs.empty? || ys.empty?

    if xs.first.send(f) <= ys.first.send(f)
      [xs.first] + mergeBy(f, xs.tail, ys)
    else
      [ys.first] + mergeBy(f, xs, ys.tail)
    end
  end

  def merge_enum(xs, ys)
    merge_enum_by(:id, xs, ys)
  end

  # merge_enum_by :: Ord a => (Enumerator -> a) -> Enumerator -> Enumerator -> Enumerator
  def merge_enum_by(f, xs, ys)
    xs = xs.to_enum
    ys = ys.to_enum

    Enumerator.new do |enum|
      loop do
        begin
          xs.peek
        rescue StopIteration
          loop { enum << ys.next }
        end

        begin
          ys.peek
        rescue StopIteration
          loop { enum << xs.next }
        end

        if xs.peek.send(f) < ys.peek.send(f)
          enum << xs.next
        else
          enum << ys.next
        end
      end
      enum
    end
  end
end
