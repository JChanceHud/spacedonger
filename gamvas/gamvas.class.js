/**
 * Copyright (C) 2012 Heiko Irrgang <hi@93i.de>
 * 
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 * 
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */
/*
 * Class: gamvas.Class
 *
 * Description:
 *
 * The basic class for inheritance
 *
 * Use this to make objects that can be extended
 *
 * Note:
 *
 * Compared to classic JavaScript inheritance, this method
 * is a very user friendly but performance costly way, so gamvas
 * uses this class only for objects that you are supposed to overwrite
 * and that are not created on a per frame basis, and so should you
 *
 * See:
 *
 * <gamvas.Actor>
 * <gamvas.ActorState>
 * <gamvas.State>
 *
 * Example:
 *
 * > myExtendableObject = gamvas.Class.extend({
 * >    create: function(param) {
 * >        // call super constructor
 * >        this._super(param);
 * >        // do our constructor stuff
 * >        this._par = param;
 * >    },
 * >    debug: function() {
 * >        console.log(this._par);
 * >    }
 * > });
 * > var obj = new myExtendableObject('test');
 * > obj.debug();
 */
(function() {
    var objCounter = 1;
    var creating = false;
    gamvas.Class = function(){};
    gamvas.Class.prototype.objectID = function() {
        if (typeof this.__oid == 'undefined') {
            this.__oid = objCounter++;
        }
        return this.__oid;
    };
    gamvas.Class.extend = function(prop) {
        var _super = this.prototype;
        creating = true;
        var p = new this();
        creating = false;
        for (var name in prop) {
            if ( (typeof _super[name] == 'function') && (typeof prop[name] == 'function') ) {
                p[name] = (function(name, fn){
                    return function() {
                    var tmp = this._super;
                    this._super = _super[name];
                    var ret = fn.apply(this, arguments);       
                    this._super = tmp;
                   
                    return ret;
                };})(name, prop[name]);
            } else {
                p[name] = prop[name];
            }
        }
        ret = function() {
            if ( (!creating) && (typeof this.create == 'function') ) {
                this.create.apply(this, arguments);
            }
        };
        ret.prototype = p;
        ret.prototype.constructor = gamvas.Class;
        ret.extend = this.extend;
        return ret;
    };
})();
/*
 * Function: extend
 *
 * Description:
 *
 * Exend a class
 *
 * Parameters:
 *
 * A object defining the extending class
 *
 * Returns:
 *
 * A new class to be used for instancing
 *
 * Note:
 *
 * The special function 'create' is used as constructor. If you overwriting 'create'
 * you always should call 'this._super(params)' as first command in 'create'
 */
