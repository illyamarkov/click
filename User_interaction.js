// Instantiate User Class
class User {
  constructor(username, inventory) {
    this.username = username;
    // Inventory is generally in the form of {"Item ID": ["Item Name", Item Quantity (int)]}
    this.inventory = inventory || {};
    this.tradePartner = null;
    this.tradeOffer = null;
    this.tradeRequest = null;
    this.tradeAccepted = false;
  }

  initiateTrade(otherUser, offer, request) {
    if (this.tradePartner || otherUser.tradePartner) {
      throw new Error("One of the users is already in a trade");
    }

    // Check if User's inventory is enough to trade
    for (let item in offer) {
      const quantity = offer[item][1];
      if (this.inventory[item][1] < quantity) {
        throw new Error ("quantity of the items in your inventory is insufficient to complete trade");
      }
    }

    // Check if Trader's inventory is enough to trade
    for (let item in request) {
      const quantity = request[item][1];
      if (otherUser.inventory[item][1] < quantity) {
        throw new Error ("quantity of the items in the trader's inventory is insufficient to complete trade");
      }
    }

    // Establishes partnership connection
    this.tradePartner = otherUser;
    otherUser.tradePartner = this;

    // Sets each user's trade offers and requests
    this.tradeOffer = offer;
    this.tradeRequest = request;
    otherUser.tradeRequest = offer;
    otherUser.tradeOffer = request;
    
    // Possibility to change later that trade initiator automatically accepts trade
    otherUser.tradeAccepted = false;
    this.tradeAccepted = false;
  }


  acceptTrade() {
    if (this.tradePartner === null) {
      throw new Error("There are no valid trades to accept");
    } else {
      this.tradeAccepted = true;
    }
  }


  confirmTrade() {
    if (!this.tradePartner || !this.tradePartner.tradeRequest) {
      throw new Error("No trade to confirm");
    }
    if (!this.tradeAccepted || !this.tradePartner.tradeAccepted) {
      throw new Error("Both users must accept the trade");
    }
  
    // Removes Offered Items from User's inventory
    for (let IDgive in this.tradeOffer) {
      this.inventory[IDgive][1] -= this.tradeOffer[IDgive][1];
      if (this.inventory[IDgive][1] === 0) {
        delete this.inventory[IDgive];
      }

    }

    // Adds Requested Items into User's inventory
    for (let IDtake in this.tradeRequest) {
      if (this.inventory.hasOwnProperty(IDtake)) {
        this.inventory[IDtake][1] += this.tradeRequest[IDtake][1];
      } else {
        this.inventory[IDtake] = this.tradeRequest[IDtake];
      }
    }
  
    // Removes Offered Items from Partner's inventory
    for (let IDgive in this.tradePartner.tradeOffer) {
      this.tradePartner.inventory[IDgive][1] -= this.tradePartner.tradeOffer[IDgive][1];
      if (this.tradePartner.inventory[IDgive][1] === 0) {
        delete this.tradePartner.inventory[IDgive];
      }

    }

    // Adds Requested Items into Partner's inventory
    for (let IDtake in this.tradePartner.tradeRequest) {
      if (this.tradePartner.inventory.hasOwnProperty(IDtake)) {
        this.tradePartner.inventory[IDtake][1] += this.tradePartner.tradeRequest[IDtake][1];
      } else {
        this.tradePartner.inventory[IDtake] = this.tradePartner.tradeRequest[IDtake];
      }
    }
  
    // Reset trade state for both users
    this.tradePartner.tradePartner = null;
    this.tradePartner.tradeRequest = null;
    this.tradePartner.tradeOffer = null;
    this.tradePartner.tradeAccepted = false;
    this.tradePartner = null;
    this.tradeOffer = null;
    this.tradeAccepted = false;
  }

  // Cancels trade
  cancelTrade() {
    if (this.tradePartner === null) {
      throw new Error("No trade to cancel");
    }
    this.tradePartner.tradePartner = null;
    this.tradePartner.tradeRequest = null;
    this.tradePartner.tradeOffer = null;
    this.tradePartner.tradeAccepted = false;
    this.tradePartner = null;
    this.tradeOffer = null;
    this.tradeAccepted = false; 
  }
}