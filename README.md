This is a beginner NodeJS and MongoDB based project built by me and my friends.Although the product supports all functionality , the design and the implementation is very poor.Also i never looked into
alternatives such as Angular for front end.Using Angular as front end would make the project much more functional and easier for anyone to develop.Another point i would like to implement is clean documentation which means easier rebuild for further development.

Prerequisites
-------------
-Building applications using NodeJS and MongoDB
-Setting up MEAN stack is a good way to go but i felt it was an overkill!!So i didnt setup one.

Steps
-----
The steps here refers to how i would modify the code as phases of transition from an older design to new well designed and implemented product.

Requirements
------------

Metadata of metadata  (Inception: Dream level 2)
--------------------
-An option to enter scheme as part of metadata
-Enter branches which are dependent on scheme like PG scheme changes once in 3 years but UG engineering changes once in 4 years.So based on year selected , branches must be loaded.
-Enter semester which is dependent on branch, because some branches have more semester and some have lesser like Computer Science starts from 3 to 8 but Physics Cycle starts from 1 to 2
-Option for ADD,MODIFY,DELTE

Metadata (Inception:Dream level 1)
--------
(Student Details Entry)
-Enter USN and Name of individual student and DO NOT link students to Branches as they change at times at times it can happen in the most unimaginative ways possible.
-Also the overhead in handling it is not worth it.
-Also option to ADD,MODIFY,DELETE
-----------------------
(Subject Details Entry)
-----------------------
-The subject details are entered with respect to scheme,branch and semester.
-Add the subjects that exist with respect to the branches and also the details of each subjects like
  subjectCode,subjectName,internals(minimum,maximum),externals(minimum,maximum),total(minimum.maximum)
-Option to ADD,DELETE,MODIFY each/group of subjects

Data  (Inception:Real life)
----
(Add student marks)
-----------------
-User inputs scheme which reloads branches.
-User inputs branch which reloads semester.
-User chooses semester and this sets the combination of (scheme,branch,semester)
-This loads all the subjects that have been entered through subject details entry.
-User inputs USN which loads the name.(If name loaded USN verified else USN doesnt exist)
-With the scheme,branch,semester based subjects , User enters marks for the respective USN.
-Option to ADD,DELETE only on each USN marks.MODIFY is handled in the next phase

Data (Again real life level)
----
(Update student marks)
----------------------
-get existing marks from database
(YET TO BE PROPERLY DEFINED!!)

Additional Data (Sleepwalking which is neither complete dream nor complete awake)
----------------
-login using passport in NPM
-College image to display
-Documentation on how to use and how it works completely
