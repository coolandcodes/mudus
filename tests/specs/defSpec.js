
describe("definition/use case tests for public interface", function(){
    /* 
    beforeEach(function () {
          this.addMatchers({
            
          });
     });*/
     it("should have the 'load' method to be not defined ", function(){
          expect(Mudus.load).toBeUndefined();
     });
     it("should have the 'ready' method to be defined", function () {
          expect(Mudus.ready).toBeDefined();
     });
     it("should have the 'ready' method throw an error", function () {
          expect(function(){ Mudus.ready(); }).toThrowError("nothing to load");
     });
     
});
