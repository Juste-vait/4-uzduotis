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
}
