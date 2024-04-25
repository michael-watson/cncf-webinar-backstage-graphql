import React, { useState } from 'react';
import { makeStyles, Theme, Grid, Paper } from '@material-ui/core';

import { CatalogSearchResultListItem } from '@backstage/plugin-catalog';
import {
  catalogApiRef,
  CATALOG_FILTER_EXISTS,
} from '@backstage/plugin-catalog-react';
import { TechDocsSearchResultListItem } from '@backstage/plugin-techdocs';

import { SearchType } from '@backstage/plugin-search';
import {
  SearchBar,
  SearchFilter,
  SearchResult,
  SearchPagination,
  useSearch,
} from '@backstage/plugin-search-react';
import {
  CatalogIcon,
  Content,
  DocsIcon,
  Header,
  Page,
} from '@backstage/core-components';
import { ApiHolder, useApi } from '@backstage/core-plugin-api';
import { ApolloExplorerBrowser, EndpointProps } from './ApolloExplorerBrowser';

const useStyles = makeStyles((theme: Theme) => ({
  bar: {
    padding: theme.spacing(1, 0),
  },
  filters: {
    padding: theme.spacing(2),
    marginTop: theme.spacing(2),
  },
  filter: {
    '& + &': {
      marginTop: theme.spacing(2.5),
    },
  },
}));

export type AuthCallback = (options: {
  apiHolder: ApiHolder;
}) => Promise<{ token: string }>;

type Props = {
  title?: string | undefined;
  subtitle?: string | undefined;
  endpoints: EndpointProps[];
};

export const ApolloExplorerPage = (props: Props) => {
  const { title, subtitle, endpoints } = props;

  return (
    <Page themeId="tool">
      <Header title={title ?? 'Apollo Explorer 👩‍🚀'} subtitle={subtitle ?? ''} />
      <Content noPadding>
        <ApolloExplorerBrowser endpoints={endpoints} />
      </Content>
    </Page>
  );
};

// export const graphqlPage = () => {
// //   const classes = useStyles();
// //   const { types } = useSearch();
// //   const catalogApi = useApi(catalogApiRef);

//   return (
//     <ApolloExplorerPage
//         title="Platform API"
//         endpoints={[
//         {
//             title: 'Production',
//             graphRef: 'Spotify-tb7du2@prod-external',
//             initialState: {
//             document: 'query { genres }',
//             // collectionId: 'c5afdfef-1f51-4d91-884d-41a35afa4725',
//             // operationId: 'effbb7f0-066d-4793-8c01-f4f436bb2f7f',
//             headers: { authorization: 'Bearer test' },
//             handleRequest: async (endpointUrl: string | URL | Request,options: RequestInit | undefined)=>{
//               const token = generateAuthHeader();
//               return fetch(endpointUrl, {
//                 ...options,
//                 headers: {
//                     ...options?.headers,
//                     authorization: `Bearer ${token}`
//                 },
//               }) as any
//             },
//             displayOptions: {},
//             },
//         },
//         { title: 'Swapi', initialEndpoint: 'https://spotify-subgraph-production.up.railway.app/' } as any,
//         { title: 'Staging', graphRef: 'Spotify-tb7du2@prod-external' },
//         { title: 'Dev', graphRef: 'Spotify-tb7du2@prod-external' },
//         ]}
//     />
//   );
// };