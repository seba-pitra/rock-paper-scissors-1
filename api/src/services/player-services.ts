import { firestore, rtdb } from "../db/db";

export default class PlayerServices {
  static usersCollection: any;

  constructor(usersCollection) {
    PlayerServices.usersCollection = usersCollection;
  }

  static async searchUser(name: string): Promise<boolean> {
    const userFound = await PlayerServices.usersCollection
      .where("nombre", "==", name)
      .get();
    return userFound.empty;
  }

  static async addnewUser(nombre: string): Promise<string> {
    const response = await PlayerServices.usersCollection.add({ nombre });
    return response.id;
  }

  static;
}
