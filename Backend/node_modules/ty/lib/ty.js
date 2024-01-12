var fs = require('fs');
var path = require('path');
var init = true;

var ty = module.exports = global.ty = function() {
    if(arguments.length == 1 && arguments[0] instanceof Array) {
        return ty.require(arguments[0]);
    }
    else if(arguments.length == 2 && "string" == typeof arguments[0] && "string" != typeof arguments[1]) {
        return ty.func(arguments[0], arguments[1]);
    }
    else if(arguments.length == 1 && "string" == typeof arguments[0]) {
        return ty.module(arguments[0]);
    }
    else if(arguments.length == 2 && "string" == typeof arguments[0] && "string" == typeof arguments[1]) {
        return ty.module(arguments[0], arguments[1]);
    }
    else if(arguments.length == 0 && init) {
        init = false;

        for(var i in ty.data.modules) {
            ty.data.modules[i].out = {};
        }

        for(var i in ty.data.modules) {
            (function(name, module){
                ty.data.moduleName = name;
                module.start = module.end = null;
                module.m = require(module.filename);

                fs.watchFile(module.filename, function(curr, prev) {
                    if(module.end) module.end();
                    ty.data.moduleName = name;
                    module.start = module.end = null;
                    for(var j in module.out) delete module.out[j];
                    delete require.cache[module.filename];
                    module.m = require(module.filename);
                    if(module.start) module.start();
                });
            })(i, ty.data.modules[i]);
        }

        for(var i in ty.data.modules) {
            if(ty.data.modules[i].start) ty.data.modules[i].start();
        }

        return ty;
    }
    else if(arguments.length == 0) {
        var ev = '';
        ev += 'var ty = function() { '
           +  'var arg = ["' + global.ty.data.moduleName + '"];'
           +  'for(var i in arguments) arg.push(arguments[i]);'
           +  'return global.tty.apply(null, arg);'
           +  '}; \n'

        for(var i in ty.data.requires) {
            ev+= 'var ' + i + ' = global.ty.data.requires.' + i + '; \n';
        }

        for(var i in ty.data.functions) {
            ev+= 'var ' + i + ' = global.ty.data.functions.' + i + '; \n';
        }

        var prefixs = {};
        for(var i in ty.data.modules) {
            if(ty.data.modules[i].prefix && !prefixs[ty.data.modules[i].prefix])
                ev+= 'var ' + ty.data.modules[i].prefix + ' = {}; \n', prefixs[ty.data.modules[i].prefix] = true;
        }

        for(var i in ty.data.modules) {
            if(!ty.data.modules[i].prefix)
                ev+= 'var ' + i + ' = global.ty.data.modules["' + i + '"].out; \n';
            else if(ty.data.modules[ty.data.moduleName].prefix == ty.data.modules[i].prefix)
                ev+= 'var ' + ty.data.modules[i].name + ' = global.ty.data.modules["' + i + '"].out; \n';
            if(ty.data.modules[i].prefix)
                ev+= i + ' = global.ty.data.modules["' + i + '"].out; \n';
            if(ty.data.moduleName == ty.data.modules[i].name)
                ev+= 'var me = global.ty.data.modules["' + i + '"].out; \n'; 
        }

        return ev;
    }
};

ty.data = {
    moduleName: '',
    requires: {},
    functions: {},
    modules: {},
};

ty.out = {

};

ty.require = function(files) {
    if(!(files instanceof Array)) files = [files];

    for(var i in files) {
        var name, path;

        if(files[i].indexOf('=') != -1) {
            name = files[i].split('=')[0];
            path = files[i].split('=')[1];
        } else {
            name = path = files[i];
        }

        ty.data.requires[name] = require(path);
    }

    return ty;
};

ty.func = function(name, func) {
    ty.data.functions[name] = func;

    return ty;
};

ty.module = function(filename, prefix) {
    var dirname = path.dirname(process.mainModule.filename);
    filename = path.resolve(dirname, filename);

    if(fs.existsSync(filename))
    {
        var stats = fs.lstatSync(filename);

        if(stats.isDirectory()) {
            if(!prefix) prefix = path.basename(filename);
            var files = fs.readdirSync(filename);
            for(var i in files)
                ex(path.resolve(filename, files[i]));
        }
        else {
            ex(filename);
        }
    }

    function ex(filename) {
        var basename = path.basename(filename, path.extname(filename));
        var name = basename;
        if(prefix) name = prefix + '.' + name;

        ty.data.modules[name] = {
            prefix: prefix,
            filename: filename,
            name: basename
        };
    }

    return ty;
};

var tty = global.tty = function() {
    if(arguments.length == 2 && "function" == typeof arguments[1]) {
        if(ty.data.modules[arguments[0]].start == null)
            ty.data.modules[arguments[0]].start = arguments[1];
        else
            ty.data.modules[arguments[0]].end = arguments[1];
    }
    else if(arguments.length == 3 && "string" == typeof arguments[1]) {
        ty.data.modules[arguments[0]].out[arguments[1]] = arguments[2];
    }
};