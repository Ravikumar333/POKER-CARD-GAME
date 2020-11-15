$(document).ready(function() {
  $("#btn").on("click", function() {
    if (confirm("New Startgame?")) {
      location.reload();
    }
  });

  
  runGame();

});

var deck,
    cardNumber,
    round,
     valueScores = [],
    animationSpeed = localStorage["animationSpeed"] || 400;


valueScores[9] = 12;
valueScores[8] = 10;
valueScores[7] = 7;
valueScores[6] = 5;
valueScores[5] = 5;
valueScores[4] = 3;
valueScores[3] = 2;
valueScores[2] = 1;


function runGame() {
  deck = createDeck();
  deck = shuffleDeck(deck);
  cardNumber = 0;
  round = 1;
  hands = [];

  for (var i = 0; i < 5; i++) {
    hands[i] = [];
  }

  dealCard();
}


function dealCard() {
  if ($(".newCardPile").draggable()) {
    $(".newCardPile").draggable("destroy");
  }

  $(".newCardPile").removeClass("newCardPile");

  
  if (cardNumber % 5 === 0) {
    makePilesDroppable();
    round++;
  }

  $("#main").append("<img src='img/" + deck[cardNumber].id + ".png' class='card newCardPile' />");

  
  if (cardNumber > 4) {
    $(".newCardPile").draggable({
      containment: '#main',
      cursor: 'move',
      stack: "#main",
      revert: "invalid"
    });
  } else {
    animateCard($("#pile" + (cardNumber + 1)), animationSpeed);
  }
}

function animateCard(target) {
  var targetCSS = target.css(["left", "top"]);

  animating = true;

  $(".newCardPile").animate(targetCSS, parseInt(animationSpeed), function() {
    $(target).trigger("drop", false);
    animating = false;
  });
}

function makePilesDroppable() {
  $(".pile").css("top", (round * 30) + "px");
  $(".pile").droppable({
  });
  $(".pile").on("drop", cardDropped);
  $(".pile").droppable('enable');
  $(".pile").dblclick(pileDblClicked);
  $(".pile").css("z-index", "2");
}

function pileDblClicked(event, ui) {
  if (!animating) {
    animateCard($(this));
  }
  
}

function cardDropped(event, ui) {
  var handId;

  if (ui) {
    ui.draggable.position({ of: $(this), my: 'left top', at: 'left top' });
    ui.draggable.draggable("destroy");
  }

  switch (this.id) {
    case 'pile1':
      handId = 0;
      break;
    case 'pile2':
      handId = 1;
      break;
    case 'pile3':
      handId = 2;
      break;
    case 'pile4':
      handId = 3;
      break;
    case 'pile5':
      handId = 4;
      break;
    default:
      break;
  }

  hands[handId].push(deck[cardNumber]);

  $(this).droppable("disable");
  $(this).off("drop");
  $(this).off("dblclick");
  $()
  
  cardNumber++;
  
  if (cardNumber < 25) {
    dealCard();
  } else {
    endGame();
  }
}

function endGame() {
  var totalScore = 0,
      scoreString = "(";

  for (var i = 0; i < hands.length; i++) {
    hands[i] = new Hand(i, hands[i]);
    hands[i] = attachHandValue(hands[i]);
    hands[i].score = valueScores[hands[i].handValue] || 0;
    totalScore += hands[i].score;
  scoreString += hands[i].score;
    if (i === 4) {
      scoreString += ")";
    } else {
      scoreString += " + ";
    }
    console.log(hands[i].score);
  }
  $("#latestScore").html("Your score: " + totalScore + " points!<br>" + scoreString);

  
 
}


