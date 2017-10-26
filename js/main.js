window.addEventListener("DOMContentLoaded", function () {

  // variable for: setInterval = for game loop
  let gameLoop;
  // fps
  let fps = 50;

  let playing = false;
  let reset = true;
  let gameOver = false;

  // SOUND
  let sound = true;
  let laserSound = [new Audio("sound/laserShot.mp3"), new Audio("sound/laserShot.mp3"), new Audio("sound/laserShot.mp3"), new Audio("sound/laserShot.mp3")];
  let helpLaserSound = 0;
  let explosionSound = [new Audio("sound/explosionShort.mp3"), new Audio("sound/explosionShort.mp3"), new Audio("sound/explosionShort.mp3"), new Audio("sound/explosionShort.mp3")]
  let helpExplosionSound = 0;
  let soundButton = document.getElementById("soundButton");

  // BUTTONS
  let startButton = document.getElementById("startButton");
  let continueButton = document.getElementById("continueButton");
  let resetButton = document.getElementById("resetButton");
  let buttonContainer = document.getElementById("buttonContainer");

  // variable of image of space ship
  let spaceShip = document.getElementById("mainSpaceShip");
  let spaceShipLeft = 0;
  let spaceShipTop = 0;

  // SPEED OF SHIP = movement int pixels in the game loop
  let speedOfShip = 10;
  // SPEED OF LASER
  let laserSpeed = 15;
  // SPEED OF PLANETS
  let planetSpeed = 3;
  // SPEED OF ENEMY
  let enemySpeed = 3;
  // SPEED OF ENEMY LASER
  let enemyLaserSpeed = 8;
  // POINTS FOR SHOOTING ENEMY
  let enemyScorePoint = 10;
  // TOTAL SCORE
  let totalScore = 0;
  // SHIELD HIT 
  let enemyHitShield = 5;
  // TOTAL SHIELD
  let totalShield = 100;
  // VARIABLE for LEVEL
  let level = 1;

  // HELP VARIABLES for PLANET COORDINATES, for creating enemy ship(so ship is not over planet)
  let lastPlanetLeftMin = 0;
  let lastPlanetLeftMax = 0;
  let lastEnemyLeftMin = 0;
  let lastEnemyLeftMax = 0;


  // Help variable for laser shot
  let helpLaser = 0;
  // Help variable for planet creating
  let helpPlanet = 0;
  let helpPlanetVar = 5000;
  // Help variables for enemy
  let helpEnemy = 0;
  let helpEnemyVar = 1500;
  // Help enemy shoot
  let helpEnemyShoot = 0;

  // DIMENSIONS OF SPACE SHIP (image)
  let spaceShipHeight = spaceShip.height;
  let spaceShipWidth = spaceShip.width;

  // AVAILABLE WIDTH AND HEIGHT OF SCREEN
  let availableWidth = window.innerWidth;
  let availableHeight = window.innerHeight;

  // Setting left distance of SPACE SHIP (img)
  function setLeftDistance() {
    spaceShip.style.left = spaceShipLeft + "px";
  }
  // Setting top distance of SPACE SHIP (img)
  function setTopDistance() {
    spaceShip.style.top = spaceShipTop + "px";
  }



  // CLICKING ON START BUTTON
  startButton.addEventListener("click", function () {

    // Hide Start Button
    startButton.style.display = "none";

    resetButton.style.display = "inline";
    continueButton.style.display = "inline";
    buttonContainer.style.display = "none";
    // show SpaceShip - image
    spaceShip.style.display = "block";

    startGame();
  });

  // RESTART BUTTON
  resetButton.addEventListener("click", function () {
    reset = true;
    gameOver = false;
    document.getElementById("continueButton").style.display = "inline";
    buttonContainer.style.display = "none";
    startGame();
  });

  // CONTINUE BUTTON
  continueButton.addEventListener("click", function () {
    buttonContainer.style.display = "none";
    startGame();
  });

  // SOUND BUTTON
  soundButton.addEventListener("click", function () {
    if (sound) {
      sound = false;
      document.getElementById("soundStatus").innerText = "OFF";
    } else {
      sound = true;
      document.getElementById("soundStatus").innerText = "ON";
    }
  });


  // !!! GAME LOOP !!!
  function startGame() {

    // we are in playing mode
    playing = true;

    // RESET ALL VERIABLES
    if (reset) {
      reset = false;
      gameOver = false;

      clearLasers();
      clearPlanets();
      clearEnemies();
      clearEnemyLasers();

      helpEnemyVar = 1500;
      helpPlanetVar = 5000;
      enemySpeed = 3;
      planetSpeed = 3;
      enemyLaserSpeed = 8;

      level = 1;
      document.getElementById("infoText").innerText = "LEVEL " + level;
      spaceShip.style.display = "block";

      totalScore = 0;
      updateScore();
      totalShield = 100;
      updateShield();

      availableWidth = window.innerWidth;
      availableHeight = window.innerHeight;

      spaceShipLeft = (availableWidth - spaceShipWidth) / 2;
      spaceShipTop = availableHeight - 100;

      setLeftDistance();
      setTopDistance();

      // reseting help var for playing shield audio
      for(let i = 0; i<shieldSoundHelp.length; i++){
        shieldSoundHelp[i] = false;
      }

    }

    // ACTUAL GAME LOOP    
    gameLoop = setInterval(function () {

      // playing welcome message
      if(sound && !shieldSoundHelp[3]){
        shieldSound[3].play();
        shieldSoundHelp[3] = true;
      }
      

      controlColisionSpaceShip()

      if (gameOver) {
        clearInterval(gameLoop);
        document.getElementById("continueButton").style.display = "none";
        buttonContainer.style.display = "block";
        document.getElementById("infoText").innerText = "GAME OVER";
      }


      updateLevel();
      moveLaserShots();
      movePlanet();
      moveEnemies();
      moveEnemyShoot();

      // CREATING PLANET
      if (helpPlanet <= 0) {
        createPlanet();
        // value 3000 = 3 sec in calculating in game loop
        helpPlanet = helpPlanetVar;
      }
      helpPlanet -= 1000 / fps;

      // CREATE ENEMY
      if (helpEnemy <= 0) {
        createEnemy();
        helpEnemy = helpEnemyVar;
      }
      helpEnemy -= 1000 / fps;

      // HELP ENEMY SHOOT
      if (helpEnemyShoot > 0) {
        helpEnemyShoot -= 1000 / fps;
      }

      // MOVING LEFT
      if (Key.isDown(37) || Key.isDown(65)) {
        moveShip("left");
      }
      // MOVING UP
      if (Key.isDown(38) || Key.isDown(87)) {
        moveShip("up");
      }
      // MOVING RIGHT
      if (Key.isDown(39) || Key.isDown(68)) {
        moveShip("right");
      }
      // MOVING DOWN
      if (Key.isDown(40) || Key.isDown(83)) {
        moveShip("down");
      }

      // ESC KEY
      if (Key.isDown(27)) {
        playing = false;
        buttonContainer.style.display = "block";
        clearInterval(gameLoop);
      }

      // IS MOUSE DOWN = shooting
      if (MouseDowHelp.isPressed) {
        if (helpLaser <= 0) {
          createLaserShot();
          helpLaser = 1000;
        }
      }
      // helping, for time between laser shots
      if (helpLaser > 0) {
        helpLaser -= (1000 / fps) * 5;
      }

    }, 1000 / fps)
  };


  // CHECKING MOUSE DOWN
  window.addEventListener("mousedown", function () {
    MouseDowHelp.isPressed = true;
  });
  window.addEventListener("mouseup", function () {
    MouseDowHelp.isPressed = false;
  });
  let MouseDowHelp = {
    isPressed: false,
  }


  // !!! LASER !!! SHOT CREATING and POSITIONING OF, with class "laserShot"
  function createLaserShot() {
    let laserShot = document.createElement("img");
    laserShot.setAttribute("src", "images/laserShot.png");

    laserShot.className = "laserShot";

    document.body.appendChild(laserShot);

    // Start position of laser in the middle of space ship
    let centerOfShip = spaceShipLeft + (spaceShipWidth / 2) - laserShot.width / 2;
    let centerOfShipTop = spaceShipTop - laserShot.height;
    laserShot.style.top = centerOfShipTop + "px";
    laserShot.style.left = centerOfShip + "px";

    if (sound) {
      playLaserSound();
    }
  };


  // !!! PLANET !!! CREATING and POSITIONING, with class "planet" and "destroyObject"
  function createPlanet() {
    let planet = document.createElement("img");
    let random = Math.floor(Math.random() * 20) + 1;
    planet.setAttribute("src", "images/planets/planet" + random + ".png");
    planet.className = "planet destroyObject";
    //planet height
    let randomHeight = Math.floor(Math.random() * 51) + 100;
    planet.height = randomHeight;
    document.body.appendChild(planet);

    let widthOfPlanet = planet.width;
    if (widthOfPlanet == 0) {
      widthOfPlanet = planet.height;
    }
    // !!! SOLVE THE WIDTH OF THE IMG
    console.log(widthOfPlanet);

    //start position of planet
    let planetTop = 0 - planet.height - 50;
    let randomLeft = 0;

    let cont = true;
    while (cont) {
      randomLeft = Math.floor(Math.random() * (availableWidth - widthOfPlanet));
      if (randomLeft + widthOfPlanet < lastEnemyLeftMin || randomLeft > lastEnemyLeftMax) {
        cont = false;
      }
    }
    planet.style.top = planetTop + "px";
    planet.style.left = randomLeft + "px";

    lastPlanetLeftMin = randomLeft;
    lastPlanetLeftMax = lastPlanetLeftMin + planet.height;
  };


  // !!! ENEMY !!! CREATING and POSITIONING, with class "enemy" and "destroyObject"
  function createEnemy() {
    let enemy = document.createElement("img");
    let random = Math.floor(Math.random() * 6) + 1;
    enemy.setAttribute("src", "images/enemy/enemy" + random + ".png");
    enemy.className = "enemy destroyObject";
    document.body.appendChild(enemy);

    let enemyTop = 0 - enemy.height - 30;
    let randomLeft = 0;

    let cont = true;
    while (cont) {
      randomLeft = Math.floor(Math.random() * (availableWidth - 50));
      if (randomLeft + 100 < lastPlanetLeftMin || randomLeft > lastPlanetLeftMax) {
        cont = false;
      }
    }

    enemy.style.top = enemyTop + "px";
    enemy.style.left = randomLeft + "px";

    lastEnemyLeftMin = randomLeft;
    lastEnemyLeftMax = randomLeft + 100;
  };



  // EVENT LISTENERS, CHCECKING, WHICH KEY IS DOWN AND UP, IMPORTANT FOR PLAYER MOVEMENT
  window.addEventListener("keydown", function (event) {
    Key.onKeyDown(event);
  });
  window.addEventListener("keyup", function (event) {
    Key.onKeyUp(event);
  });

  // CHECKING PRESSED KEY, HELP OBJECT
  let Key = {
    pressedKey: [0],

    // checking if the specified key is pressed
    isDown: function (keyCode) {
      if (this.pressedKey.includes(keyCode)) {
        return true;
      } else {
        return false;
      }
    },
    // adding keycode to the array: pressedKey
    onKeyDown: function (e) {
      if (!this.pressedKey.includes(e.keyCode)) {
        this.pressedKey.push(e.keyCode);
      }
    },
    // removing keycode from the array: pressedKey
    onKeyUp: function (e) {
      let index = this.pressedKey.indexOf(e.keyCode);
      if (index > -1) {
        this.pressedKey.splice(index, 1);
      }
    }
  }


  // MOVING SPACE SHIP
  function moveShip(direction) {
    switch (direction) {
      // LEFT
      case "left":
        // chcecking, the width of screen
        if (spaceShipLeft - speedOfShip > 0) {
          spaceShipLeft -= speedOfShip;
        }
        else {
          spaceShipLeft = 0;
        }
        setLeftDistance();
        break;

      // RIGHT
      case "right":
        if (spaceShipLeft + spaceShipWidth + speedOfShip < availableWidth) {
          spaceShipLeft += speedOfShip;
        } else {
          spaceShipLeft = availableWidth - spaceShipWidth;
        }
        setLeftDistance();
        break;

      // UP
      case "up":
        if (spaceShipTop - speedOfShip > 0) {
          spaceShipTop -= speedOfShip;
        } else {
          spaceShipTop = 0;
        }
        setTopDistance();
        break;

      // DOWN
      case "down":
        if (spaceShipTop + spaceShipHeight + speedOfShip < availableHeight) {
          spaceShipTop += speedOfShip;
        } else {
          spaceShipTop = availableHeight - spaceShipHeight;
        }
        setTopDistance();
        break;
    }
  }

  // MOVING PLANETS
  function movePlanet() {
    let planets = document.getElementsByClassName("planet");
    if (planets.length > 0) {
      for (let i = 0; i < planets.length; i++) {
        let top = planets[i].offsetTop;
        top += planetSpeed;
        planets[i].style.top = top + "px";
        if (top > availableHeight + 100) {
          planets[i].parentNode.removeChild(planets[i]);
        }
      }
    }
  }

  // MOVING LASERS
  function moveLaserShots() {
    let lasers = document.getElementsByClassName("laserShot")
    let destroyObjects = document.getElementsByClassName("destroyObject");

    if (lasers.length > 0) {
      for (let i = 0; i < lasers.length; i++) {
        let top = lasers[i].offsetTop;
        top -= laserSpeed;
        lasers[i].style.top = top + "px";

        // collision detection
        let laserLeftCenter = lasers[i].offsetLeft + (lasers[i].width / 2);

        if (destroyObjects.length > 0) {
          for (let j = 0; j < destroyObjects.length; j++) {
            let objectBottom = destroyObjects[j].offsetTop + destroyObjects[j].height;
            let objectTop = destroyObjects[j].offsetTop;
            let leftMin = destroyObjects[j].offsetLeft;
            let leftMax = destroyObjects[j].offsetLeft + destroyObjects[j].width;

            if (laserLeftCenter > leftMin && laserLeftCenter < leftMax && top < objectBottom && top > objectTop) {
              lasers[i].parentNode.removeChild(lasers[i]);
              if (destroyObjects[j].classList.contains("enemy")) {
                explosion(destroyObjects[j]);
                // random score point
                totalScore += Math.floor(Math.random() * 90) + 10;
                updateScore();
              }
            }
          }
        }

        if (top < -100) {
          lasers[i].parentNode.removeChild(lasers[i]);
        }

      }
    }
  }

  // Explosion function
  function explosion(object) {
    let x = 1;

    if (sound) {
      playExplosionSound();
    }

    let left = object.offsetLeft;
    let top = object.offsetTop;
    let width = object.width;
    object.className = "enemy";

    let intervalExplosion = setInterval(function () {
      if (x > 8) {
        object.parentNode.removeChild(object);
        clearInterval(intervalExplosion);
      }
      if (x <= 8) {
        object.setAttribute("src", "images/explosion/explosion" + x + ".png");
        object.width = width * 2;
        object.style.left = left - width / 2 + "px";
        object.style.top = top + 25 + "px";
        x++;
      }
    }, 50);
  }

  // MOVING ENEMIES DOWN + SHOOTING
  function moveEnemies() {
    let enemies = document.getElementsByClassName("enemy destroyObject");
    if (enemies.length > 0) {
      for (let i = 0; i < enemies.length; i++) {
        let top = enemies[i].offsetTop;
        top += enemySpeed;
        enemies[i].style.top = top + "px";

        // shooting the laser if player ship is in the range
        let leftEnemyMin = enemies[i].offsetLeft;
        let leftEnemyMax = leftEnemyMin + enemies[i].width;
        let centerOfPlayer = spaceShipLeft + spaceShipWidth / 2;

        if (centerOfPlayer > leftEnemyMin && centerOfPlayer < leftEnemyMax && helpEnemyShoot <= 0 && top < spaceShipTop) {
          createEnemyLaserShot(enemies[i]);
          helpEnemyShoot = 400;
        }

        if (top > availableHeight + 100) {
          enemies[i].parentNode.removeChild(enemies[i]);
        }
      }
    }
  }

  // !!! ENEMY LASER !!! SHOT CREATING and POSITIONING OF, with class "enemyLaserShot"
  function createEnemyLaserShot(enemyShip) {
    let enemyLaserShot = document.createElement("img");
    enemyLaserShot.setAttribute("src", "images/enemy/enemyLaserShot.png");
    enemyLaserShot.className = "enemyLaserShot";

    document.body.appendChild(enemyLaserShot);

    // Start position of enemy laser in the middle of space ship
    let centerOfShip = enemyShip.offsetLeft + (enemyShip.width / 2) - enemyLaserShot.width / 2;
    let centerOfShipTop = enemyShip.offsetTop + enemyShip.height;
    enemyLaserShot.style.top = centerOfShipTop + "px";
    enemyLaserShot.style.left = centerOfShip + "px";

    if (sound) {
      playLaserSound();
    }
  };

  // MOVING ENEMY LASER + COLISION DETECTION
  function moveEnemyShoot() {
    let enemieLasers = document.getElementsByClassName("enemyLaserShot");
    if (enemieLasers.length > 0) {
      for (let i = 0; i < enemieLasers.length; i++) {
        let top = enemieLasers[i].offsetTop;
        top += enemyLaserSpeed;
        enemieLasers[i].style.top = top + "px";

        // detection of player ship
        let laserLeftCenter = enemieLasers[i].offsetLeft + enemieLasers[i].width / 2;
        if (laserLeftCenter > spaceShipLeft && laserLeftCenter < spaceShipLeft + spaceShipWidth && top > spaceShipTop && top < (spaceShipTop + spaceShipHeight)) {
          enemieLasers[i].parentNode.removeChild(enemieLasers[i]);
          // If player has SHIELD
          if (totalShield - enemyHitShield > 0) {
            // random number of hit to lower Shield
            let randomShieldHit = Math.floor(Math.random() * 6) + 5;
            totalShield -= randomShieldHit;
            showShield();
            checkShieldAudio()
          } else {
            totalShield = 0;
            explosionPlayer();
          }
          updateShield();
        }
        if (top > availableHeight + 100) {
          enemieLasers[i].parentNode.removeChild(enemieLasers[i]);
        }
      }
    }
  }


  function showShield() {
    spaceShip.setAttribute("src", "images/spaceShipShield.png");
    let shieldInterval = setTimeout(function () {
      spaceShip.setAttribute("src", "images/spaceShip.png");
    }, 200)
  }


  // CLEAR ALL PLAYER LASERS
  function clearLasers() {
    let lasers = document.getElementsByClassName("laserShot");
    if (lasers.length > 0) {
      lasers[0].parentNode.removeChild(lasers[0]);
      clearLasers();
    }
    else {
      return;
    }
  }

  // CLEAR ALL ENEMY LASERS
  function clearEnemyLasers() {
    let lasers = document.getElementsByClassName("enemyLaserShot");
    if (lasers.length > 0) {
      lasers[0].parentNode.removeChild(lasers[0]);
      clearEnemyLasers();
    }
    else {
      return;
    }
  }

  // CLEAR ALL PLANETS
  function clearPlanets() {
    let planets = document.getElementsByClassName("planet");
    if (planets.length > 0) {
      planets[0].parentNode.removeChild(planets[0]);
      clearPlanets();
    } else {
      return;
    }
  }

  // CLEAR ALL ENEMIES
  function clearEnemies() {
    let enemies = document.getElementsByClassName("enemy");
    if (enemies.length > 0) {
      enemies[0].parentNode.removeChild(enemies[0]);
      clearEnemies();
    } else {
      return;
    }
  }

  // UPDATE SCORE
  function updateScore() {
    let score = document.getElementById("score");
    score.innerText = totalScore;
  }

  // UPDATE SHIELD
  function updateShield() {
    let shieldText = document.getElementById("shieldText");
    let shield = document.getElementById("shield");
    shield.innerText = totalShield;
    if (totalShield < 26) {
      shieldText.style.color = "red";
    } else {
      shieldText.style.color = "#FFD700";
    }
  }

  // Explosion PLAYER function
  function explosionPlayer() {
    gameOver = true;
    totalShield = 0;
    updateShield();

    if (sound) {
      playExplosionSound();
    }

    let x = 1;

    spaceShip.style.display = "none";
    let explosion = document.createElement("img");
    explosion.style.position = "absolute";
    document.body.appendChild(explosion);

    let left = spaceShipLeft;
    let top = spaceShipTop;
    let width = spaceShipWidth;

    let intervalPlayerExplosion = setInterval(function () {
      if (x > 8) {
        explosion.parentNode.removeChild(explosion);
        clearInterval(intervalPlayerExplosion);
      }
      if (x <= 8) {
        explosion.setAttribute("src", "images/explosion/explosion" + x + ".png");
        explosion.width = width * 2;
        explosion.style.left = left - width / 2 + "px";
        explosion.style.top = top + 25 + "px";
        x++;
      }
    }, 50);
  }


  // COLISION OF PLAYERS SPACE SHIP
  function controlColisionSpaceShip() {
    let inColision = false;

    // All objects
    let objects = document.getElementsByClassName("destroyObject");

    if (objects.length > 0) {
      for (let i = 0; i < objects.length; i++) {
        // main coordinates of the object
        let objectLeftMin = objects[i].offsetLeft;
        let objectLeftMax = objectLeftMin + objects[i].width;
        let objectTop = objects[i].offsetTop;
        let objectBottom = objectTop + objects[i].height;

        // player spaceship
        let spaceShipRight = spaceShipLeft + spaceShipWidth;
        let spaceShipBottom = spaceShipTop + spaceShipHeight;

        // CONDITIONS (Probably can be optimized)
        let condition1 = spaceShipLeft > objectLeftMin && spaceShipLeft < objectLeftMax && spaceShipTop > objectTop && spaceShipTop < objectBottom;
        let condition2 = spaceShipRight > objectLeftMin && spaceShipRight < objectLeftMax && spaceShipTop > objectTop && spaceShipTop < objectBottom;
        let condition3 = spaceShipLeft > objectLeftMin && spaceShipLeft < objectLeftMax && spaceShipBottom > objectTop && spaceShipBottom < objectBottom;
        let condition4 = spaceShipRight > objectLeftMin && spaceShipRight < objectLeftMax && spaceShipTop > objectTop && spaceShipTop < objectBottom;

        if (condition1 || condition2 || condition3 || condition4) {
          explosionPlayer();
          if (objects[i].classList.contains("enemy")) {
            explosion(objects[i]);
          }
        }
      }
    }
  }

  // UPDATING LEVEL FUNCTION
  function updateLevel() {
    let helpLevel = Math.floor(totalScore / 1000) + 1;
    if (helpLevel > level) {
      level = helpLevel;
      enemySpeed++;
      planetSpeed++;
      enemyLaserSpeed += 2;
      document.getElementById("infoText").innerText = "LEVEL " + level;
      if (helpEnemy - 100 >= 300) {
        helpEnemyVar -= 200;
        helpPlanetVar -= 500;
      }
    }
  }

  // PLAY LASER SOUND function
  function playLaserSound() {
    if (helpLaserSound >= laserSound.length) {
      helpLaserSound = 0;
    }
    laserSound[helpLaserSound].play();
    helpLaserSound++;
  }

  // PLAY EXPLOSION SOUND function
  function playExplosionSound() {
    if (helpExplosionSound >= explosionSound.length) {
      helpExplosionSound = 0;
    }
    explosionSound[helpExplosionSound].play();
    helpExplosionSound++;
  }

  let shieldSound = [new Audio("sound/shield50.mp3"), new Audio("sound/shield25.mp3"), new Audio("sound/shield10.mp3"),new Audio("sound/welcome.mp3")];
  let shieldSoundHelp = [false,false,false,false];
  function checkShieldAudio(){
      if(totalShield<=50 && !shieldSoundHelp[0]){
        if(sound){
          shieldSound[0].play()
        }
        shieldSoundHelp[0] = true;
      }
      if(totalShield<=25 && !shieldSoundHelp[1]){
        if(sound){
          shieldSound[1].play()
        }
        shieldSoundHelp[1] = true;
      }
      if(totalShield<=10 && !shieldSoundHelp[2]){
        if(sound){
          shieldSound[2].play()
        }  
        shieldSoundHelp[2] = true;
      }
  }
    


});