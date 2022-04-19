const parse = require('../../include/utils/parse');

module.exports = () => {
  describe('Parse', () => {
    describe('Valid', () => {
      test('Get Domain From Headers - Domain Custom Header', async () => {
        const headers = {
          'my-domain': 'dragohmventures.com'
        };

        const domain = parse.getDomainFromHeaders(headers);

        expect(domain).toBe('dragohmventures.com');
      });

      test('Get Domain From Headers - Cloudflare Header', async () => {
        const headers = {
          'CF-Worker': 'dragohmventures.com'
        };

        const domain = parse.getDomainFromHeaders(headers);

        expect(domain).toBe('dragohmventures.com');
      });

      test('Get Domain From Headers - Default', async () => {
        const headers = {};

        const domain = parse.getDomainFromHeaders(headers);

        expect(domain).toBe('default');
      });
    });
  });
};
