var Election=artifacts.require('./contracts/Election.sol')


//we get contract and it from mocha
// assertions from chai

contract('Election',function(accounts){
    var electionInstance;
    //checking that there are only 2 candidates
    it("initializes with two candidates", function(){
        return Election.deployed().then(function(instance){
            return instance.candidatesCount();
        }).then(function(count){
            assert.equal(count,2);
        })
    })

    it("it intitializes candidates with correct values", function(){
        return Election.deployed().then(function(instance){
            electionInstance=instance;
            return electionInstance.candidates(1);
        }).then(function(candidate){
            assert.equal(candidate[0],1,"contains the correct id");
            assert.equal(candidate[1],"Narendra Modi","contains correct name");
            assert.equal(candidate[2],"BJP","contains correct party");
            assert.equal(candidate[3],"bjp_logo.png","contains correct party logo");
            assert.equal(candidate[4],0,"contains correct vote count");
            return electionInstance.candidates(2);
        }).then(function(candidate){
            assert.equal(candidate[0],2,"contains the correct id");
            assert.equal(candidate[1],"Rahul Gandhi","contains correct name");
            assert.equal(candidate[2],"Congress","contains correct party");
            assert.equal(candidate[3],"congress_logo.png","contains correct party logo");
            assert.equal(candidate[4],0,"contains correct vote count");
        })
    });


    it("allows a voter to cast vote", function(){
        return Election.deployed().then(function(instance){
            electionInstance=instance;
            candidateId=1;
            return electionInstance.vote(candidateId, {from: accounts[0]});
        }).then(function(receipt){
            return electionInstance.voters(accounts[0]);
        }).then(function(voted){
            assert(voted,"the voter was marked as voted");
            return electionInstance.candidates(candidateId);
        }).then(function(candidate){
            var voteCount=candidate[4];
            assert.equal(voteCount,1,"increments the candidates vote count");
        })
    })

    it("throws an exception for invalid candiates", function() {
        return Election.deployed().then(function(instance) {
          electionInstance = instance;
          return electionInstance.vote(99, { from: accounts[1] })
        }).then(assert.fail).catch(function(error) {
          assert(error.message.indexOf('revert') >= 0, "error message must contain revert");
          return electionInstance.candidates(1);
        }).then(function(candidate1) {
          var voteCount = candidate1[4];
          assert.equal(voteCount, 1, "candidate 1 did not receive any votes");
          return electionInstance.candidates(2);
        }).then(function(candidate2) {
          var voteCount = candidate2[4];
          assert.equal(voteCount, 0, "candidate 2 did not receive any votes");
        });
      });
    
      it("throws an exception for double voting", function() {
        return Election.deployed().then(function(instance) {
          electionInstance = instance;
          candidateId = 2;
          electionInstance.vote(candidateId, { from: accounts[1] });
          return electionInstance.candidates(candidateId);
        }).then(function(candidate) {
          var voteCount = candidate[4];
          assert.equal(voteCount, 1, "accepts first vote");
          // Try to vote again
          return electionInstance.vote(candidateId, { from: accounts[1] });
        }).then(assert.fail).catch(function(error) {
          assert(error.message.indexOf('revert') >= 0, "error message must contain revert");
          return electionInstance.candidates(1);
        }).then(function(candidate1) {
          var voteCount = candidate1[4];
          assert.equal(voteCount, 1, "candidate 1 did not receive any votes");
          return electionInstance.candidates(2);
        }).then(function(candidate2) {
          var voteCount = candidate2[4];
          assert.equal(voteCount, 1, "candidate 2 did not receive any votes");
        });
      });

});