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
var progressScore = 0;
var highScore = 0;

$(document).ready(function () {
    Start();
});

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
            correctPicks++;
            $("style").html('#door-' + prizeDoor + ':after { content: " +' + correctPicks + '" }');
            progressScore = progressScore + correctPicks;
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
            $("style").html('#door-' + pickedDoor + ':after { content: " -5" }');
            progressScore = progressScore - 5;     
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
    $('#score').html('Score: ' + progressScore);
    $('#highscore').html('Best: ' + highScore);
};


// Game end
function gameOver() {
    if (highScore <= progressScore) {
        highScore = progressScore;
    }
    $('#gameover').html('');
    $('#gameover').css('display', 'block').html(
        '<h2>Time is up!</h2><p>You played total rounds of ' + rounds + ' and scored ' + progressScore + ' points. Want to beat that?</p><button id="reset">Play again</button>'
        );
    setTimeout(function () { $('#reset').css({'visibility': 'visible', 'opacity': '1'}) }, 1000);
    $('#reset').click(function () {
        $('#gameover').css('display', 'none');
        restart();   
    });
};


// Restarting 
function restart() {
    rounds = 0;
    progressScore = 0;
    $('#timeprogress').css('background-color', '#6B7370');
    $('#time').css({ 'color': '#6B7370', 'font-size': '14px;', 'font-weight': 'normal' });
    Start();
    timer(60);
};

function timer(seconds) {
    intervalVar = setInterval(function () {
        if (seconds === 0) {
            $('#time').html('00:00');
            $('#timeprogress').css('width', '0');
            gameOver();
            clearInterval(intervalVar);
            return;
        }

        if (seconds <= 15) {
            $('#timeprogress').css('background-color', '#FB7968');
            $('#time').css({'color': '#FB7968', 'font-size':'18px;', 'font-weight': 'bold'});
        }
        var minutes = Math.floor(seconds / 60);
        var secondsToShow = (seconds - minutes * 60).toString();
        if (secondsToShow.length === 1) {
            secondsToShow = "0" + secondsToShow; 
        }
        $('#time').html(minutes.toString() + ":" + secondsToShow);
        $('#timeprogress').css('width', seconds*2);
        seconds--;
    }, 1000);
};

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
    $('#monty').html('');
    for (var i = 1; i <= doors; i++) {
        $('#monty').append('<div class="col-5 door" id="door-' + i + '"></div>');
    };

    // Set score
    updateScore();

    // First screen
    $('#play').on('click', function (evt) {
        $('#howtoplay').css('display', 'none');
        timer(60);
    });

    // Act on door clicking
    $('.door').on('click', function (evt) {
        cardClick(evt);
    });
};


