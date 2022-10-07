# DA2002-WebGame
This is my final project for course DA2002(NUS). It is a game called Coin Collector. The player is able to control the basket by dragging it around. The goal is to collect the coins falling from the top as many as possible in 60 seconds. Beside coins, there are also bombs and rubbish which are made to make trouble during the game.

I chose a beautiful image for the background and used grid layout with styled borders for the webpage design. The page has 4 parts in total:
1. The navigation bar contains the rules of the game displayed using unordered list as well as leaderboard displayed using ordered list.
2. The artical part is for the main SVG Canvas.
3. The side bar on the right shows the score, best score and remaining time of the game.
4. The footer contains function buttons (start/end the game, restart the game, control the backgound music) and 3 radio buttons for different difficulty levels.

To make the game more interesting, I added 3 other functions: 
1. Able to change the difficulty level of the game. To achieve this, the radio buttons will be checked and reinitialze the values of the generating rate and falling speed variables in startGame function. There are 3 modes: easy, medium and difficult. 
2. Sound. There will be different audios for the collision of different items. There will also be background music which can be controlled by a button. 
3. Leaderboard where shows the top 3 players with their usernames (when first load the page, the player will be asked to enter a username) and best scores. To achieve this, I made the browser to store these variables if the best score is higher than one of those on the leaderboard. The comparsion is done in endGame/dead function and leaderboard will be updated by changing the innerHTML. I also added a few codes to initialize the variables for the leaderboard if the game is played the first time on a browser. In this way, if different players play my game on the same browser, they can compete with each other!
