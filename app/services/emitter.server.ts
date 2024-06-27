// @ts-nocheck
import { EventEmitter } from "events";
import "dotenv/config";

let emitter;

if (process.env.NODE_ENV === "production") {
  emitter = new EventEmitter();
  emitter.setMaxListeners(100);
} else {
  if (!global.__emitter) {
    global.__emitter = new EventEmitter();
    global.__emitter.setMaxListeners(100);
  }
  emitter = global.__emitter;
}

emitter.on("nodes", async (message: string) => {
  console.log(`RECEIVED ${message} EVENT!`);
  emitter.emit(message);
});

export { emitter };
