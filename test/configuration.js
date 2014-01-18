describe('configuration', function () {
  var assert = chai.assert;

  function fooThrows () {
    chai.expect('foo').to.be.equal('bar');
  }

  it('Assertion.includeStack is true', function () {
    var orig = chai.Assertion.includeStack;
    chai.Assertion.includeStack = true;

    try {
      fooThrows();
      assert.ok(false, 'should not get here because error thrown');
    } catch (err) {
      chai.Assertion.includeStack = orig;
      // not all browsers support err.stack
      if ('undefined' !== typeof err.stack) {
        assert.include(err.stack, 'assertEqual', 'should have internal stack trace in error message');
        assert.include(err.stack, 'fooThrows', 'should have user stack trace in error message');
      }
    }

  });

  it('Assertion.includeStack is false', function () {
    var orig = chai.Assertion.includeStack;
    chai.Assertion.includeStack = false;

    try {
      fooThrows();
      assert.ok(false, 'should not get here because error thrown');
    } catch (err) {
      chai.Assertion.includeStack = orig;

      // IE 10 supports err.stack in Chrome format, but without
      // `Error.captureStackTrace` support that allows tuning of the error
      // message.
      if ('undefined' !== typeof err.stack && 'undefined' !== typeof Error.captureStackTrace) {
        assert.notInclude(err.stack, 'assertEqual', 'should not have internal stack trace in error message');
        assert.include(err.stack, 'fooThrows', 'should have user stack trace in error message');
      }
    }
  });
});
