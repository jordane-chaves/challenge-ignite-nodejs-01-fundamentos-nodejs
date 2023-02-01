import fs from 'node:fs/promises';

const databasePath = new URL('../../db.json', import.meta.url);

export class Database {
  #database = {};

  constructor() {
    fs.readFile(databasePath, 'utf8')
      .then(data => {
        this.#database = JSON.parse(data);
      }).catch(() => {
        this.#persist();
      });
  }

  #persist() {
    fs.writeFile(databasePath, JSON.stringify(this.#database));
  }

  /**
   * Find a record by ID.
   * @param {string} table Table name.
   * @param {string|number} id Record ID.
   * @returns {Object|null}
   */
  findOne(table, id) {
    const data = this.#database[table].find(row => row.id === id);
    return data ?? null;
  }

  /**
   * Select table or search for records in table.
   * @param {string} table Table name.
   * @param {Object} [search] Search fields
   * @returns {Array}
   */
  select(table, search) {
    let data = this.#database[table] ?? [];

    if (search) {
      data = data.filter(row => {
        return Object.entries(search).some(([key, value]) => {
          return row[key].includes(value);
        });
      });
    }

    return data;
  }

  /**
   * Insert new data into the table.
   * @param {string} table Table name.
   * @param {Object} data Data to be inserted into the table.
   */
  insert(table, data) {
    if (Array.isArray(this.#database[table])) {
      this.#database[table].push(data);
    } else {
      this.#database[table] = [data];
    }

    this.#persist();
  }

  /**
   * Update a record.
   * @param {string} table Table name to update a register.
   * @param {string} id Record ID.
   * @param {Object} data Data to be updated.
   */
  update(table, id, data) {
    const rowIndex = this.#database[table].findIndex(row => row.id === id);

    if (rowIndex > - 1) {
      this.#database[table][rowIndex] = { id, ...data };
      this.#persist();
    }
  }

  /**
   * Delete a record.
   * @param {string} table Table name.
   * @param {string} id Record ID.
   */
  delete(table, id) {
    const rowIndex = this.#database[table].findIndex(row => row.id === id);

    if (rowIndex > - 1) {
      this.#database[table].splice(rowIndex, 1);
      this.#persist();
    }
  }
}
