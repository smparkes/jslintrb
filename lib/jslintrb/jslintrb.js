/*global Ruby, JSLINT */
/*jslint
    evil: true, nomen: false, onevar: false, regexp: false, strict: true, indent: 2
    plusplus: false
*/

"use strict";

(function () {

  var default_options = {
    bitwise    : true, // if bitwise operators should not be allowed
    eqeqeq     : true, // if === should be required
    forin      : true, // if for in statements must filter
    immed      : true, // if immediate invocations must be wrapped in parens
    newcap     : true, // if constructor names must be capitalized
    nomen      : true, // if names should be checked
    onevar     : true, // if only one var statement per function should be allowed
    plusplus   : true, // if increment/decrement should not be allowed
    regexp     : true, // if the . should not be allowed in regexp literals
    undef      : true, // if variables should be declared before used
    strict     : true, // require the "use strict"; pragma
    white      : true  // if strict whitespace rules apply
  };

  var errors = 0;

  var files = Ruby.send("eval", "ENV['JSLINT_FILES']");
  files = files.split(":");
  for (var i = 0; i < files.length; i++) {
    var file = files[i];

    var batches = [];
    batches.push( default_options );

    var dirs = file.split("/");

    var list = [ ".jslintrbrc" ];
    var d;
    for(var d=1; d < dirs.length; d++){
      list.push(dirs.slice(0,d).join("/")+"/.jslintrbrc");
    }

    var rc;
    for(d=0; d<list.length; d++){
      var opts;
      try {
        opts = Ruby.IO.read(list[d]);
      } catch (ex) {
        opts = undefined;
      }
      
      if (opts) {
        opts = JSON.parse(opts);
        batches.push(opts);
      }
    }
    var options = {};
    var b;
    for (b=0; b<batches.length; b++) {
      var key;
      for(key in batches[b]) {
        options[key] = batches[b][key];
      }
    }
    
    var contents = Ruby.IO.read(file);
    var success = JSLINT(contents, options);
    if (success) {
    } else {
      errors += JSLINT.errors.length;
      for (j = 0; j < JSLINT.errors.length; j += 1) {
        var e = JSLINT.errors[j];
        if (e) {
          Ruby.print(file + ' line ' + e.line + ' character ' +
                     e.character + ': ' + e.reason + '\n');
          Ruby.print((e.evidence || '').
                     replace(/^\s*(\S*(\s+\S+)*)\s*$/, "$1") + '\n');
        }
      }
    }
  }

  if (errors) {
    Ruby.send("eval", "Process.exit!(-1)");
  }

}());
