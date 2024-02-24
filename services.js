const db = require("./database");

exports.channel = {
  create: async ({ id, name, category, responsible, languages }) => {
    try {
      const result = await db.query("INSERT INTO channels (id, name, category, responsible, languages) VALUES ( $1, $2, $3, $4, $5 ) RETURNING *;", [ id, name, category, responsible, languages ]);
      return result.rows[0];
    } catch (error) {
      return error;
    };
  },
  getAll: async () => {
    try {
      const result = await db.query(`SELECT * FROM channels order by created_at desc;`);
      return result.rows;
    } catch (error) {
      return error;
    };
  },
  get: async (uid) => {
    try {
      const result = await db.query(`SELECT * FROM channels WHERE uid = $1;`, [ uid ]);
      return {
        exists: !!result.rowCount,
        data: result.rows[0],
      };
    } catch (error) {
      return error;
    };
  },
  team: async (uid) => {
    try {
      const result = await db.query(`SELECT * FROM players WHERE channel = $1 order by created_at desc;`, [ uid ]);
      return result.rows;
    } catch (error) {
      return error;
    };
  },
  player: {
    add: async ({channel, fullname, birthday, solarImageLink, birthCertificateLink}) => {
      try {
        const result = await db.query(`INSERT INTO players (channel, fullname, birthday, solarImageLink, birthCertificateLink) VALUES ( $1, $2, $3, $4, $5 ) RETURNING *;`, [ channel, fullname, birthday, solarImageLink, birthCertificateLink ]);
        return result.rows[0];
      } catch (error) {
        return error;
      };
    },
    get: async (uid) => {
      try {
        const result = await db.query(`SELECT * FROM players WHERE uid = $1;`, [ uid ]);
        return {
          exists: !!result.rowCount,
          data: result.rows[0],
        };
      } catch (error) {
        return error;
      };
    },
    remove: async (uid) => {
      try {
        const result = await db.query(`DELETE FROM players WHERE uid = $1;`, [ uid ]);
        return result.command == 'DELETE';
      } catch (error) {
        return error;
      };
    },
  },
  remove: async (uid) => {
    try {
      const players = await db.query(`DELETE FROM players WHERE channel = $1;`, [ uid ]);
      const channel = await db.query(`DELETE FROM channels WHERE uid = $1;`, [ uid ]);

      return players.command == 'DELETE' && channel.command == 'DELETE';
    } catch (error) {
      return error;
    };
  },
};