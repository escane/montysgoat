var doors = 20;
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
var correctPicksTotal = 0;
var progressScore = 0;
var highScore = 0;

$(document).ready(function () {
    Start();
});

function Start() {

    // Reset variables
    pickedDoor = 0;
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

    // Reset last rounds styles 
    $("style").html('');

    // Set gametable
    $('#monty').html('<div id="notification"></div>');
    for (var i = 1; i <= doors; i++) {
        $('#monty').append('<div class="col-5 door" id="door-' + i + '"></div>');
    };

    // Set score
    updateScore();

    // Act on click
    $('.door').on('click', function (evt) {
        cardClick(evt);
    });
};

// On click
function cardClick(evt) {
    var params = evt.currentTarget.id.split('-');
    var pickedDoor = parseInt(params.pop());
    var pickedDoorIsOpen = $.inArray(pickedDoor, openedDoors) != -1; 

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
            rounds++;
            correctPicks++;
            correctPicksTotal = correctPicksTotal + correctPicks;
            $("style").html('#door-' +prizeDoor + ':after { content: " +' + correctPicks +'" }');

            // Update progress and score 
            var oldprogressScore = progressScore;
            progressScore = progressScore + correctPicks;
            if (oldprogressScore < 0 && progressScore > 0) {
                $('#progress-bar').css('width', '0%');
                setTimeout(function () { updateProgress(); }, 1000);
            } else { updateProgress(); }
            updateScore();

            // Win or continue
            if (progressScore >= 25) {
                $("#door-" + prizeDoor).removeClass('goat-happy');
                $("#door-" + prizeDoor).addClass('goat');
                setTimeout(function () {
                    youWin();
                }, 1000);
            }
            else {
                setTimeout(function () {
                    Start()
                }, 1000);

            }
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

            // Update counters
            rounds++;

            // Update progress and score
            var oldprogressScore = progressScore;
            progressScore = progressScore - 5;
            if (oldprogressScore > 0 && progressScore < 0) {
                $('#progress-bar').css('width', '0%');
                setTimeout(function () { updateProgress(); }, 1000);
            } else { updateProgress(); }
            updateScore();

            // Lose or continue
            if (progressScore <= -25) {
                $("#door-" + prizeDoor).removeClass('goat-sad');
                $("#door-" + prizeDoor).addClass('goat');
                setTimeout(function () {
                    youLose();
                }, 1000);
            } else {
                setTimeout(function () {
                    Start()
                }, 1000);
            }
        }
    }

    // Already open door is clicked
    else {
        console.log('already open');
    }
}

// Update score
function updateScore() {
    if (correctPicksTotal == 0 && rounds == 0) {
        $('#score').html('<span style="color:#f2f2f2;">Correct picks: 0 / Rounds: 0 / Score: 0 / Highscore: ' + highScore + '</span>');
    }
    else {
        if (progressScore >= 25 && highScore <= (Math.round(correctPicksTotal / rounds * 100))) {
            highScore = Math.round(correctPicksTotal / rounds * 100);
        }
        $('#score').html('Correct picks: ' + correctPicksTotal + ' / Rounds: ' + rounds + ' / Score: ' + Math.round(correctPicksTotal / rounds * 100) + ' / Highscore: ' + highScore)
    }
};

// Update progressbar
function updateProgress() {
    if (progressScore < 0) {
        $('#progress-bar').css({
            'width': -progressScore * 2 + '%',
            'background-color': '#FB7968',
            'right': '50%',
            'left': 'auto',
        });
        $('#progress-zero-point').css('background-color', '#FB7968');
    }
    else if (progressScore > 0) {
        $('#progress-bar').css({
            'width': progressScore * 2 + '%',
            'background-color': '#B0D1B2',
            'left': '50%',
            'right': 'auto',
        });
        $('#progress-zero-point').css('background-color', '#B0D1B2');
    }
};

// Win notification
function youWin() {
    $('#notification').css('display', 'block').append(
        '<h2>Yay!</h2><img class="goat-end" src="img/goat-happy.gif" />'
        );
    $('#progress-bar').css('width', '50%');
    $('#notification').click(function () {
        restart();
    });
};

// Lose notification
function youLose() {
    $('#notification').css('display', 'block').append(
        '<h2 class="awww">Awww!</h2><img class="goat-end" src="img/goat-sad.gif" />'
        );
    $('#progress-bar').css('width', '50%');
    $('#notification').click(function () {
        restart();
    });
};

// Restarting after win or lose
function restart() {
    rounds = 0;
    correctPicksTotal = 0;
    progressScore = 0;
    updateProgress();
    $('#progress-bar').css('width', '0%'); /**/
    $('#progress-zero-point').css('background-color', '#f2f2f2'); /**/
    Start();
};


