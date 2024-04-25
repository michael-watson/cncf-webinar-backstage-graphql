# GraphQL with Backstage (Work-In-Progress)

This repository shows a basic configuration of Backstage with some GraphQL aspects. This is associated with my CNCF on-demand webinar titled "Building your API platform with Backstage and GraphQL". I'll update this repository after the release of the webinar and again once my PR is submitted for the Apollo Explorer plugin.

## Subgraph catalog-info.yaml

You can utilize the Spotify Showcase subgraphs catalog-info.yaml files, they are currently on a separate branch but will soon be brought into master:

- spotify: https://github.com/apollographql/spotify-showcase/blob/backstage-catalog-info/subgraphs/spotify/catalog-info.yaml
- playback: https://github.com/apollographql/spotify-showcase/blob/backstage-catalog-info/subgraphs/playback/catalog-info.yaml

# Setup [Backstage](https://backstage.io)

To start the app, run:

```sh
yarn install
yarn dev
```
