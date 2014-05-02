//@ sourceURL=formValidate.js

/*
  Form Validate Version 1.1.5
  MIT License
  by Sean MacIsaac
*/

function formValidate(form) {
  function camelCase(string) {
    string = string||'';
    string = string.replace(/\(|\)/,'').split(/-|\s/);
    var out = [];
    for (var i = 0;i<string.length;i++) {
      if (i<1) {
        out.push(string[i].toLowerCase());
      } else {
        out.push(string[i][0].toUpperCase() + string[i].substr(1,string[i].length).toLowerCase());
      }
    }
    return out.join('');
  }

  function nullBool(value) {
    return (value);
  }

  function getGroup(el) {
    return {
      container: el.closest('.form-validate-group'),
      label: $('[for="' + el.attr('id') + '"]'),
      prompt: el.closest('.form-validate-group').find('.form-validate-prompt')
    }
  }

  function isValid(el) {
    function getType() {
      var attr = camelCase(el.attr('id')).toLowerCase();
      var tag  = (el.attr('type') === 'checkbox') ? 'checkbox' : el[0].tagName.toLowerCase();
      function type() {
        var _type = 'text';
        if (attr.match(/zip(code|)/)) {
          _type = 'zipCode';
        } else if (attr.match(/zippostal/)) {
          _type = 'zipPostal';
        } else if (attr.match(/(confirm|)(new|old|current|)password/)) {
          _type = 'password'
        } else if (attr.match(/(confirm|)([a-zA-Z0-9_-]+|)email/)) {
          _type = 'email';
        } else if (attr.match(/(confirm|)([a-zA-Z0-9_-]+|)(phone)(number|)/)) {
          _type = 'phone';
        } else if (attr.match(/merchantid/)) {
          _type = 'merchantId';
        } else if (attr.match(/marketplaceid/)) {
          _type = 'marketplaceId';
        } else if (attr.match(/number/)) {
          _type = 'number';
        }
        return _type;
      }
      if (tag === 'input' || tag === 'textarea') {
        return type();
      } else {
        return tag;
      }
    } // Get Type
    var string = el.val()||'';
    var exe = {
      text: function () {
        return (string.length > 0);
      },
      password: function () {
        return (string.length > 6 && nullBool(string.match(/^[\!\@\#\$\%\^\&\*\(\)a-zA-Z0-9_-]+$/)));
      },
      zipCode: function () {
        return (nullBool(string.match(/^[0-9]{5}$/)));
      },
      zipPostal: function () {
        return (nullBool(string.match(/^([0-9]{5}|[a-zA-Z][0-9][a-zA-Z](\s|)[0-9][a-zA-Z][0-9])$/)));
      },
      email: function () {
        return (nullBool(string.match(/[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+\.([a-z]{2}|[a-z]{3})/)));
      },
      merchantId: function () {
        var match = string.match(/^[A-Z0-9]+$/);
        return ((match) && (match[0].length > 9 && match[0].length < 22));
      },
      marketplaceId: function () {
        var match  = string.match(/^[A-Z0-9]+$/);
        var length = {'United States of America':13}[region()];
        return ((match) && (match[0].length === length));
      },
      select: function () {
        return (el[0].selectedIndex > 0);
      },
      checkbox: function () {
        return el[0].checked;
      },
      phone: function () {
        return (nullBool(string.replace(/\s|\(|\)|\-/g,'').match(/^([0-9]{7}|[0-9]{10})$/)));
      },
      number: function () {
        return nullBool(string.match(/^[0-9\.\,]+$/));
      }
    }
    return exe[getType()]();
  }; // contentsValid

  return {
    confirm: function (el) {

      function condition(el) {
        var bool = dingo.get(el).find('form-validate').condition||false;
        if (bool && el.val().length > 0) {
          return el;
        } else {
          return false;
        }
      }

      function dependency(el) {
        // Needs to use recursion to climb the dependency tree to determine whether or not
        // the element is dependent on anything
        var dep = $('#' + dingo.get(el).find('form-validate').dependency);
        if (dep.size() > 0) {
          return dep;
        } else {
          return false;
        }
      }

      function confirm(el) {
        var match = $('#' + dingo.get(el).find('form-validate').confirm);
        if (match.size()) {
          return match;
        } else {
          return false;
        }
      }

      function normal(el) {
        var check = dingo.get(el).find('form-validate');
        var out = true;
        var attr = ['condition','dependency','confirm'];
        $.each(attr,function (i,k) {
          if (typeof check[k] === 'string' || check[k]) {
            out = false;
          }
        });
        return out;
      }

      function validate(el) {
        var group = getGroup(el);
        function exe(el,bool) {
          if (bool) {
            el.removeClass('_invalid');
            group.label.addClass('_fulfilled');
            animate(group.prompt).end();
            group.prompt.removeClass('_active');
          } else {
            el.addClass('_invalid');
            group.label.removeClass('_fulfilled');
          }
        }
        return {
          condition: function () {
            exe(el,isValid(el));
          },
          dependency: function (match) {
            if (normal(match) || condition(match)) {
              exe(el,isValid(el));
            }
          },
          confirm: function (match) {
            if (el.val() === match.val()) {
              exe(el,true);
            } else {
              exe(el,false);
            }
          },
          normal: function () {
            exe(el,isValid(el));
          }
        }
      }

      if (condition(el)) {
        validate(el).condition();
      } else if (dependency(el)) {
        validate(el).dependency(dependency(el));
      } else if (confirm(el)) {
        validate(el).confirm(confirm(el));
      } else if (normal(el)) {
        validate(el).normal();
      }
    },
    get: function () {
      return form.find('[data-dingo*="form-validate"]').not('[data-dingo*="form-validate_submit"]');
    },
    init: function (base, confirm) {
      if (el.size() > 0) {
        parameters.bool = bool;
        formValidate(el).fufilled();
        return formValidate(el);
      } else {
        return false;
      }
    },
    is: function () {
      return (form.find('.form-validate').size() < 1);
    },
    check: function () {
      var el;
      formValidate(form).get().each(function () {
        formValidate(form).confirm($(this));
      });
      return form.find('._invalid');
    },
    submit: function (event) {
      var out = true;
      var requiredField = formValidate(form).check();
      if (requiredField.size() > 0) {
        requiredField.each(function () {
          var group = getGroup($(this));
          group.prompt.addClass('_active');
          group.prompt.css('top',group.container.outerHeight() + 'px');
          if (typeof animate === 'function') {
            animate(group.prompt).start();
          }
        })
        if (requiredField.eq(0).closest('[class*="modal"]').size() < 1) {
          if (typeof animate === 'function') {
            if (!dingo.isMobile()) { 
              animate(requiredField.eq(0)).scroll(); 
            }
          }
          requiredField.eq(0).focus();
        }
        out = false;
      }
      return out;
    }
  }
};

var formValidateEvents = {}

formValidateEvents['form-validate_submit'] = function (options) {
  if (!formValidate(options.el.closest('.form-validate-container')).submit()) {
    options.event.preventDefault();
  }
}

dingo.click['form-validate'] = function (options) {
  if (options.el.attr('type') === 'checkbox') {
    formValidate(options.el.closest('.form-validate-container')).confirm(options.el);
  }
}

dingo.change['form-validate'] = function (options) {
  if (options.el[0].tagName === 'SELECT') {
    formValidate(options.el.closest('.form-validate-container')).confirm(options.el);
  }
}

dingo.keyup['form-validate'] = function (options) {
  formValidate(options.el.closest('.form-validate-container')).confirm(options.el);
}

dingo.click['form-validate_submit'] = function (options) {
  formValidateEvents[options.dingo](options);
}

dingo.touchstart['form-validate_submit'] = function (options) {
  formValidateEvents[options.dingo](options);
}