var expect = require ('expect');

var {generateMessage} = require('./message')

describe('generateMessage', () => {
    it('should generate correct message object', () => {
        // store res in variable
        // assert from match
        // assert text match
        // assert createdAt is number

        var from = 'Jen';
        var text = 'Some message';
        var message = generateMessage(from, text);

        expect(typeof message.createdAt).toBe('number');
        expect(message).toMatchObject({
            from: from,
            text: text
        })
    });
});