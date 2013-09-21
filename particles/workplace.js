
Inheritance_Manager = {};   

Inheritance_Manager.extend = function (subClass, baseClass) { 
  
  function inheritance() { }
  inheritance.prototype = baseClass.prototype;
  subClass.prototype = new inheritance();
  subClass.prototype.constructor = subClass;
  subClass.baseConstructor = baseClass;
  subClass.superClass = baseClass.prototype;

}  



