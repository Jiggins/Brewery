module ApplicationHelper
  # http://getbootstrap.com/components/#glyphicons
  def glyphicon(glyph, options = {})
    options[:class] = "glyphicon glyphicon-#{glyph}" + options[:class].to_s
    options["aria-hidden"] = true
    content_tag :span, '', options
  end
end
