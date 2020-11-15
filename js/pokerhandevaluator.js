'use strict';

var 
HANDVALUES = {
  STRAIGHTFLUSH: 9,
  QUADS: 8,
  FULLHOUSE: 7,
  FLUSH: 6,
  STRAIGHT: 5,
  TRIPS: 4,
  TWOPAIR: 3,
   PAIR: 2,
  HIGHCARD: 1
};

function Card(id, value, suit) {
  this.id = id;
  this.value = value;
  this.suit = suit;
}

function Hand(id, cards) {
  this.id = id;
  this.cards = cards;

  this.pairs = [];
  this.trips = 0;
  this.quads = 0;
  this.handValue = 0;
  this.isStraight = false;
  this.isFlush = false;

  this.sortCards = function() {
    this.cards.sort(function(a, b) {
      return a.value < b.value;
    });
  };

  this.sortCards();
}


function createDeck() {
  var deck = [],
      value,
      suit;

  for (var i = 0; i < 52; i++) {
    if (i % 13 === 0) {
      value = 14;
    } else {
      value = i % 13 + 1;
    }

    if (i < 13) suit = 's';
    else if (i >= 13 && i < 26) suit = 'h';
    else if (i >= 26 && i < 39) suit = 'd';
    else suit = 'c';

    deck.push(new Card(i + 1, value, suit));
  }

  return deck;
}


function shuffleDeck(deck) {
  for (var i = deck.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = deck[i];
    deck[i] = deck[j];
    deck[j] = temp;
  }

  return deck;
}


function getHand(deck, start) {
  var cards = [];
  
  start = start || 0;

  for (var i = start; i < start + 5; i++) {
    cards.push(deck[i]);
  }
  return new Hand(null, cards);
}


function findSameRankTypeHands(hand) {
  var ranks = [],
      cards = hand.cards;

  
  for (var i = 2; i <= 14; i++) {
    ranks[i] = 0;
  }

  
  for (i = 0; i < cards.length; i++) {
    ranks[cards[i].value]++;
  }

  
  hand.ranks = ranks;

  
  
  for (i = 2; i < ranks.length; i++) {
    if (ranks[i] === 2) {
      hand.pairs = hand.pairs || [];
      hand.pairs.push(i);
    }
    else if (ranks[i] === 3) {
      hand.trips = i;
    }
    else if (ranks[i] === 4) {
      hand.quads = i;
    }
  }

  if (hand.quads) {
    hand.handValue = HANDVALUES.QUADS;
  } else if (hand.trips && hand.pairs.length === 1) {
    hand.handValue = HANDVALUES.FULLHOUSE;
  } else if (hand.trips) {
    hand.handValue = HANDVALUES.TRIPS;
  } else if (hand.hasOwnProperty('pairs') && hand.pairs.length === 2) {
    hand.handValue = HANDVALUES.TWOPAIR;
  } else if (hand.hasOwnProperty('pairs') && hand.pairs.length === 1) {
    hand.handValue = HANDVALUES.PAIR;
  } else {
    hand.handValue = HANDVALUES.HIGHCARD;
  }

  return hand;
}


function findStraight(hand) {
  var cards;

  cards = hand.cards;

  
  if (cards[0].value === 14 &&
    cards[1].value === 5 &&
    cards[2].value === 4 &&
    cards[3].value === 3 &&
    cards[4].value === 2) {
    hand.handValue = HANDVALUES.STRAIGHT;
    hand.highestCardValue = 5;
    hand.isStraight = true;
  } else if (cards[0].value - cards[4].value === 4) {
    hand.handValue = HANDVALUES.STRAIGHT;
    hand.highestCardValue = cards[0].value;
    hand.isStraight = true;
  }

  return hand;
}


function findFlush(hand) {

  var suit = hand.cards[0].suit;

  
  for (var i = 1; i < hand.cards.length; i++) {
    if (hand.cards[i].suit != suit) return hand;
  }

  
  hand.handValue = HANDVALUES.FLUSH;
  hand.isFlush = true;

  return hand;
}


function findStraightFlush(hand) {
  if (hand.isFlush && hand.isStraight) {
    hand.handValue = HANDVALUES.STRAIGHTFLUSH;
  }

  return hand;
}

function attachHandValue(hand) {
  hand = findSameRankTypeHands(hand);
    
    if (hand.handValue === 1) {
      hand = findStraight(hand);
      hand = findFlush(hand);
      hand = findStraightFlush(hand);
    }
  return hand;
}



function compareHands(h1, h2) {

  
  if (h1.handValue > h2.handValue) {
    return 1;
  }
  if (h1.handValue < h2.handValue) {
    return 2;
  }

  
  switch (h1.handValue) {
    case HANDVALUES.STRAIGHTFLUSH:
    case HANDVALUES.STRAIGHT:
      if (h1.highestCardValue > h2.highestCardValue) {
        return 1;
      } else if (h1.highestCardValue < h2.highestCardValue) {
        return 2;
      }
      break;
    case HANDVALUES.QUADS:
      if (h1.quads > h2.quads) {
        return 1;
      } else if (h1.quads < h2.quads) {
        return 2;
      }
      break;
    case HANDVALUES.FULLHOUSE:
    case HANDVALUES.TRIPS:
      if (h1.trips > h2.trips) {
        return 1;
      } else if (h1.trips < h2.trips) {
        return 2;
      }
      break;
    case HANDVALUES.FLUSH:
    case HANDVALUES.HIGHCARD:
      return compareHigh(h1, h2);
    case HANDVALUES.TWOPAIR:
      return compareTwoPair(h1, h2);
    case HANDVALUES.PAIR:
      return comparePair(h1, h2);
    default:
      break;
  }
  return 0;
}

function compareHigh(h1, h2) {
  for (var i = 0; i < h1.cards.length; i++) {
    if (h1.cards[i].value > h2.cards[i].value) {
      return 1;
    } else if (h1.cards[i].value < h2.cards[i].value) {
      return 2;
    }
  }

  return 0;
}

function comparePair(h1, h2) {
  if (h1.pairs[0] > h2.pairs[0]) {
    return 1;
  } else if (h1.pairs[0] < h2.pairs[0]) {
    return 2;
  }
  return compareHigh(h1, h2);
  
}

function compareTwoPair(h1, h2) {
  h1.pairs.sort(function(a, b) {
      return a < b;
  });
  h2.pairs.sort(function(a, b) {
      return a < b;
  });

  if (h1.pairs[0] > h2.pairs[0]) {
    return 1;
  } else if (h1.pairs[0] < h2.pairs[0]) {
    return 2;
  } else if (h1.pairs[1] > h2.pairs[1]) {
    return 1;
  } else if (h1.pairs[1] < h2.pairs[1]) {
    return 2;
  }

  return compareHigh(h1, h2);
}