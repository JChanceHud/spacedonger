// Binary heap implementation in JS
//

exports.BinaryHeap = function(score){
    this.array = [];
    this.score = score;
};

exports.BinaryHeap.prototype.push = function(object){
    this.array.push(object);
    this.moveUp(this.array.length - 1);
};

exports.BinaryHeap.prototype.pop = function(){
    var r = this.array[0];

    var last = this.array.pop();
    if(this.array.length > 0){
        this.array[0] = last;
        this.moveDown(0);
    }
    return r;
};

exports.BinaryHeap.prototype.remove = function(object){
    var length = this.array.length;

    for(var i = 0; i < length; i++){
        if(this.array[i] !== object) continue;

        var last = this.array.pop();
        if(i === length - 1) break; //the object being removed happened to be the last one

        this.array[i] = last;
        this.moveUp(i);
        this.moveDown(i);
        break;
    }
};

exports.BinaryHeap.prototype.size = function(){
    return this.array.length;
};

exports.BinaryHeap.prototype.rescore = function(object){
    var length = this.array.length;
    for(var i = 0; i < length; i++){
        if(this.array[i] !== object) continue;

        this.moveUp(i);
        this.moveDown(i);
        break;
    }
};

exports.BinaryHeap.prototype.moveUp = function(index){
    if(this.array.length === 1)
        return;
    var object = this.array[index];
    var score = this.score(object);
    while(index > 0){
        var parentIndex = Math.floor(((index + 1) / 2) - 1);
        p = this.array[parentIndex];
        if(score >= this.score(p)) break;

        this.array[parentIndex] = object;
        this.array[index] = p;
        index = parentIndex;
    }
};

exports.BinaryHeap.prototype.moveDown = function(index){
    if(this.array.length === 1)
        return;
    var length = this.array.length;
    var object = this.array[index];
    var score = this.score(object);
    var c1Score, c2Score;
    for(;;){
        var c2Index = (index + 1)*2;
        var c1Index = c2Index-1;

        var swap = null;
        if(c1Index < length){
            var c1 = this.array[c1Index];
            c1Score = this.score(c1);
            if(c1Score < score){
                swap = c1Index;
            }
        }
        if(c2Index < length){
            var c2 = this.array[c2Index];
            c2Score = this.score(c2);
            if(c2Score < (swap===null?score:c1Score)){
                swap = c2Index;
            }
        }
        if(swap===null) break;

        this.array[index] = this.array[swap];
        this.array[swap] = object;
        index = swap;
    }
};

exports.BinaryHeap.prototype.checkIntegrity = function(){
    for(var x = 0; x < this.array.length; x++){
        if(this.array[x] === undefined)
            return false;
    }
    return true;
};
