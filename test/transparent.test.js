var transparent = require("..")
  , should = require("should");

describe("transparent", function() {

  describe(".proxy(method)", function() {
    var method = function method() { return 42; };
    var wrapped = transparent.proxy(method);

    it("should wrap 'method' with a proxy", function() {
      wrapped.should.not.equal(method);
    });

    it("should return the same result as 'method'", function() {
      var methodResult = method();
      var wrappedResult = wrapped();
      wrappedResult.should.equal(methodResult);
    });

  });

});
