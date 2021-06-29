const BaseModel = require('adost').PGActiveModel;
const Base = require('adost').Base;
const PGTypes = require('adost').PGTypes;

class Audit extends Base(BaseModel, 'audits', {
  id: PGTypes.PK,
  created_on: null,
  action: null,
  subaction: null,
  by_user_id: null,
  of_user_id: null,
  prop: null,
  old_val: PGTypes.AutoCrypt,
  new_val: PGTypes.AutoCrypt,
  eprofile: PGTypes.EncryptProfile
}) {
  constructor(...args) {
    super(...args);
  }

  static async createTable() {
    const pg = new (require('adost').PGConnecter)();

    await pg.query(`CREATE TABLE audits (
                    id UUID DEFAULT uuid_generate_v4(),
                    created_on timestamp with time zone default current_timestamp,
                    action character varying(25),
                    subaction character varying(64),
                    by_user_id character varying(64),
                    of_user_id character varying(64),
                    prop character varying(200),
                    old_val text,
                    __old_val character varying(258),
                    new_val text,
                    __new_val character varying(258),
                    eprofile character varying(350),
                    PRIMARY KEY (id)
                    );`);
  }
}

module.exports = Audit;
