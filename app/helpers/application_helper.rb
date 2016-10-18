module ApplicationHelper
  # http://getbootstrap.com/components/#glyphicons
  def glyphicon(glyph, options = {})
    options[:class] = "glyphicon glyphicon-#{glyph}"  + ' ' + options[:class].to_s
    options["aria-hidden"] = true
    content_tag :span, '', options
  end

  def alert(alert_level, alert_text = nil, &block)
    unless alert_level.to_sym.in? [:success, :info, :warning, :danger]
      raise ArgumentError.new 'Expected one of: [:success, :info, :warning or :danger]'
    end

    content_tag :div, class: ['alert', "alert-#{alert_level}", 'alert-dismissible', 'fade', 'in'], role: 'alert' do
      button = content_tag :button, type: 'button', class: 'close', 'data-dismiss': 'alert', 'aria-label': 'Close' do
        content_tag :span, sanitize('&times;'), 'aria-hidden': 'true'
      end

      concat content_tag :span, '', class: 'glyphicon glyphicon-exclamation-sign', 'aria-hidden': true
      concat ' '
      concat button

      if block
        yield block
      elsif alert_text
        concat alert_text
      else
        raise ArgumentError.new 'No text or block given'
      end
    end
  end
end
