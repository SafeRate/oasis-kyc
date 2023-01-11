import { Parcel, DatabaseId, Database } from "@oasislabs/parcel";

export class ParcelClient {
  parcel: Parcel;
  constructor() {
    this.parcel = new Parcel({
      clientId: process.env.PARCEL_CLIENT_ID!,
      privateKey: JSON.parse(process.env.PARCEL_PRIVATE_KEY!),
    });
  }

  private listDatabases = async (): Promise<any> => {
    return await this.parcel.listDatabases({});
  };

  private deleteAllDatabases = async () => {
    console.log("Attempting to delete all databases...");
    const result: any = await this.listDatabases();
    const databases: Database[] = result.results;
    for (let d = 0; d < databases.length; d++) {
      const deleteResult = await this.deleteDatabase(databases[d].id);
      console.log(deleteResult);
    }
  };

  public deleteDatabase = async (databaseId: DatabaseId) => {
    try {
      await this.parcel.deleteDatabase(databaseId);
      console.log(`Successfully deleted database ${databaseId}`);
    } catch (error) {
      console.log(`Failed to delete database ${databaseId}`);
      console.log(error);
    }
  };

  public createDatabase = async ({
    shouldCreateUsers,
  }: {
    shouldCreateUsers: boolean;
  }): Promise<boolean> => {
    let noError = true;
    let databaseId = process.env.PARCEL_DATABASE_ID;

    if (!databaseId) {
      console.log("Attempting to create database...");

      try {
        // https://docs.oasislabs.com/parcel/latest/quickstart/database-query.html#creating-a-database
        const database = await this.parcel.createDatabase({
          name: `My Test DB - ${process.env.PARCEL_APP_ID!}`,
        });

        databaseId = database.id;

        console.log(
          `Successfully created database ${database.id} with name: ${database.name}`
        );
      } catch (error) {
        console.log("Failed to create database!");
        console.log(error);
        noError = false;
      }
    } else {
      console.log(`Updating database ${databaseId}`);
    }

    if (databaseId) {
      if (shouldCreateUsers) {
        console.log("Attempting to create users table...");
        const createUsersTable = {
          sql: `CREATE TABLE users(id TEXT, created DATETIME, updated DATETIME, public_key TEXT, private_key TEXT, mnemonic TEXT);`,
          params: {},
        };

        try {
          const usersCreateResult = await this.parcel.queryDatabase(
            databaseId as DatabaseId,
            createUsersTable
          );

          console.log("Sucessfully created users table!");
          console.log(usersCreateResult);
        } catch (error: any) {
          console.log("Failed to create users table!");
          console.log(error.response.statusText);
          noError = false;
        }

        try {
          console.log("Attempting to add an index for users.id");
          await this.parcel.queryDatabase(databaseId as DatabaseId, {
            sql: `CREATE UNIQUE INDEX index_users_id ON users(id);`,
            params: {},
          });

          console.log("Successfully added index on users(id)");
        } catch (error: any) {
          console.log("Failed to add index on users(id);");
          console.log(error.response.statusText);
        }
      }
    }

    return noError;
  };

  public insertUser = async ({
    id,
    mnemonic,
    privateKey,
    publicKey,
  }: {
    id: string;
    mnemonic: string;
    privateKey: string;
    publicKey: string;
  }) => {
    const $created = new Date();
    const $updated = $created;
    const params = {
      $id: id,
      $created,
      $mnemonic: mnemonic,
      $private_key: privateKey,
      $public_key: publicKey,
      $updated,
    };

    const insertStatement = {
      sql: "INSERT INTO users VALUES ($id, $created, $updated, $private_key, $public_key, $mnemonic)",
      params,
    };

    await this.parcel.queryDatabase(
      process.env.PARCEL_DATABASE_ID as DatabaseId,
      insertStatement
    );

    console.log("User successfully inserted");
  };
}

export const parcelClient = new ParcelClient();
