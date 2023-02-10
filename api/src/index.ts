import express from "express";
import cors from "cors";
import path from "path";
import router from "./routes/index";

const port = process.env.PORT || 3001;

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("dist"));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  next();
});

app.use("/", router);

// app.post("/rtdbRoomId", (req, res) => {
//   const { roomId } = req.body;
//   roomsCollection
//     .doc(roomId)
//     .get()
//     .then((doc) => {
//       const rtdbRoomId = doc.data();
//       if (!rtdbRoomId) {
//         throw new Error();
//       }
//       return res.json(rtdbRoomId);
//     })
//     .catch((err) => {
//       return res.status(401).send("Room inexistente");
//     });
// });

// app.post("/status", (req, res) => {
//   const roomId = req.body.roomId;
//   const { player } = req.body;
//   const { online } = req.body;
//   const { start } = req.body;
//   const { name } = req.body;

//   roomsCollection
//     .doc(roomId)
//     .get()
//     .then((doc) => {
//       if (player == 1) {
//         const rtdbRoom = doc.data();
//         const rtdbRoomId = rtdbRoom.rtdbRoom;
//         const roomRef = rtdb.ref("/rooms/" + rtdbRoomId + "/playerOne");
//         roomRef.update({
//           online: Boolean(online),
//           start: Boolean(start),
//           name: name,
//         });
//       }
//       if (player == 2) {
//         const rtdbRoom = doc.data();
//         const rtdbRoomId = rtdbRoom.rtdbRoom;
//         const roomRef = rtdb.ref("/rooms/" + rtdbRoomId + "/playerTwo");
//         roomRef.update({
//           online: Boolean(online),
//           start: Boolean(start),
//           name: name,
//         });
//       }
//     })
//     .then(() => res.json({ message: "ok" }));
// });

// app.post("/play", (req, res) => {
//   const { roomId } = req.body;
//   const { player } = req.body;
//   const { choise } = req.body;
//   const { name } = req.body;

//   roomsCollection
//     .doc(roomId)
//     .get()
//     .then((doc) => {
//       if (player == 1) {
//         const rtdbRoom = doc.data();
//         const rtdbRoomId = rtdbRoom.rtdbRoom;
//         const roomRef = rtdb.ref("/rooms/" + rtdbRoomId + "/playerOne");
//         roomRef.update({
//           choise: choise,
//         });
//       }
//       if (player == 2) {
//         const rtdbRoom = doc.data();
//         const rtdbRoomId = rtdbRoom.rtdbRoom;
//         const roomRef = rtdb.ref("/rooms/" + rtdbRoomId + "/playerTwo");
//         roomRef.update({
//           choise: choise,
//         });
//       }
//     })
//     .then(() => res.json({ message: "ok" }));
// });

// app.post("/history", (req, res) => {
//   const { rtdbRoomId } = req.body;
//   const { player } = req.body;
//   const { victories } = req.body;

//   if (player == 1) {
//     const roomRef = rtdb.ref("/rooms/" + rtdbRoomId + "/playerOne");
//     roomRef
//       .update({
//         history: victories,
//       })
//       .then(() => res.json({ message: "ok" }));
//   }
//   if (player == 2) {
//     const roomRef = rtdb.ref("/rooms/" + rtdbRoomId + "/playerTwo");
//     roomRef
//       .update({
//         history: victories,
//       })
//       .then(() => res.json({ message: "ok" }));
//   }
// });

// app.put("/clean-play", (req, res) => {
//   const { rtdbRoomId } = req.body;
//   const { player } = req.body;

//   if (player == 1) {
//     const roomRef = rtdb.ref("/rooms/" + rtdbRoomId + "/playerOne");
//     roomRef
//       .update({
//         choise: "undefined",
//       })
//       .then(() => res.json({ message: "ok" }));
//   }
//   if (player == 2) {
//     const roomRef = rtdb.ref("/rooms/" + rtdbRoomId + "/playerTwo");
//     roomRef
//       .update({
//         choise: "undefined",
//       })
//       .then(() => res.json({ message: "ok" }));
//   }
// });

app.use((err, req, res, next) => {
  // eslint-disable-line no-unused-vars
  const status = err.status || 500;
  const message = err.message || err;
  console.error(err);
  res.status(status).send(message);
});

app.listen(port, () => {
  console.log("El puerto funciona en el numero:" + port);
});

// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "../dist/index.html"));
// });
