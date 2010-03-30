/*global Ruby, JSLINT */
/*jslint
    evil: true, nomen: false, onevar: false, regexp: false, strict: true, indent: 2
    plusplus: false, white: false, gettersetter: true
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

  var gettersetter_error = function(file, line_number, reason, line) {
    Ruby.print(file + ' line ' + line_number + ' character 0: ' + reason + '\n');
    Ruby.print(line+"\n");
    Ruby.send("eval", "$stdout.flush");
    Ruby.send("eval", "$stderr.flush");
  };

  var files = Ruby.send("eval", "ENV['JSLINT_FILES']");
  files = files.split(":");
  for (var i = 0; i < files.length; i++) {
    var file = files[i];

    var batches = [];
    batches.push(default_options);

    var dirs = file.split("/");

    var list = [ ".jslintrbrc" ];
    for (var d = 1; d < dirs.length; d++) {
      list.push(dirs.slice(0, d).join("/") + "/.jslintrbrc");
    }

    var rc;
    for (d = 0; d < list.length; d++) {
      var opts;
      try {
        opts = Ruby.IO.read(list[d]);
      } catch (ex0) {
        opts = undefined;
      }
      
      if (opts) {
        try {
          opts = JSON.parse(opts);

          batches.push(opts);
        } catch (ex1) {
          throw new Error("could not parse " + list[d] + " as JSON");
        }
      }
    }
    var options = {};
    var b;
    for (b = 0; b < batches.length; b++) {
      var key;
      for (key in batches[b]) {
        options[key] = batches[b][key];
      }
    }
    
    var contents = Ruby.IO.read(file);
    var regex = /(.*)\s+(get|set)\s+(\w+)\s*\(([^)]*)\)(.*)/;
    var se = Ruby.send("eval", "$stderr");

    if (options.gettersetter) {
      contents = contents.split("\n");
      for (var l = 0; l < contents.length; l++ ) {
        var line = contents[l];
        var match = line.match(regex);
        if (match) {
          if (match[2] === "get") {
            if ( !match[4].match(/^\s*$/) ) {
              gettersetter_error(file, l, "getter has an argument: "+match[4], line);
            }
          } else if  (match[2] === "set") {
            if ( match[4].match(/^\s*$/) ) {
              gettersetter_error(file, l, "setter has no argument");
            }
            if ( match[4].match(/,/) ) {
              gettersetter_error(file, l, "setter has multiple arguments: "+match[4]);
            }
          }
          contents[l] = [ match[1], match[2], "_", match[3], ": function (", match[4], ")", match[5] ].join("");

        }
      }
      contents = contents.join("\n");
    }

    var success = JSLINT(contents, options);
    if (success) {
    } else {
      errors += JSLINT.errors.length;
      for (var j = 0; j < JSLINT.errors.length; j += 1) {
        var e = JSLINT.errors[j];
        if (e) {
          Ruby.print(file + ' line ' + e.line + ' character ' +
                     e.character + ': ' + e.reason + '\n');
          Ruby.print((e.evidence || '').
                     replace(/^\s*(\S*(\s+\S+)*)\s*$/, "$1") + '\n');
          Ruby.send("eval", "$stdout.flush");
          Ruby.send("eval", "$stderr.flush");
        }
      }
    }
  }

  if (errors) {
    Ruby.send("eval", "Process.exit!(-1)");
  }

}());

/* What the heck, a test getter/setter: self testing code? */
var x = {
  get a() {
    return 10;
  },
/*
  g_et b(x) {
    return 10;
  },
  s_et d(y, z) {
    return 10;
  },
  s_et e() {
    return 10;
  },
*/
  set c(y) {
    return 10;
  }
};
