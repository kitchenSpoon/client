import { createActions } from 'spunky';
import Neon from '@cityofzion/neon-js';

export const ID = 'nameService';

// TODO: Configurable network settings and script hash
const NS_SCRIPT_HASH = '0xe60a3fa8149a853eb4dff4f6ed93c931646a9e22';
const RPC_URL = 'http://localhost:30333';

const client = Neon.create.rpcClient(RPC_URL);

const isNOS = (host) => {
  return host === 'nos.neo';
};

const isLocal = (host) => {
  return /^(localhost|127.0.0.1|0.0.0.0|::1)/.test(host);
};

const parse = (query) => {
  try {
    return new URL(query);
  } catch (err) {
    if (typeof query !== 'string' || query.match(/^[a-z0-9]:\/\//i)) {
      throw err;
    }
    return parse(`nos://${query}`);
  }
};

const lookup = async (query) => {
  const url = parse(query);
  console.log('url:', url);
  const { host, pathname } = url;
  const formattedQuery = `${host}${pathname}`.replace(/\/$/, '');

  if (isNOS(host)) {
    return { query: formattedQuery, target: 'welcome.html' };
  } if (isLocal(host)) {
    return { query: formattedQuery, target: `http://${formattedQuery}` };
  } else {
    const storageKey = Neon.u.str2hexstring(`${host}.target`);
    const response = await client.getStorage(NS_SCRIPT_HASH, storageKey);
    if (!response) {
      throw new Error('Not found.');
    }
    const target = Neon.u.hexstring2str(response);
    return { query: formattedQuery, target: `${target}${pathname}` };
  }
};

export default createActions(ID, (query) => async () => lookup(query));
