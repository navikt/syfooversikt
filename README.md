# Syfooversikt

Frontend for å vise oversikt over syfooppgaver

## Lokalt utviklingsmiljø

Node-versjonen styres av `.nvmrc`, og pnpm-versjonen er angitt i `package.json`.
Med [nvm](https://github.com/nvm-sh/nvm) installert:

```sh
nvm install
nvm use
```

Endre kun `.nvmrc` for å oppdatere Node lokalt, i GitHub Actions og i Docker.
Docker bruker samme hovedversjon som bygget. Etter at appen er bygget, kan
Docker-imaget bygges lokalt med den valgte Node-versjonen:

```sh
docker build --build-arg NODE_VERSION="$(node -p 'process.versions.node.split(".")[0]')" .
```

#### Ved første kjøring:

```sh
$ cp .env.template .env # for å sette opp lokale miljøvariabler
$ npm install --legacy-peer-deps # installerer avhengigheter
```

#### For å kjøre koden lokalt:

- `$ npm install --legacy-peer-deps`
- `$ npm start`
- Kjør tester med `npm test`
- Kjør prettier og lint med `npm run prettier-lint`, de kan også kjøres hver for seg
- Appen finner du [her](http://localhost:8080/minoversikt)

## Logge på i Q1-miljø

Se denne siden for [testdata](https://confluence.adeo.no/pages/viewpage.action?pageId=228580060) (NAV-intern lenke).
