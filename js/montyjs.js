var Monty = function () {
    var doors = 20;
    var columns = 0;
    var prizeDoor = 0;
    var nearbyDoors = [];
    var nrOfRocks = 7;
    var rocks = [];
    var pickedDoor = 0;
    var openedDoors = [];
    var picksPossible = doors - 2;
    var picksDone = 0;
    var rounds = 0;
    var correctPicks = 0;
    var highScore = 0;
    var level = 1;
    var goatsFound = 0;
    var secondsLeft = 60;
    var isTimerOn = false;
    var howToPlayVisible = true;

    $(document).ready(function () {
        Start();
    });

    // On click
    function cardClick(evt) {
        var params = evt.currentTarget.id.split('-');
        var pickedDoor = parseInt(params.pop());
        var pickedDoorIsOpen = $.inArray(pickedDoor, openedDoors) != -1;

        if (level == 1 && picksDone < 1 && !isTimerOn) { timer(secondsLeft); isTimerOn = true;}

        // Change selection
        if (!pickedDoorIsOpen) {
            $('.door').removeClass('selected');
            $('#door-' + pickedDoor).addClass('selected');
        }

        // If first picks
        if (picksPossible > picksDone && !pickedDoorIsOpen) {

            // Pick a door 
            var coinToss = Math.floor((Math.random() * doors) + 1);
            var isOpen = $.inArray(coinToss, openedDoors) != -1;
            while (coinToss == prizeDoor || coinToss == pickedDoor || isOpen == true) {
                coinToss = Math.floor((Math.random() * doors) + 1);
                var isOpen = $.inArray(coinToss, openedDoors) != -1;
            };

            // Open door
            openedDoors.push(coinToss);
            $('#door-' + coinToss).addClass('opened');

            // If it's a rock
            var isRock = $.inArray(coinToss, rocks) != -1;
            if (isRock) {
                $('#door-' + coinToss).addClass('rock');
            };

            // Update counters
            if (pickedDoor == prizeDoor) {
                correctPicks++;
            };
            picksDone++;
        }

            // If last pick
        else if (picksDone == picksPossible & !pickedDoorIsOpen) {

            // Last pick is correct
            if (prizeDoor == pickedDoor) {
                openedDoors.push(prizeDoor);
                $(".door").addClass('opened');
                $("#door-" + prizeDoor).addClass('goat-happy');

                // Update counters
                correctPicks++;
                goatsFound++;
                secondsLeft = secondsLeft + correctPicks+1;
                clearInterval(intervalVar);
                timer(secondsLeft);
                $("style").html('#door-' + prizeDoor + ':after { content: " +' + correctPicks + 's' +'" }');
                if (level < 6) {
                    level++;
                } else { level = 6 }
            }

                // Final pick is wrong
            else if (prizeDoor != pickedDoor) {
                openedDoors.push(prizeDoor, pickedDoor);
                $("#door-" + prizeDoor).addClass('goat-sad');
                $("#door-" + pickedDoor).css('background-color', '#FB7968');

                // If it's a rock
                var isRock = $.inArray(pickedDoor, rocks) != -1;
                if (isRock) {
                    $('#door-' + pickedDoor).addClass('rock');
                };
            }

            updateScore();
            rounds++;
            setTimeout(function () {
                Start()
            }, 700);

        }

            // Already open door is clicked
        else {
            console.log('already open');
        }
    }

    // Update score
    function updateScore() {
        $('#score').html('Found: ' + goatsFound);
        $('#highscore').html('Best: ' + highScore);
    };


    // Game end
    function gameOver() {
        if (highScore <= goatsFound) {
            highScore = goatsFound;
        }
        $('#gameover').html('');
        $('#gameover').css('display', 'block').html(
            '<h2 id="yay">Yay!</h2><p>You found Monty ' + goatsFound + ' times.</p><button id="reset">Play again</button>'
            );
        $('#yay').animate({'font-size': '8em'},300);
        $('#reset').hide().delay(1600).fadeIn("slow");
        $('#reset').click(function () {
            $('#gameover').css('display', 'none');
            restart();
        });
    };

    // Restarting 
    function restart() {
        rounds = 0;
        level = 1;
        goatsFound = 0;
        secondsLeft = 60;
        isTimerOn = false;
        $('#timeprogress').css('background-color', '#6B7370');
        $('#time').css({ 'color': '#f2f2f2', 'font-size': '14px;', 'font-weight': 'normal' });
        $('#monty').css('min-height', 'auto');
        Start();
    };

    function timer(seconds) {
        intervalVar = setInterval(function () {
            $('#time').css('color', '#6B7370');
            $('#timeprogress').css('background-color', '#6B7370')
            if (seconds === 0) {
                $('#time').html('00:00').css('color', '#f2f2f2');
                $('#timeprogress').css('width', '0');
                gameOver();
                clearInterval(intervalVar);
                return;
            }

            if (seconds <= 15) {
                $('#timeprogress').css('background-color', '#FB7968');
                $('#time').css({ 'color': '#FB7968', 'font-size': '18px;', 'font-weight': 'bold' });
            }
            var minutes = Math.floor(seconds / 60);
            var secondsToShow = (seconds - minutes * 60).toString();
            if (secondsToShow.length === 1) {
                secondsToShow = "0" + secondsToShow;
            }
            $('#time').html(minutes.toString() + ":" + secondsToShow);
            $('#timeprogress').css('width', seconds * 2);
            seconds--;
            secondsLeft--;
        }, 1000);
    };

    function Start() {
        switch (level) {
            case 1:
                nrOfRocks = 0;
                doors = 3;
                columns = 3;
                break;
            case 2:
                nrOfRocks = 1;
                doors = 4;
                columns = 4;
                break;
            case 3:
                nrOfRocks = 2;
                doors = 5;
                columns = 5;
                break;
            case 4:
                nrOfRocks = 4;
                doors = 10;
                columns = 5;
                break;
            case 5:
                nrOfRocks = 6;
                doors = 15;
                columns = 5;
                break;
            case 6:
                nrOfRocks = 8;
                doors = 20;
                columns = 5;
                break;
        };

        // Reset variables
        pickedDoor = 0;
        picksPossible = doors - 2;
        picksDone = 0;
        correctPicks = 0;
        openedDoors = [];
        nearbyDoors = [];
        rocks = [];

        // Assign the goat to a random door
        prizeDoor = Math.floor((Math.random() * doors) + 1);

        // Push doors that can't have rocks into array
        if (prizeDoor != 1 && prizeDoor != 6 && prizeDoor != 11 && prizeDoor != 16) {
            nearbyDoors.push(prizeDoor - 1);
        }

        if (prizeDoor != 5 && prizeDoor != 10 && prizeDoor != 15 && prizeDoor != 20) {
            nearbyDoors.push(prizeDoor + 1);
        };

        if (prizeDoor > 5) {
            nearbyDoors.push(prizeDoor - 5);
        };

        if (prizeDoor < 16) {
            nearbyDoors.push(prizeDoor + 5);
        };

        // Set rocks
        for (i = 0; i < nrOfRocks; i++) {
            var coinToss2 = Math.floor((Math.random() * doors) + 1);
            var isRock = $.inArray(coinToss2, rocks) != -1;
            var isNearbyDoor = $.inArray(coinToss2, nearbyDoors) != -1;
            while (coinToss2 == prizeDoor || isNearbyDoor || isRock) {
                coinToss2 = Math.floor((Math.random() * doors) + 1);
                isRock = $.inArray(coinToss2, rocks) != -1;
                isNearbyDoor = $.inArray(coinToss2, nearbyDoors) != -1;
            };
            rocks.push(coinToss2);
        };

        if (nrOfRocks > 0) {
            $('#hidden-rocks').html(nrOfRocks + ' rock(s)');
        } else { $('#hidden-rocks').html(''); }

        // Reset last rounds styles 
        $("style").html('');

        // Set gametable
        if (rounds > 0) {
            $('#monty').css('min-height', $('#monty').height())
        }
        $('#monty').html('');
            for (var i = 1; i <= doors; i++) {
                $('<div class="col-' + columns +' door" id="door-' + i + '"></div>').hide().appendTo('#monty').fadeIn(0);
            };

        $('#monty').hide().slideDown(800);
        if (howToPlayVisible) {
            $('#howtoplay').hide().delay(1300).slideDown(1200);
            howToPlayVisible = false;
        }  

        // Set score
        updateScore();

        // First screen
        $('#close').on('click', function (evt) {
            $('#howtoplay').css('display', 'none');
        });

        // Act on door clicking
        $('.door').on('click touchstart', function (evt) {
            cardClick(evt);
            evt.preventDefault();
        });
    };


}()
