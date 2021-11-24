# nodejs

This is my personal project. 
I actually started this project as an AGILE group project from my college course but the project was not done by the end of the due date.

I think that is because everyone else and I did not have enough knowledge about back-end side and front-end side.
What I had learnt so far from my college was all about programming and problem solving, algorithms, data structures, mathematics or something like those.
We did not know about what the server does and their connections between APIs, server and server communications, server and front communications.

The main core idea of this project was, I had to send data from front-end side to server-side using jquery ajax. 
Once the server receives the string data, it runs a python script and gives the string data as an argument. 
Then the python script starts to find the result which the word starts exactly same with the string value which comes from the web browser.
Once it is done finding the matching value from the database, it returns the result.
Finally, the server send the result to the front-end.

I decided to start this project again because this is going to be a good opportunity to study about back-end.
We actaully decided to use python flask framework as our server framework but I decided to use Node JS express framework because as a beginner,
Node JS could be a proper way to start learning about server environment.




My goal for this project is, when a user type something into a search box, 
each time oninput method sends JSON data which represents the string value that comes from inside of the search box, to the Node JS server.
Back to college project, we did not use JSON, we used text as a type of data and we did not use Node JS as a server framework.
but now I decided to use JSON because I believe this way would have more compatibility and is helpful as a learning process.

The first thing that I faced with the problem was, the web browser did not send ajax data into server side.
But the problem was solved kind of easily because I did not include jquery script in the html file.

The second problem was, I did not sure if my server receives http request properly.
This is done by using the variable such as 'req.query.country'.

Next problem was, running python script from Node JS.
I found the way to do it using pythonshell but I still have a problem with returning the result part.

The last problem is, if I get the result, the 




