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
  // even distribution of integers in [0,3]
  var whichSet = Math.floor(Math.random() * 4);
  var retchar = null;
  switch(whichSet)
  {
    case 0: retchar = pickRandomCharacter(specialCharacters);
    case 1: retchar = pickRandomCharacter(specialCharacters);
    case 2: retchar = pickRandomCharacter(specialCharacters);
    case 3: retchar = pickRandomCharacter(specialCharacters);
  }

  console.log("whichSet = " + whichSet);
  
  return 'a';
}

// Write password to the #password input
function writePassword() {
  var password = generatePassword();
  var passwordText = document.querySelector("#password");
  passwordText.value = password;
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
  generateBtn = document.querySelector("#generate");
  // Add event listener to generate button
  generateBtn.addEventListener("click", writePassword);
}
else
{
  // node main
  console.log("Node is running.  If the script just completes silently then nothing below blew up.");
  
  //stuff();
  tests();
}

function stuff()
{
  var meh = generatePasswordLogical(true, false, false, false);
  console.log("meh = " + meh);

  var aggregateArray = assembleAggrigateArray(
    [true, false, false, false],
    [[1,2,3,4,5], [], [], [] ]);

    console.log("aggrigateArray = " + aggregateArray);
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
  if(!wantLowercase && !wantUppercase && !wantNumeric && !wantSpecialCharacters)
  {
    return null;
  } 
  var aggregateArray = assembleAggrigateArray(
    [wantSpecialCharacters, wantLowercase, wantUppercase, wantNumeric],
    [specialCharacters, lowercaseCharacters, uppercaseCharacters, numericCharacters]);

  var generatedPassword = "";
  for(var i=0; i<passwordSize; ++i)
  {
    var newchar = pickRandFromAgrigateArrayWithEachSetWeighedEqually(aggregateArray);
    generatedPassword.push(newchar);
  }
  
  return "fakepassword - doesn't work yet";
}

function generatePassword()
{
  var wantLowercase = !!prompt("Do you want lowercase letters in your password?");
  var wantUppercase = !!prompt("Do you want uppercase letters in your password?");
  var wantNumeric = !!prompt("Do you want numeric characters in your password?");
  var wantSpecialCharacters = !!prompt("Do you want special characters in your password?");
  return generatePasswordLogical(wantLowercase, wantUppercase, wantNumeric, wantSpecialCharacters)
}