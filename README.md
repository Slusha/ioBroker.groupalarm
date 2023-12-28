![Logo](admin/groupalarm.png)
# ioBroker.groupalarm (Englisch)

[![NPM version](https://img.shields.io/npm/v/iobroker.groupalarm.svg)](https://www.npmjs.com/package/iobroker.groupalarm)
[![Downloads](https://img.shields.io/npm/dm/iobroker.groupalarm.svg)](https://www.npmjs.com/package/iobroker.groupalarm)
![Number of Installations](https://iobroker.live/badges/groupalarm-installed.svg)
![Current version in stable repository](https://iobroker.live/badges/groupalarm-stable.svg)

[![NPM](https://nodei.co/npm/iobroker.groupalarm.png?downloads=true)](https://nodei.co/npm/iobroker.groupalarm/)

**Tests:** ![Test and Release](https://github.com/Slusha/ioBroker.groupalarm/workflows/Test%20and%20Release/badge.svg)

## Overview
The `ioBroker.groupalarm` adapter enables the integration of GroupAlarm into the ioBroker Smart Home system. GroupAlarm is an advanced alerting system designed for organizations like fire departments, rescue services, and other emergency services. This adapter allows you to integrate your GroupAlarm alerts directly into your ioBroker system.

## Features
- **Alert Reception**: Receives alerts from GroupAlarm and makes them available in the ioBroker system.
- **Custom Actions**: Allows the execution of custom actions in ioBroker upon receiving alerts.
- **Easy Configuration**: Quick and straightforward setup via the ioBroker interface.

## Prerequisites
- ioBroker installation (copy Github Link)
- GroupAlarm account and API key

## Installation
1. Install the adapter via the ioBroker administration page.
2. Enter your GroupAlarm API key and other necessary configuration details in the adapter settings.

## Configuration
### API Key
To configure your ioBroker.groupalarm adapter, you need a personal API key from GroupAlarm. This key allows the adapter to communicate with the GroupAlarm API and receive alerts. 
You can generate your personal API key in your GroupAlarm account's profile settings. Follow these steps:
    1. Log in to your GroupAlarm account.
    2. Go to Profile Settings.
    3. Choose the option to create a personal API key.
    4. Copy the generated key and paste it into the configuration settings of the ioBroker.groupalarm adapter.
Note: Keep your API key secure and do not share it publicly.

## Application
After successful configuration, the adapter will receive alerts from GroupAlarm and present them in the ioBroker system. You can then create automations or notifications based on these alerts.

## FAQ
**Q:** How are alerts handled in the adapter?
**A:** The adapter receives a specific number of the latest alerts from GroupAlarm. The most recent alert is always found under the key "latestAlarm".

## Support
For issues or questions, please use the issue tracker on GitHub: [ioBroker.groupalarm Issues](https://github.com/Slusha/ioBroker.groupalarm/issues)

## License
This adapter is published under the [MIT License](LICENSE).

---

[Lesen Sie diese Anleitung auf Deutsch](#iobrokergroupalarm-deutsch)

# ioBroker.groupalarm (Deutsch)

[![NPM version](https://img.shields.io/npm/v/iobroker.groupalarm.svg)](https://www.npmjs.com/package/iobroker.groupalarm)
[![Downloads](https://img.shields.io/npm/dm/iobroker.groupalarm.svg)](https://www.npmjs.com/package/iobroker.groupalarm)
![Number of Installations](https://iobroker.live/badges/groupalarm-installed.svg)
![Current version in stable repository](https://iobroker.live/badges/groupalarm-stable.svg)

[![NPM](https://nodei.co/npm/iobroker.groupalarm.png?downloads=true)](https://nodei.co/npm/iobroker.groupalarm/)

**Tests:** ![Test and Release](https://github.com/Slusha/ioBroker.groupalarm/workflows/Test%20and%20Release/badge.svg)


## Überblick
Der `ioBroker.groupalarm` Adapter ermöglicht die Integration von GroupAlarm in das ioBroker Smart Home System. GroupAlarm ist ein fortschrittliches Alarmierungssystem, das speziell für Organisationen wie Feuerwehren, Rettungsdienste und andere Hilfsorganisationen entwickelt wurde. Mit diesem Adapter können Sie Ihre GroupAlarm Alarmierungen direkt in Ihr ioBroker-System einbinden.

## Funktionen
- **Alarmempfang**: Empfängt Alarme von GroupAlarm und stellt sie im ioBroker-System zur Verfügung.
- **Benutzerdefinierte Aktionen**: Ermöglicht die Ausführung benutzerdefinierter Aktionen in ioBroker bei eingehenden Alarmen.
- **Einfache Konfiguration**: Schnelle und unkomplizierte Einrichtung über die ioBroker-Oberfläche.

## Voraussetzungen
- ioBroker-Installation
- GroupAlarm-Konto und API-Schlüssel

## Installation
1. Installieren Sie den Adapter über die ioBroker-Administrationsseite. (Github Link kopieren)
2. Geben Sie in den Adaptereinstellungen Ihren GroupAlarm API-Schlüssel und weitere erforderliche Konfigurationsdetails ein.

## Konfiguration

### API-Schlüssel
Um Ihren ioBroker.groupalarm Adapter zu konfigurieren, benötigen Sie einen persönlichen API-Schlüssel von GroupAlarm. Der API-Schlüssel ermöglicht es dem Adapter, mit der GroupAlarm-API zu kommunizieren und Alarme zu empfangen. Sie können Ihren persönlichen API-Schlüssel in den Profil-Einstellungen Ihres GroupAlarm-Kontos generieren.

Folgen Sie diesen Schritten, um Ihren API-Schlüssel zu generieren:
1. Melden Sie sich bei Ihrem GroupAlarm-Konto an.
2. Gehen Sie zu den Profil-Einstellungen.
3. Wählen Sie die Option, um einen persönlichen API-Schlüssel zu erstellen.
4. Nach der Erstellung kopieren Sie den Schlüssel und fügen ihn in die Konfigurationseinstellungen des ioBroker.groupalarm Adapters ein.

## Anwendung
Nach der erfolgreichen Konfiguration empfängt der Adapter Alarme von GroupAlarm und stellt sie im ioBroker-System dar. Sie können dann Automatisierungen oder Benachrichtigungen basierend auf diesen Alarmen erstellen.

## FAQ
**Frage:** Wie werden Alarme im Adapter behandelt?
**Antwort:** Der Adapter empfängt eine bestimmte Anzahl der letzten Alarme von GroupAlarm. Der jeweils letzte Alarm ist immer unter dem Schlüssel "latestAlarm" zu finden.

## Support
Bei Problemen oder Fragen nutzen Sie bitte den Issue Tracker auf GitHub: [ioBroker.groupalarm Issues](https://github.com/Slusha/ioBroker.groupalarm/issues)

## Lizenz
Dieser Adapter ist unter der [MIT Lizenz](LICENSE) veröffentlicht.
