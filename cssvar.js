const type = require('jsdoc/tag/type');
function addHiddenProperty(obj, propName, propValue) {
    /*Object.defineProperty(obj, propName, {
        value: propValue,
        writable: true,
        enumerable: Boolean(jsdoc.env.opts.debug),
        configurable: true
    });
    */
}
exports.handlers = {
  newDoclet: function({ doclet }) {
    if (doclet.tags && doclet.tags.length > 0) {
      doclet.tags.forEach(tag => {

        if (tag.title !== 'cssvar')
          return
        tag.value = {};
        if(!doclet.cssvars)
          doclet.cssvars = [];
        let tagType = type.parse(tag.text, true, true);
        // It is possible for a tag to *not* have a type but still have
        // optional or defaultvalue, e.g. '@param [foo]'.
        // Although tagType.type.length == 0 we should still copy the other properties.
        if (tagType.type) {
            if (tagType.type.length) {
                tag.value.type = {
                    names: tagType.type
                };
                addHiddenProperty(tag.value.type, 'parsedType', tagType.parsedType);
            }

            ['optional', 'nullable', 'variable', 'defaultvalue'].forEach(function(prop) {
                if (typeof tagType[prop] !== 'undefined') {
                    tag.value[prop] = tagType[prop];
                }
            });
        }

        if (tagType.text && tagType.text.length) {
            tag.value.description = tagType.text;
        }

        //if (tagDef.canHaveName) {
            // note the dash is a special case: as a param name it means "no name"
            if (tagType.name && tagType.name !== '-') {
              tag.value.name = tagType.name;
            }
        //}

        //console.log("tag", tag)
        doclet.cssvars.push(tag.value);
      })
    }
  }
}