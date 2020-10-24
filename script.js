

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
  generateBtn = document.querySelector("#generate");
  // Add event listener to generate button
  generateBtn.addEventListener("click", writePassword);
}
else
{
  // node main
  console.log("Node is running.  If the script just completes silently then nothing below blew up.");
  
  assert(aFunctioinWithNoRuntimeBrowserDependencies_ThisJustDoublesTheArgument(5) == 10);
}

function aFunctioinWithNoRuntimeBrowserDependencies_ThisJustDoublesTheArgument(x)
{
  return x * 2;
}

function generatePassword()
{
  return "fakepassword - doesn't work yet";
}