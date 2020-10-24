"use strict"
// I found the set of special characters that are understood as password special characters here:
// https://owasp.org/www-community/password-special-characters 
// This comes off as potentially dodgy but
// 1) the assignment was not precise in the exact character set and
// 2) this could be tweaked simply by putting different characters in the below literal string
// also note that immediately under the table on the webpage is a literal string that is composed of these characters
// my string differs because the given string does not account for javascript escaping which is necessary for the
// quote and backslash character

var specialCharacters     = " !\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~".split("");
var lowercaseCharacters   = "abcdefghijklmnopqrstuvwxyz".split("");
var uppercaseCharacters   = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
var numericCharacters     = "0123456789".split("");

function assembleAggrigateArray(setSelectionArray, allCharSets)
{
  var ret = new Array();
  var numSets = Math.min(setSelectionArray.length, allCharSets.length)

  // i'm NOT appending the contents of the charsets.  I am just making an array of arrays
  for(var i = 0; i<numSets; ++i)
  {
    if(setSelectionArray[i])
    {
      ret.push(allCharSets[i]);
    }
  }
  return ret;
}

function pickRandFromAgrigateArrayWithEachSetWeighedEqually(aggArr)
{
  var ret = null;
  // floor assures that I round down from a float that will range: 0 <= n < length and hence is suitable for an index
  var whichSet = Math.floor(Math.random() * aggArr.length)
  var set = aggArr[whichSet];

  return set[Math.floor(Math.random() * set.length)]
}

function pickRandomCharacter(aggArr)
{
  // this is a little silly since i'm just calling a different function by another name.
  // If this were C, it could be justified in that this function call would probably be inlined
  // such that each callsite of this function would sctually do a direct call to pickRandFromAgrigate as done below.
  // This would eliminate the unnecessary overhead of the intermediate do-nothing function
  // HOWEVER, in javascript, the optimization of the runtime should be minimal as to avoid the build overhead that a compiler
  // can afford spending.  Hence, optimization is minimal in javascript engines and so javascript code should be written with this in consideration
  // And I *have* taken this into consideration.  The cost is close to nothing an this is not run in any tight loops.
  // furthermore, I ultimately want the caller to name this in terms of my objective instead of my strategy to achieve it
  // which the following function was named for the purpose of understanding my code strategy
  return pickRandFromAgrigateArrayWithEachSetWeighedEqually(aggArr);
}

var generateBtn = null;

function isNode()
{
  return ((typeof process) === 'object');
}

function assert(x)
{
  if(!x)
  {
    throw "FAIL: " + x + " isn't true.  And UR ugly.";
  }
}

// main
if(!isNode()) {
  // browser main
  browserMain();
}
else
{
  nodeMain();
}

function nodeMain()
{
  console.log("Node is running.  If the script just completes silently then nothing below blew up.");
  
  play();
  tests();
}

function play()
{
    playGeneratePasswordLogical();
}

function deepArrayEquals(a, b)
{
  if (Array.isArray(a)){
    return (Array.isArray(b) && 
    a.length === b.length &&
    a.every((val, index) => deepArrayEquals(val, b[index])) );
  }
  return a === b;
}

function tests()
{
  testDeepArrayEquals();
  testAssembleAggrigateArray();
  testPasswordHasAtLeastOneOfSet();
  testVerifyPasswordContainsAtLeastOneCharOfEachSet();
}

function testVerifyPasswordContainsAtLeastOneCharOfEachSet()
{
  assert( verifyPasswordContainsAtLeastOneCharOfEachSet("ab1",[['a','b','c'], ['0','1','2']]));
  assert(!verifyPasswordContainsAtLeastOneCharOfEachSet("ab1",[['a','b','c'], ['!','@','#']]));
}

function testPasswordHasAtLeastOneOfSet()
{
  assert(passwordHasAtLeastOneOfSet("1234567a89", ["a","b","c"]));
}

/* 
Randomness makes strict comparisons for testing difficult to impossible here.
So I'll spit it out to the screen and eyeball it.  Meh.
*/
function playGeneratePasswordLogical()
{
  var wantLowercase = true, wantUppercase = true, wantNumeric=true, wantSpecialCharacters=true;

  var pw = generatePasswordLogical(6, wantLowercase, wantUppercase, wantNumeric, wantSpecialCharacters);
  console.log("pw = ", pw);
}

function testDeepArrayEquals()
{
  assert(deepArrayEquals(1,1));
  assert(deepArrayEquals([],[]));
  assert(!deepArrayEquals(1,[]));
  assert(deepArrayEquals([1,2,3,4,5],[1,2,3,4,5]));
  assert(!deepArrayEquals([1,2,3,4,5],[1,2,3,4,6]));
}

function testAssembleAggrigateArray()
{
  var aggregateArray0 = assembleAggrigateArray(
    [true, false, false, false],
    [[1,2,3,4,5], [], [], [] ]);

  assert(deepArrayEquals(aggregateArray0, [ [1,2,3,4,5] ] ));
}

function generatePasswordLogical(passwordSize, wantLowercase, wantUppercase, wantNumeric, wantSpecialCharacters)
{
  // although the UI will ensure that the given password size falls in the range [8,128], for the purpose of the logical function,
  // I just check my logical precondition so that my loop functions correctly
  if((passwordSize >= 1) && !wantLowercase && !wantUppercase && !wantNumeric && !wantSpecialCharacters)
  {
    return null;
  } 
  var aggregateArray = assembleAggrigateArray(
    [wantSpecialCharacters, wantLowercase, wantUppercase, wantNumeric],
    [specialCharacters, lowercaseCharacters, uppercaseCharacters, numericCharacters]);

  var generatedPassword = "";

  // I toss and regenerate the password from scratch each time I generate one if the generated password is found not to contain at least
  // one character from each allowed set.  This is safe for passwords in length from range [8,128] with at most 4 possible sets but if I had 
  // more mutually exclusive sets that I had characters for a password then this could never be fulfilled and would loop forever.
  // As-is, i'm potentially burning more cycles than strictly necessary but I think this is good-faith randomness to restart anew from a 
  // password that doesn't cut it.
  while(!verifyPasswordContainsAtLeastOneCharOfEachSet(generatedPassword, aggregateArray))
  {
    generatedPassword = "";
    for(var i=0; i<passwordSize; ++i)
    {
      var newchar = pickRandomCharacter(aggregateArray);
      generatedPassword+=newchar;
    }
  }
  
  return generatedPassword;
}

function passwordHasAtLeastOneOfSet(password, set)
{
  for(var i=0; i<set.length; ++i)
  {
    var charFromSet = set[i];
    if(password.includes(charFromSet)){
      return true;
    }
  }
  return false;
}

function verifyPasswordContainsAtLeastOneCharOfEachSet(password, sets)
{
  for(var i=0; i<sets.length; ++i)
  {
    if(!passwordHasAtLeastOneOfSet(password, sets[i]))
    {
      return false;
    }
  }
  // if I haven't returned yet, then all the sets have checked out 
  // otherwise the function would have returned in the loop with a false
  return true;
}





//////////////////////////////////////
// Browser UI stuff goes below here //
//////////////////////////////////////

function generatePassword()
{
  var passwordSize = NaN;
  
  while(isNaN(passwordSize))
  {
    var passwordSizeString = prompt("How many characters should your password be?  Allowed range 8-128");
    passwordSize = parseInt(passwordSizeString);
    if(!isNaN(passwordSize) && (passwordSize < 8 || passwordSize > 128)) {
      alert("Your password length is out of range.  You may choose anywhere from 8 to 128 characters");
      passwordSize = NaN; // stay in the while loop so I ask again
    }
  }
  var wantLowercase = confirm("Do you want lowercase letters in your password?");
  var wantUppercase = confirm("Do you want uppercase letters in your password?");
  var wantNumeric = confirm("Do you want numeric characters in your password?");
  var wantSpecialCharacters = confirm("Do you want special characters in your password?");
  var password = generatePasswordLogical(passwordSize, wantLowercase, wantUppercase, wantNumeric, wantSpecialCharacters);
  if(!password) {
    alert("Your password criteria is bad.  I need a positive integer size and at least one of the character-sets.");
    return generatePassword();
  }
  return password;
}

// Write password to the #password input
function writePassword() {
  var password = generatePassword();
  var passwordText = document.querySelector("#password");
  passwordText.value = password;
}

function browserMain()
{
  generateBtn = document.querySelector("#generate");
  // Add event listener to generate button
  generateBtn.addEventListener("click", writePassword);
}