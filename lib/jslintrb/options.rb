require 'optparse'

$jslintrb_verbose = false

OptionParser.new do |o|

  o.on("-v","--verbose") do 
    $jslintrb_verbose = true
  end

end.parse!
