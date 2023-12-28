"use strict";

/*
 * Created with @iobroker/create-adapter v2.5.0
 */

// The adapter-core module gives you access to the core ioBroker functions
// you need to create an adapter
const utils = require("@iobroker/adapter-core");
const axios = require("axios");

// Standardwert
const DEFAULT_MAX_POLLING = 30; // Standardwert in Sekunden
const DEFAULT_MAX_ALARMS = 1; // Standardwert Anzahl letzte Alarme
const DEFAULT_API_KEY = 0; // Standardwert ApiKey

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

        // Initialisieren Sie hier Ihre Adapter-Instanzvariablen
        this.apiKey = 0;
        this.maxAlarms = 0;
        this.maxPolling = 0;

        this.on("ready", this.onReady.bind(this));
        this.on("stateChange", this.onStateChange.bind(this));
        // this.on("objectChange", this.onObjectChange.bind(this));
        // this.on("message", this.onMessage.bind(this));
        this.on("unload", this.onUnload.bind(this));

        this.fetchAndProcessAlarms = this.fetchAndProcessAlarms.bind(this);
    }

    // API-Anfrage-Funktion
    async fetchAndProcessAlarms() {
        this.log.info("Fetching Alarms");

        try {
            const response = await axios.get(
                "https://app.groupalarm.com/api/v1/alarms/user",
                {
                    params: {
                        limit: this.maxAlarms,
                    },
                    headers: {
                        "Personal-Access-Token": this.apiKey,
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
                    await this.processObject(latestAlarm, latestAlarmId);
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
                    await this.processObject(alarm, alarmBaseId);
                }
            }
        } catch (error) {
            this.log.error(`Error fetching alarm data: ${error}`);
        }
    }

    // Rekursive Funktion, um Objekte und Arrays zu verarbeiten
    async processObject(obj, baseId) {
        // Hilfsfunktion, um den Typ für common.type zu bestimmen
        const determineType = (value) => {
            const type = typeof value;
            if (type === "bigint") return "number"; // bigint als number behandeln
            if (
                type === "function" ||
                type === "symbol" ||
                type === "undefined"
            )
                return "mixed";
            return type;
        };

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
                await this.processObject(value, stateId);
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
                await this.setStateAsync(stateId, {
                    val: value,
                    ack: true,
                });
            }
        }
    }

    async onReady() {
        this.log.info("Adapter gestartet");

        // Konfiguration lesen
        this.apiKey = this.config.apiKey || DEFAULT_API_KEY; // Ihr API-Schlüssel (Personal-Access-Token)
        this.maxAlarms = this.config.maxAlarms || DEFAULT_MAX_ALARMS; // Anzahl die zu holenden letzen Alarme
        this.maxPolling = this.config.maxPolling || DEFAULT_MAX_POLLING; // Pollingzeit für die Api in Sekunden
        this.log.info("Alarme: " + this.maxAlarms);
        this.log.info("Zeit: " + this.maxPolling);
        this.log.info("Api: " + this.apiKey);

        // Direkter Aufruf beim Start
        this.fetchAndProcessAlarms();

        // API-Anfrage-Interval
        this.interval = setInterval(
            () => this.fetchAndProcessAlarms(),
            this.maxPolling * 1000
        );
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

    /**
     * Is called if a subscribed state changes
     * @param {string} id
     * @param {ioBroker.State | null | undefined} state
     */
    onStateChange(id, state) {
        if (state) {
            // The state was changed
            this.log.info(
                `state ${id} changed: ${state.val} (ack = ${state.ack})`
            );
        } else {
            // The state was deleted
            this.log.info(`state ${id} deleted`);
        }
    }
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
