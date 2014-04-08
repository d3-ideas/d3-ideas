START "runas /user:administrator" cmd /K "cd C:\mongodb\bin\ & mongod"

TIMEOUT 3

START "runas /user:administrator" cmd /K "cd C:\GitHub\d3-ideas\Storage\ & nodemon app"

TIMEOUT 3

START "runas /user:administrator" cmd /K "cd C:\GitHub\d3-ideas\WebServer\ & nodemon app"

timeout 3

"C:\Program Files (x86)\Brackets\Brackets.exe"