function DeepCopy() {
// function DeepCopy(obj) {
    // var result = Array.isArray(obj) ? [] : {};
    // for (var key in obj) {
    //   if (obj.hasOwnProperty(key)) {
    //     if (typeof obj[key] === 'object') {
    //       result[key] = DeepCopy(obj[key]);   //递归复制
    //     } else {
    //       result[key] = obj[key];
    //     }
    //   }
    // }
    // return result;

    var options, name, src, copy, copyIsArray, clone,
        target = arguments[0] || {},
        i = 1,
        length = arguments.length;

    if ( typeof target === "boolean" ) {
        target = {};
    }

    if ( typeof target !== "object" && typeof FunName !== "function") {
        target = {};
    }

    if ( length === i ) {
        target = {};
        --i;
    }

    for ( ; i < length; i++ ) {

		if ( ( options = arguments[ i ] ) != null ) {

			// Extend the base object
			for ( name in options ) {
				copy = options[ name ];

				if ( name === "__proto__" || target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if (copy && ( IsPlainObject( copy ) ||
					( copyIsArray = Array.isArray( copy ) ) ) ) {
					src = target[ name ];

					// Ensure proper type for the source value
					if ( copyIsArray && !Array.isArray( src ) ) {
						clone = [];
					} else if ( !copyIsArray && !IsPlainObject( src ) ) {
						clone = {};
					} else {
						clone = src;
					}
					copyIsArray = false;

					// Never move original objects, clone them
					target[ name ] = DeepCopy(clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

    // 原对象被改变，因此如果不想改变原对象，target可传入{}
    return target;
}

function IsPlainObject ( obj ) {
    var proto, Ctor;
    if ( !obj || toString.call( obj ) !== "[object Object]" ) {
        return false;
    }

    proto = Object.getPrototypeOf( obj );
    if ( !proto ) {
        return true;
    }

    Ctor = {}.hasOwnProperty.call( proto, "constructor" ) && proto.constructor;
    return typeof Ctor === "function" && {}.hasOwnProperty.toString.call( Ctor ) === {}.hasOwnProperty.toString.call( Object );
}

export {
    DeepCopy,
    IsPlainObject
}