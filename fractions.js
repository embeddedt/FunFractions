/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var MATH_REDUCE = -1;
var MATH_ORDER = -2;
var MATH_PLUS = 0;
var MATH_MINUS = 1;
var MATH_TIMES = 2;
var MATH_DIVIDE = 3;

var numAnswered, numCorrect;

var firstFraction = [ 0, 0 ];

var secondFraction = [ 0, 0 ];

var orderFractions, orderFractionVals;

var sameDenominators = true;

var isMixedMode = false;

var mathOperation = 0;

var operationHtml = [
    "&plus;",
    "&minus;",
    "&times;",
    "&divide;"
];

var operationInstructions = [
    "Choose the correct ordinal number for each fraction, from smallest to greatest.",
    "Reduce as much as possible.",
    "Add the two fractions.",
    "Subtract the two fractions.",
    "Multiply the two fractions together.",
    "Divide the two fractions."
];

$.fn.fractionNumerator = function() {
    return this.find(".fraction-numerator");
};

$.fn.fractionDenominator = function() {
    return this.find(".fraction-denominator");
};

$.fn.fractionReadOnly = function(setOn) {
    var $parts = this.find(".fraction-part");
    if(setOn === undefined)
        setOn = true;
    $parts.attr("readonly", setOn);
    if(setOn)
        $parts.addClass("fraction-part-readonly");
    else
        $parts.removeClass("fraction-part-readonly");
};

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


function vh(v) {
  var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
  return (v * h) / 100;
}

function vw(v) {
  var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
  return (v * w) / 100;
}

function vmin(v) {
  return Math.min(vh(v), vw(v));
}

function vmax(v) {
  return Math.max(vh(v), vw(v));
}


function isPrime(num) {
    for(var i = 2, s = Math.sqrt(num); i <= s; i++)
        if(num % i === 0) return false; 
    return num > 1;
}

function getRandomNonPrime(min, max) {
    var i;
    do {
        i = getRandomInt(min, max);
    } while(isPrime(i));
    return i;
}

function fractionVal(array) {
    console.log(array[0]);
    console.log(array[1]);
    return (array[0] / array[1]);
}

function valExists(val, maxIndex) {
    for(var i = 0; i <= maxIndex; i++) {
        if(orderFractionVals[i] === val)
            return true;
    }
    return false;
}

function updateFractions() {
    if(isMixedMode)
        $("#mixed-part").show();
    else
        $("#mixed-part").hide();
    
    orderFractions = [
        [ 0, 0 ],
        [ 0, 0 ],
        [ 0, 0 ],
        [ 0, 0 ]
    ];

    orderFractionVals = [ undefined, undefined, undefined, undefined ];

    if(mathOperation === MATH_ORDER) {
        for(var i = 0; i < 4; i++) {
            var $frac = $($("#order-div").children()[i]);
            do {
                orderFractions[i][1] = getRandomInt(2, 6);
                orderFractions[i][0] = getRandomInt(1, orderFractions[i][1] - 1);
                orderFractionVals[i] = orderFractions[i][0] / orderFractions[i][1];
            } while(valExists(orderFractionVals[i], i-1));
            $frac.fractionNumerator().val(orderFractions[i][0]);
            $frac.fractionDenominator().val(orderFractions[i][1]);
        }
        orderFractionVals.sort();
         console.log(orderFractionVals);
        
    }
    else if(mathOperation !== MATH_REDUCE) {
        firstFraction[1] = getRandomNonPrime(3, 16);
        firstFraction[0] = getRandomInt(1, firstFraction[1] - 1);
        $("#aux-parts").show();
        $("#operation").html(operationHtml[mathOperation]);
        if(sameDenominators)
           secondFraction[1] = firstFraction[1];
        else
            secondFraction[1] = getRandomNonPrime(3, 16);
        if(mathOperation === MATH_MINUS) {
            secondFraction[0] = getRandomInt(1, firstFraction[0]);
        } else if(sameDenominators)
            secondFraction[0] = getRandomInt(1, firstFraction[1] - firstFraction[0]);
        else {
            secondFraction[0] = getRandomInt(1, secondFraction[1] - 1);
        }
        $("#first-aux-fraction").fractionNumerator().val(secondFraction[0]);
        $("#first-aux-fraction").fractionDenominator().val(secondFraction[1]);
        
    } else {
        $("#aux-parts").hide();
        firstFraction[1] = getRandomNonPrime(4, 32);
        firstFraction[0] = getRandomInt(1, firstFraction[1] - 1);
    }
   
    
    if(mathOperation !== MATH_ORDER) {
        $("#second-fraction").fractionReadOnly(false);

        $("#first-fraction").fractionNumerator().val(firstFraction[0]);
        $("#first-fraction").fractionDenominator().val(firstFraction[1]);
        $("#second-fraction").fractionNumerator().css({ color: '' });
        $("#second-fraction").fractionNumerator().val("");
        $("#second-fraction").fractionDenominator().css({ color: '' });
        $("#second-fraction").fractionDenominator().val("");

        $("#mixed-part").fractionNumerator().val("");
    }
    $("#the-instructions").css({ color: '' });
    $("#the-instructions").text(operationInstructions[mathOperation+2]);
}

function reduce(numerator,denominator){
  var gcd = function gcd(a,b){
    return b ? gcd(b, a%b) : a;
  };
  gcd = gcd(numerator,denominator);
  return [numerator/gcd, denominator/gcd];
}

function selectMathOperation(num) {
    mathOperation = num;
    if(false) {
        numCorrect = 9;
        numAnswered = 9;
    } else {
        numCorrect = 0;
        numAnswered = 0;
    }
}

$(window).load(function() {
    $("#application").hide();
    $('input[type=radio]').change(function() {
        console.log("Change");
        var op = parseInt($(this).val());
        if(op < 0)
            $("#options").hide();
        else
            $("#options").show();
        if(op >= MATH_TIMES)
            $("#options").hide();
    });
    $("#select-mode").click(function() {
        var $selected = $("input[name=size]:checked");
        var op = parseInt($selected.val());
        if(op === MATH_ORDER) {
            $("#order-div").show();
            $("#general-div").hide();
        } else {
            $("#order-div").hide();
            $("#general-div").show();
        }
        isMixedMode = $("#mixed-fractions").is(":checked");
        console.log("Mixed mode: " + isMixedMode);
        sameDenominators = $("#same-denom").find("input").is(":checked");
        console.log("Same denominator: " + sameDenominators);
        selectMathOperation(op);
        updateFractions();
        $("#next-button").attr("disabled", true);
        $("#check-button").attr("disabled", false);
        $("#num-correct-questions").text(numCorrect);
        $("#num-questions").text(numAnswered);
        $("#selector").hide();
        $("#done").hide();
        $("#application").show();
    });
    $("#next-button").attr("disabled", true);
    $("#next-button").click(function() {
        $("#next-button").attr("disabled", true);
        
        if(numCorrect === 10) {
            $("#application").hide();
            $("#selector").show();
            return;
        }
        
        $("#check-button").attr("disabled", false);
        
        updateFractions();
    });
    $("#check-button").click(function() {
        
        var isCorrect = false;
        var correctNumerator, correctDenominator;
        var m = parseInt($("#mixed-part").fractionNumerator().val());
        var n = parseInt($("#second-fraction").fractionNumerator().val());
        var d = parseInt($("#second-fraction").fractionDenominator().val());
        if(n === undefined || isNaN(n) || d === undefined || isNaN(d))
            return;
        $("#check-button").attr("disabled", true);
        $("#next-button").attr("disabled", false);
        var result = (n / d);
        var expectedResult;
        if(mathOperation === MATH_ORDER) {
            var myVals = [];
            var $selects = $(".ordered-fraction").find("select");
            $selects.each(function(__unused, el) {
                n = parseInt($(el).parent().fractionNumerator().val());
                d = parseInt($(el).parent().fractionDenominator().val());
                var index = parseInt($(el).val());
                var val = n / d;
                console.log("Spinner index: " + index + " val: " + val);
                if(index <= 0)
                    return;

                if(myVals[index] === val)
                    myVals.splice(index, 0, n / d);
                else
                    myVals[index] = val;
            });
            myVals.shift();
            console.log("myVals: " + myVals);
            console.log("thVals: " + orderFractionVals);
            isCorrect = true;
            for(var i = 0; i < 4; i++) {
                if(myVals[i] !== orderFractionVals[i]) {
                    isCorrect = false;
                    break;
                }
            }
        }
        else if(mathOperation !== MATH_REDUCE) {
            switch(mathOperation) {
                case MATH_PLUS:
                    expectedResult = (fractionVal(firstFraction) + fractionVal(secondFraction));
                    break;
                case MATH_MINUS:
                    expectedResult = (fractionVal(firstFraction) - fractionVal(secondFraction));
                    break;
                case MATH_TIMES:
                    expectedResult = (fractionVal(firstFraction) * fractionVal(secondFraction));
                    break;
                case MATH_DIVIDE:
                    expectedResult = (fractionVal(firstFraction) / fractionVal(secondFraction));
                    break;
                default:
                    throw "Undefined math operation";
            }
            var f = new Fraction(expectedResult);
            correctNumerator = f.n;
            correctDenominator = f.d;
            console.log("expected " + expectedResult + " result " + result);
            if(expectedResult.toFixed(5) === result.toFixed(5))
                isCorrect = true;
        } else {
            var reduced = reduce(firstFraction[0], firstFraction[1]);
            correctNumerator = reduced[0];
            correctDenominator = reduced[1];
            console.log("Expected " + reduced[0] + "/" + reduced[1]);
            if(n === reduced[0] && d === reduced[1]) {
                console.log("Correct");
                isCorrect = true;
            }
        }
        numAnswered++;
        var $n = $("#second-fraction").fractionNumerator();
        var $d = $("#second-fraction").fractionDenominator();
        if(isCorrect) {
            numCorrect++;
            if(mathOperation !== MATH_ORDER) {
                $n.add($d).css({ color: 'green' });
                $("#second-fraction").fractionReadOnly(true);
            } else {
                $("#the-instructions").css({ color: 'green' });
                $("#the-instructions").text("Nice work!");
            }
        } else {
            $("#second-fraction").fractionReadOnly(true);
            if(mathOperation !== MATH_ORDER) {
                $n.add($d).css({ color: 'red' });
                $n.val(correctNumerator);
                $d.val(correctDenominator);
            } else {
                $("#the-instructions").css({ color: 'red' });
                $("#the-instructions").text("Nope, that's incorrect.");
            }
        }
        if(numCorrect === 10)
            $("#done").show();
        $("#num-correct-questions").text(numCorrect);
        $("#num-questions").text(numAnswered);
    });
    /*
    $("#selector").hide();
    $("#application").show(); */
    $(window).resize();
});