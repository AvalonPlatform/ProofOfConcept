pragma solidity ^0.4.11;

/**
 * @title Ownable
 * @dev The Ownable contract has an owner address, and provides basic authorization control
 * functions, this simplifies the implementation of "user permissions".
 */
contract Ownable {
  address public owner;


  /**
   * @dev The Ownable constructor sets the original `owner` of the contract to the sender
   * account.
   */
  function Ownable() {
    owner = msg.sender;
  }


  /**
   * @dev Throws if called by any account other than the owner.
   */
  modifier onlyOwner() {
    require(msg.sender == owner);
    _;
  }


  /**
   * @dev Allows the current owner to transfer control of the contract to a newOwner.
   * @param newOwner The address to transfer ownership to.
   */
  function transferOwnership(address newOwner) onlyOwner {
    require(newOwner != address(0));      
    owner = newOwner;
  }

}


contract PocAva is Ownable {
 
    bool public subscribingFinished = false;
    
    mapping (address => mapping(uint8 => bool)) subscriptions;
    mapping (uint8 => uint) subscriptionCost;
    
    event SubsLog(address subscriber, uint8 subscriptionNumber);
    event UnsubsLog(address subscriber, uint8 subscriptionNumber);


    modifier canSubscribe() {
        require(!subscribingFinished);
        _;
    }
    
  /**
   * price initialize at the contract deployment, can be changed later
   */
    
    function PocAva() {
        subscriptionCost[0] = 0.1 ether; // subscription price for the first list
        subscriptionCost[1] = 0.01 ether; //subscription price for the 2nd list 
        subscriptionCost[2] = 1 ether; //unused
        subscriptionCost[3] = 1 ether; //unused        
    }
    
    function setSubscriptionCost(uint8 subscriptionNumber, uint cost) onlyOwner {
        subscriptionCost[subscriptionNumber] = cost;
    }

    function subscribe(uint8 subscriptionNumber) payable canSubscribe {
        require(msg.value == subscriptionCost[subscriptionNumber]);
        require(subscriptions[msg.sender][subscriptionNumber] == false);
        owner.transfer(msg.value);     // Subscription fee send to the owner of the contract
        SubsLog(msg.sender, subscriptionNumber);
        subscriptions[msg.sender][subscriptionNumber] = true;
    }
    
    function unsubscribe(uint8 subscriptionNumber) {
        require(subscriptions[msg.sender][subscriptionNumber] == true);
        UnsubsLog(msg.sender, subscriptionNumber);
        subscriptions[msg.sender][subscriptionNumber] = false;
    }
    
    function querySubscription(address addr, uint8 subscriptionNumber) returns (bool) {
        return subscriptions[addr][subscriptionNumber];
    }
    
   /**
   * @dev Function to stop subscribing.
   * @return True if the operation was successful.
   */
  function finishSubscribing() onlyOwner returns (bool) {
    subscribingFinished = true;
    return true;
  }
}
