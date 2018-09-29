import { TSProxy } from './TSProxy';

const proxyServer = new TSProxy('browserleaks.com', 3010);
proxyServer.start();
