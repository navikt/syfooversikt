# Syfooversikt

Frontend for å vise oversikt over syfooppgaver

## Lokalt utviklingsmiljø

#### Ved første kjøring:

```sh
$ cp .env.template .env # for å sette opp lokale miljøvariabler
$ npm install --legacy-peer-deps # installerer avhengigheter
```

#### For å kjøre koden lokalt:

Du må ha Node v22 og npm v10 installert.

- `$ npm install --legacy-peer-deps`
- `$ npm start`
- Kjør tester med `npm test`
- Kjør prettier og lint med `npm run prettier-lint`, de kan også kjøres hver for seg
- Appen finner du [her](http://localhost:8080/minoversikt)

## Logge på i Q1-miljø

Se denne siden for [testdata](https://confluence.adeo.no/pages/viewpage.action?pageId=228580060) (NAV-intern lenke).

## Valkey Cache

Bruker teamsykefravr sin felles Valkey-cache på Aiven for å cache bruker-sessions.
