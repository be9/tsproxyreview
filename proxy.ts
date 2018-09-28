import * as tshost from "./DstHost";
import * as tsp from "./TSProxy";

const dstHost: tshost.DstHost = new tshost.DstHost( "browserleaks.com" );
const proxyServer: tsp.TSProxy = new tsp.TSProxy( dstHost, 3010 );
proxyServer.start();
