import { initializeApp } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-analytics.js";
import { getDatabase, ref, set, get } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-database.js";

const db = getDatabase();

// Instantiate User Class

class User {
  constructor(username, inventory) {
    this.username = username;
    this.inventory = inventory;
    this.tradePartner = null;
    this.tradeOffer = null;
    this.tradeAccepted = false;
  }

  // Initiate a trade between 2 users
  initiateTrade(otherUser, offer, request) {
    if (this.tradePartner || otherUser.tradePartner) {
      throw new Error("One of the users is already in a trade");
    }
    this.tradePartner = otherUser;
    this.tradeOffer = offer;
    this.tradeAccepted = false;
    otherUser.tradeReceived = request;
    otherUser.tradePartner = this;
    otherUser.tradeOffer = request;
    otherUser.tradeAccepted = false;
  }

  // Make the parameter 'tradeAccepted' change from False to True given both are tradepartners
  acceptTrade() {
    if (this.tradePartner === null) {
      throw new Error("There are no valid trades to accept")
    } else { this.tradeAccepted = true }
  }

  // Confirms Trade and updates user's inventories
  confirmTrade() {
    if (!this.tradePartner || !this.tradePartner.tradeReceived) {
      throw new Error("No trade to confirm");
    }
    if (!this.tradeAccepted || !this.tradePartner.tradeAccepted) {
      throw new Error("Both users must accept the trade");
    }

    // update this user's inventory
    for (let item in this.tradeOffer) {
      if (this.inventory[item] < this.tradeOffer[item]) {
        throw new Error("Not enough items in inventory to complete trade");
      }
      this.inventory[item] -= this.tradeOffer[item];
    }
    for (let item in this.tradePartner.tradeReceived) {
      if (this.inventory[item]) {
        this.inventory[item] += this.tradePartner.tradeReceived[item];
      } else {
        this.inventory[item] = this.tradePartner.tradeReceived[item];
      }
    }

    // update the trade partner's inventory
    for (let item in this.tradePartner.tradeReceived) {
      if (this.tradePartner.inventory[item] < this.tradePartner.tradeReceived[item]) {
        throw new Error("Not enough items in inventory to complete trade");
      }
      this.tradePartner.inventory[item] -= this.tradePartner.tradeReceived[item];
    }
    for (let item in this.tradeOffer) {
      if (this.tradePartner.inventory[item]) {
        this.tradePartner.inventory[item] += this.tradeOffer[item];
      } else {
        this.tradePartner.inventory[item] = this.tradeOffer[item];
      }
    }

    // reset trade state for both users
    this.tradePartner.tradePartner = null;
    this.tradePartner.tradeReceived = null;
    this.tradePartner.tradeOffer = null;
    this.tradePartner.tradeAccepted = false;
    this.tradePartner = null;
    this.tradeOffer = null;
    this.tradeAccepted = false;
  }

  // Cancels trade
  cancelTrade() {
    if (!this.tradePartner) {
      throw new Error("No trade to cancel");
    }
    this.tradePartner.tradePartner = null;
    this.tradePartner.tradeReceived = null;
    this.tradePartner.tradeOffer = null;
    this.tradePartner.tradeAccepted = false;
    this.tradePartner = null;
    this.tradeOffer = null;
    this.tradeAccepted = false;
  }
}

// create two user instances
const user1 = new User("Alice", ["item1", "item2"]);
const user2 = new User("Bob", ["item3", "item4"]);

// initiate a trade between the users
user1.initiateTrade(user2, ["item1", "item2"], ["item3"]);

// both users accept the trade
user1.acceptTrade()
user2.acceptTrade()

// confirm the trade
user1.confirmTrade();

