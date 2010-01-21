require 'rubygems'
require 'rake'

begin
  require 'jeweler'
  Jeweler::Tasks.new do |gem|
    gem.name = "jslintrb"
    gem.summary = %Q{Ruby packaging of JSLint javascript code checker}
    gem.description = %Q{jslintrb is a packaged version of Douglas Crockford\'s JSLint JavaScript code checker. jslintrb uses SpiderMonkey via the Johnson Ruby gem to interpret the JSLint javascript.}
    gem.email = "smparkes@smparkes.net"
    gem.homepage = "http://github.com/smparkes/jslintrb"
    gem.authors = ["Steven Parkes"]
    gem.add_runtime_dependency "smparkes-johnson"
    # gem.add_development_dependency "thoughtbot-shoulda", ">= 0"
    # gem is a Gem::Specification... see http://www.rubygems.org/read/chapter/20 for additional settings
    gem.files = FileList["[A-Z]*.*", "{bin,generators,doc,lib,test,spec}/**/*"]
  end
  Jeweler::GemcutterTasks.new
rescue LoadError
  puts "Jeweler (or a dependency) not available. Install it with: gem install jeweler"
end

require 'rake/testtask'
Rake::TestTask.new(:test) do |test|
  test.libs << 'lib' << 'test'
  test.pattern = 'test/**/test_*.rb'
  test.verbose = true
end

begin
  require 'rcov/rcovtask'
  Rcov::RcovTask.new do |test|
    test.libs << 'test'
    test.pattern = 'test/**/test_*.rb'
    test.verbose = true
  end
rescue LoadError
  task :rcov do
    abort "RCov is not available. In order to run rcov, you must: sudo gem install spicycode-rcov"
  end
end

task :test => :check_dependencies

task :default => :test

require 'rake/rdoctask'
Rake::RDocTask.new do |rdoc|
  version = File.exist?('VERSION') ? File.read('VERSION') : ""

  rdoc.rdoc_dir = 'rdoc'
  rdoc.title = "jslintrb #{version}"
  rdoc.rdoc_files.include('README*')
  rdoc.rdoc_files.include('lib/**/*.rb')
end

# Local Variables:
# mode:ruby
# End:
