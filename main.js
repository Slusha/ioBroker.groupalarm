"use strict";

/*
 * Created with @iobroker/create-adapter v2.5.0
 */

// The adapter-core module gives you access to the core ioBroker functions
// you need to create an adapter
const utils = require("@iobroker/adapter-core");
const axios = require("axios");

// Load your modules here, e.g.:
// const fs = require("fs");

class Groupalarm extends utils.Adapter {
  /**
   * @param {Partial<utils.AdapterOptions>} [options={}]
   */
  constructor(options) {
    super({
      ...options,
      name: "groupalarm",
    });
    this.on("ready", this.onReady.bind(this));
    this.on("stateChange", this.onStateChange.bind(this));
    // this.on("objectChange", this.onObjectChange.bind(this));
    // this.on("message", this.onMessage.bind(this));
    this.on("unload", this.onUnload.bind(this));
  }

  async onReady() {
    this.log.info("Adapter ist total fertig");

    // Konfiguration lesen
    const apiKey = this.config.apiKey; // Ihr API-Schlüssel (Personal-Access-Token)
    this.log.info("API Key: " + apiKey);

    // Hilfsfunktion, um den Typ für common.type zu bestimmen
    const determineType = (value) => {
      const type = typeof value;
      if (type === "bigint") return "number"; // bigint als number behandeln
      if (type === "function" || type === "symbol" || type === "undefined")
        return "mixed";
      return type;
    };

    // Rekursive Funktion, um Objekte und Arrays zu verarbeiten
    const processObject = async (obj, baseId) => {
      for (const key in obj) {
        const value = obj[key];
        const stateId = `${baseId}.${key}`;

        if (value !== null && typeof value === "object") {
          // Erstelle ein Unterobjekt für Objekte und Arrays
          await this.setObjectNotExistsAsync(stateId, {
            type: Array.isArray(value) ? "channel" : "device",
            common: {
              name: key,
            },
            native: {},
          });

          // Rekursiver Aufruf für Unterobjekte
          await processObject(value, stateId);
        } else {
          // Erstelle einen State für einfache Werte
          await this.setObjectNotExistsAsync(stateId, {
            type: "state",
            common: {
              name: key,
              type: determineType(value),
              role: "text",
              read: true,
              write: false,
            },
            native: {},
          });

          // Speichere den Wert im State
          await this.setStateAsync(stateId, { val: value, ack: true });
        }
      }
    };

    // API-Anfrage-Interval
    this.interval = setInterval(async () => {
      try {
        const response = await axios.get(
          "https://app.groupalarm.com/api/v1/alarms/user",
          {
            params: {
              limit: 5,
            },
            headers: {
              "Personal-Access-Token": apiKey,
            },
          }
        );

        if (
          response.data &&
          response.data.alarms &&
          Array.isArray(response.data.alarms)
        ) {
          // Erfolgreiche Antwort vom API
          this.log.info("Alarm data fetched successfully");

          // Prüfe, ob Alarme vorhanden sind
          if (response.data.alarms.length > 0) {
            // Erstelle oder aktualisiere den Ordner für den aktuellsten Alarm
            const latestAlarm = response.data.alarms[0];
            const latestAlarmId = `latestalarm`;

            await this.setObjectNotExistsAsync(latestAlarmId, {
              type: "channel",
              common: {
                name: `Latest Alarm`,
              },
              native: {},
            });

            // Verarbeite den aktuellsten Alarm
            await processObject(latestAlarm, latestAlarmId);
          }

          // Pro Alarm Datenpunkt erstellen oder aktualisieren
          for (const alarm of response.data.alarms) {
            const alarmBaseId = `alarms.${alarm.id}`;

            // Erstelle Haupt-Alarm-Objekt
            await this.setObjectNotExistsAsync(alarmBaseId, {
              type: "channel",
              common: {
                name: `Alarm ${alarm.id}`,
              },
              native: {},
            });

            // Verarbeite jedes Alarmobjekt
            await processObject(alarm, alarmBaseId);
          }
        }
      } catch (error) {
        this.log.error(`Error fetching alarm data: ${error}`);
      }
    }, 60000); // Jede Minute (60000ms)
  }

  /**
   * Is called when adapter shuts down - callback has to be called under any circumstances!
   * @param {() => void} callback
   */
  onUnload(callback) {
    try {
      // Here you must clear all timeouts or intervals that may still be active
      // clearTimeout(timeout1);
      // clearTimeout(timeout2);
      // ...
      // clearInterval(interval1);

      callback();
    } catch (e) {
      callback();
    }
  }

  // If you need to react to object changes, uncomment the following block and the corresponding line in the constructor.
  // You also need to subscribe to the objects with `this.subscribeObjects`, similar to `this.subscribeStates`.
  // /**
  //  * Is called if a subscribed object changes
  //  * @param {string} id
  //  * @param {ioBroker.Object | null | undefined} obj
  //  */
  // onObjectChange(id, obj) {
  // 	if (obj) {
  // 		// The object was changed
  // 		this.log.info(`object ${id} changed: ${JSON.stringify(obj)}`);
  // 	} else {
  // 		// The object was deleted
  // 		this.log.info(`object ${id} deleted`);
  // 	}
  // }

  /**
   * Is called if a subscribed state changes
   * @param {string} id
   * @param {ioBroker.State | null | undefined} state
   */
  onStateChange(id, state) {
    if (state) {
      // The state was changed
      this.log.info(`state ${id} changed: ${state.val} (ack = ${state.ack})`);
    } else {
      // The state was deleted
      this.log.info(`state ${id} deleted`);
    }
  }

  // If you need to accept messages in your adapter, uncomment the following block and the corresponding line in the constructor.
  // /**
  //  * Some message was sent to this instance over message box. Used by email, pushover, text2speech, ...
  //  * Using this method requires "common.messagebox" property to be set to true in io-package.json
  //  * @param {ioBroker.Message} obj
  //  */
  // onMessage(obj) {
  // 	if (typeof obj === "object" && obj.message) {
  // 		if (obj.command === "send") {
  // 			// e.g. send email or pushover or whatever
  // 			this.log.info("send command");

  // 			// Send response in callback if required
  // 			if (obj.callback) this.sendTo(obj.from, obj.command, "Message received", obj.callback);
  // 		}
  // 	}
  // }
}

if (require.main !== module) {
  // Export the constructor in compact mode
  /**
   * @param {Partial<utils.AdapterOptions>} [options={}]
   */
  module.exports = (options) => new Groupalarm(options);
} else {
  // otherwise start the instance directly
  new Groupalarm();
}
