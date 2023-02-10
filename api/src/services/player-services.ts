import { usersCollection, roomsCollection } from "../collections";
import { rtdb } from "../db/db";

export default class PlayerServices {
  private static usersCollection = usersCollection;

  static async searchUserByName(name: string): Promise<string> {
    const userFound = await PlayerServices.usersCollection
      .where("nombre", "==", name)
      .get();

    if (!userFound.empty) throw new Error("user already exists with this name");

    return "Player one created successfully";
  }

  static async searchUserById(id: string): Promise<boolean> {
    const userDocFound = await usersCollection.doc(id).get();
    return userDocFound.exists;
  }

  static async addnewUser(nombre: string): Promise<string> {
    const response = await PlayerServices.usersCollection.add({ nombre });
    return response.id;
  }

  static async getRoomData(roomId: string): Promise<any> {
    const roomFound = await roomsCollection.doc(roomId).get();
    if (!roomFound.exists) throw new Error("Room not found with this ID");
    return roomFound;
  }

  static async addPlayerTwoAtRoom(roomId: string): Promise<string> {
    const roomFound = await PlayerServices.getRoomData(roomId);
    const rtdbRoomId: string = roomFound.data().rtdbRoom; //rtdbRoom id

    const roomRtdbRef = rtdb.ref("/rooms/" + rtdbRoomId);
    return roomRtdbRef
      .update({ playerTwo: "new player" })
      .then(() => "New player added at room successfully")
      .catch(() => "Failed to add new player at room. Try again later");
  }
}
