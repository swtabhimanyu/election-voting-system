pragma solidity ^0.5.0;

contract Election{

    struct Candidate{
        uint id;
        string name;
        uint voteCount;
    }

    //accounts that have voted
    mapping(address => bool) public voters;


    mapping(uint => Candidate) public candidates;

    uint public candidatesCount;

    
    function addCandidate(string memory _name) private{
        candidatesCount++;
        candidates[candidatesCount]=Candidate(candidatesCount,_name,0);
    }




    constructor () public{
        addCandidate("Narendra Modi");
        addCandidate("Rahul Gandhi");
    }

    function vote(uint _candidateId) public{

        require(!voters[msg.sender]);

        require(_candidateId>0 && _candidateId<=candidatesCount);
        
        //record that voter has voted
        voters[msg.sender]=true;

        //update candidate vote count
        candidates[_candidateId].voteCount++;
    }
}