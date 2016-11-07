export function valid(email) {
  var bool=true;
  var string= email.split('.');

  if( string.length != 4) bool=false;
  if(string[1].length!=21)bool=false;
  if(string[1].substr(string[1].length - 11)!="fh-salzburg")bool=false;
  if(string[2]!="ac")bool=false;
  if(string[3]!="at")bool=false;

  return bool;
}

export function degreeProgram(email) {
  var string= email.split('.');
  var degree= string[1].substr(0,3);

  return degree.toUpperCase();
}

export function level(email) {
  var string= email.split('.');
  var char= string[1].substr(4,1);
  var lvl ="";
  if(char=="m")lvl="MA";
  if(char=="b")lvl="BA";
  return lvl;
}

export function graduationYear(email) {
  var string= email.split('.');
  var year;
  if(level(email)=="BA")  year= parseInt(string[1].substr(5,4))+3;
  if(level(email)=="MA")year= parseInt(string[1].substr(5,4))+2;
  return year;
}
