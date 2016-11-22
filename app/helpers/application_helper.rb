module ApplicationHelper
  # http://getbootstrap.com/components/#glyphicons
  def glyphicon(glyph, options = {})
    options[:class] = "glyphicon glyphicon-#{glyph}" + ' ' + options[:class].to_s
    options["aria-hidden"] = true
    content_tag :span, '', options
  end

  def alert(alert_level, alert_text = nil, html_options = {}, &block)
    unless alert_level.to_sym.in? [:success, :info, :warning, :danger]
      raise ArgumentError.new 'Expected one of: [:success, :info, :warning or :danger]'
    end

    html_options[:class] = "alert alert-#{alert_level} alert-dismissible fade in row " + html_options[:class].to_s
    html_options[:role] = 'alert'

    content_tag :div, html_options do
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

  def row(content = nil, options = {}, &block)
    options[:class] = 'row' + ' ' + options[:class].to_s

    content_tag :div, content, options, &block
  end

  def col(content = nil, xs: nil, sm: nil, md: nil, lg: nil, options: {}, &block)
    options[:class] = options[:class].to_s + " col-xs-#{xs}" unless xs.nil?
    options[:class] = options[:class].to_s + " col-sm-#{sm}" unless sm.nil?
    options[:class] = options[:class].to_s + " col-md-#{md}" unless md.nil?
    options[:class] = options[:class].to_s + " col-lg-#{lg}" unless lg.nil?

    content_tag :div, content, options, &block
  end
end
