import { usersCollection } from "../collections";

export default class PlayerServices {
  private static usersCollection = usersCollection;

  static async searchUserByName(name: string): Promise<boolean> {
    const userFound = await PlayerServices.usersCollection
      .where("nombre", "==", name)
      .get();
    return userFound.empty;
  }

  static async searchUserById(id: string): Promise<boolean> {
    const userDocFound = await usersCollection.doc(id).get();
    return userDocFound.exists;
  }

  static async addnewUser(nombre: string): Promise<string> {
    const response = await PlayerServices.usersCollection.add({ nombre });
    return response.id;
  }
}
