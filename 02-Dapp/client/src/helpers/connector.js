import { InjectedConnector } from "@web3-react/injected-connector";

export const injected = new InjectedConnector({
	supportedChainIds: [1337, 4, 42, 0, 5, 3],
});
