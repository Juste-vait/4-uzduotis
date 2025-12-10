// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Ticketing {
    address public organizer;
    address public validator;

    uint256 public ticketPrice;
    uint256 public totalTickets;
    uint256 public soldTickets;

    enum TicketStatus {
        None,
        Active,
        Used
    }

    mapping(address => TicketStatus) public tickets;

    event TicketPurchased(address indexed buyer);
    event TicketValidated(address indexed buyer);
    event Payout(address indexed to, uint256 amount);

    modifier onlyOrganizer() {
        require(msg.sender == organizer, "Not organizer");
        _;
    }

    modifier onlyValidator() {
        require(msg.sender == validator, "Not validator");
        _;
    }

     constructor(
        uint256 _ticketPrice,
        uint256 _totalTickets,
        address _validator
    ) {
        organizer = msg.sender;
        validator = _validator;
        ticketPrice = _ticketPrice;
        totalTickets = _totalTickets;
    }

    function buyTicket() external payable {
        require(soldTickets < totalTickets, "Sold out");
        require(msg.value == ticketPrice, "Incorrect price");
        require(tickets[msg.sender] == TicketStatus.None, "Already has ticket");

        tickets[msg.sender] = TicketStatus.Active;
        soldTickets += 1;

        emit TicketPurchased(msg.sender);
    }

    function checkTicket(address _buyer) external view onlyValidator returns (TicketStatus) {
        return tickets[_buyer];
    }
}
