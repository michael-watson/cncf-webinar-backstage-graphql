import React, { Suspense, useRef, useState } from 'react';
import Divider from '@material-ui/core/Divider';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import { makeStyles } from '@material-ui/core/styles';
import { ApolloExplorer } from '@apollo/explorer/react';
import { Content } from '@backstage/core-components';
import { HandleRequest } from '@apollo/explorer/src/helpers/postMessageRelayHelpers';
import { useApiHolder } from '@backstage/core-plugin-api';
import { ApiHolder } from '@backstage/core-plugin-api';
import { getIntrospectionQuery } from 'graphql';
import { JSONObject } from '@apollo/explorer/src/helpers/types';
export type EndpointProps = {
  title: string;
  endpointUrl?: string;
  graphRef?: string;
  schema?: string;
  authCallback?: AuthCallback;
  persistExplorerState?: boolean;
  initialState?: {
    document?: string;
    variables?: JSONObject;
    headers?: Record<string, string>;
    displayOptions: {
      docsPanelState?: 'open' | 'closed';
      showHeadersAndEnvVars?: boolean;
      theme?: 'dark' | 'light';
    };
  };
};
export type AuthCallback = (options: {
  apiHolder: ApiHolder;
}) => Promise<{ token: string }>;

const useStyles = makeStyles(theme => ({
  tabs: {
    background: theme.palette.background.paper,
  },
  root: {
    height: '100%',
  },
  content: {
    height: '100%',
  },
  explorer: {
    height: '95%',
  },
}));

type Props = {
  endpoints: EndpointProps[];
  authCallback?: () => Promise<{ token: string }>;
};

export const handleAuthRequest = ({
  authCallback,
}: {
  authCallback: Props['authCallback'];
}): HandleRequest => {
  const handleRequest: HandleRequest = async (endpointUrl, options) =>
    fetch(endpointUrl, {
      ...options,
      headers: {
        ...options.headers,
        ...(authCallback && {
          Authorization: `Bearer ${(await authCallback()).token}`,
        }),
      },
    });
  return handleRequest;
};

function getSchema(url: string) {
  console.log('************************');
  return fetch(`${url}`, {
    body: JSON.stringify({
      query: `
      query IntrospectionQuery {
        __schema {
          queryType { name }
          mutationType { name }
          subscriptionType { name }
          types {
            ...FullType
          }
          directives {
            name
            description
            locations
            args(includeDeprecated: true) {
              ...InputValue
            }
          }
        }
      }
  
      fragment FullType on __Type {
        kind
        name
        description
        fields(includeDeprecated: true) {
          name
          description
          args(includeDeprecated: true) {
            ...InputValue
          }
          type {
            ...TypeRef
          }
          isDeprecated
          deprecationReason
        }
        inputFields(includeDeprecated: true) {
          ...InputValue
        }
        interfaces {
          ...TypeRef
        }
        enumValues(includeDeprecated: true) {
          name
          description
          isDeprecated
          deprecationReason
        }
        possibleTypes {
          ...TypeRef
        }
      }
  
      fragment InputValue on __InputValue {
        name
        description
        type { ...TypeRef }
        defaultValue
        isDeprecated
        deprecationReason
      }
  
      fragment TypeRef on __Type {
        kind
        name
        ofType {
          kind
          name
          ofType {
            kind
            name
            ofType {
              kind
              name
              ofType {
                kind
                name
                ofType {
                  kind
                  name
                  ofType {
                    kind
                    name
                    ofType {
                      kind
                      name
                    }
                  }
                }
              }
            }
          }
        }
      }
    `,
    }),
    method: 'POST',
    headers: { 'content-type': 'application/json' },
  });
}

export const ApolloExplorerBrowser = ({ endpoints }: Props) => {
  const classes = useStyles();
  const [tabIndex, setTabIndex] = useState(0);
  const endpoint = endpoints[tabIndex];
  const [schema, setSchema] = useState('');
  const endpointUrl = useRef('');

  const apiHolder = useApiHolder();

  const getAuthCallback = (index: number) => {
    const authCallback = endpoints[index].authCallback;
    if (authCallback === undefined) return undefined;
    return () => authCallback({ apiHolder });
  };

  let explorer: JSX.Element | undefined;

  const content = (explorer: JSX.Element) => (
    <div className={classes.root}>
      <Tabs
        classes={{ root: classes.tabs }}
        value={tabIndex}
        onChange={(_, value) => setTabIndex(value)}
        indicatorColor="primary"
      >
        {endpoints.map(({ title }, index) => (
          <Tab key={index} label={title} value={index} />
        ))}
      </Tabs>
      <Divider />
      <Content className={classes.content}>{explorer}</Content>
    </div>
  );

  if (
    // !schema &&
    endpoint.endpointUrl &&
    endpoint.endpointUrl != endpointUrl.current
  ) {
    endpointUrl.current = endpoint.endpointUrl ?? '';

    getSchema(endpointUrl.current).then(async r => {
      const json = await r.json();
      setSchema(json.data);
    });

    return content(<h2>Loading</h2>);
  }

  if (endpoint.endpointUrl) {
    explorer = (
      <ApolloExplorer
        endpointUrl={endpoint.endpointUrl}
        schema={schema}
        className={classes.explorer}
        persistExplorerState={endpoint.persistExplorerState}
        initialState={endpoint.initialState}
        handleRequest={handleAuthRequest({
          authCallback: getAuthCallback(tabIndex),
        })}
      />
    );
  } else if (endpoint.graphRef) {
    explorer = (
      <ApolloExplorer
        className={classes.explorer}
        graphRef={endpoint.graphRef}
        persistExplorerState={endpoint.persistExplorerState}
        initialState={endpoint.initialState}
        handleRequest={handleAuthRequest({
          authCallback: getAuthCallback(tabIndex),
        })}
      />
    );
  } else throw new Error('You must set either an endpoint or graphRef');

  return content(explorer);
};
