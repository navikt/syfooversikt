# Syfooversikt
Frontend for å vise oversikt over syfooppgaver

## TL;DR
React-app for veileder 


## Changelog

For å legge til en ny changelog/veiviser ved ny funksjonalitet:

1. I mappen `changelogs` legg til en ny mappe med versjons-kode som navn (f.eks: Hvis mappen `1` eksisterer, opprett en ny mappe med navn `2`)
2. Opprett en ny fil i `.json` eller kopier fra forrige versjon med følgende format (navn er vilkårlig, unngå bruk av mellomrom):
```json
{
    "title" : "Ny funksjonalitet",
    "date": "18-08-89",
    "items" : [
        { "title": "Side 1", "text": "En beksrivelse for side 1", "image": "bilde1.png" },
        { "title": "Side 2", "text": "En beskrivelse for side 2", "image": "bilde2.png" },
    ]
}
```

3. Legg til bilder i med `bredde: 500px` og `høyde: 200px` med navnene som matcher `"image"`-feltet ovenfor.

Klienten vil automatisk fange opp den nye endringen og vise en dialog når bruker laster den nye versjonen første gang.

## Kjøre lokalt
* For å kjøre koden lokalt: 
    - `$ npm install`
    - `$ npm run dev`
    - I et annet vindu `$ npm run start-local`
    - Eventuelt kan komandoene kjøres fra `package.json` i intellij.
* Kjør tester med `npm test`
* Kjør prettier og lint med `npm run prettier-lint`, de kan også kjøres hver for seg

## Logge på i Q1-miljø
Se denne siden for [testdata](https://confluence.adeo.no/pages/viewpage.action?pageId=228580060) (NAV-intern lenke).
