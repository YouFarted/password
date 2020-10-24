

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
  
  assert(generatePasswordLogical(true, false, false, false) === "fakepassword - doesn't work yet");
}

function generatePasswordLogical(wantLowercase, wantUppercase, wantNumeric, wantSpecialCharacters)
{
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