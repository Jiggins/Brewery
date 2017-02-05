class Logger
  def format_message(severity, timestamp, progname, msg)
    "#{timestamp} (#{$$}) #{msg}\n"
  end
end

# Some idiot logged useless warnings to stdout, this should shut them up (it doesn't)
Hashie.logger = Logger.new(nil)
