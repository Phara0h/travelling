const parse = require('../../include/utils/parse');

module.exports = () => {
  describe('Parse', () => {
    describe('Valid', () => {
      test('Get Domain From Headers - Domain Custom Header', async () => {
        const headers = {
          mydomain: 'dragohm.com'
        };

        const domain = parse.getDomainFromHeaders(headers);

        expect(domain).toBe('dragohm.com');
      });

      test('Get Domain From Headers - Cloudflare Header', async () => {
        const headers = {
          'cf-worker': 'dragohm.com'
        };

        const domain = parse.getDomainFromHeaders(headers);

        expect(domain).toBe('dragohm.com');
      });

      test('Get Domain From Headers - Default', async () => {
        const headers = {};

        const domain = parse.getDomainFromHeaders(headers);

        expect(domain).toBe('default');
      });
    });
  });
};
