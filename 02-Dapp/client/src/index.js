import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Web3ReactProvider } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import {
	ApolloClient,
	InMemoryCache,
	ApolloProvider,
	useQuery,
	gql,
} from "@apollo/client";

const client = new ApolloClient({
	uri: process.env.REACT_APP_GRAPHQL,
	cache: new InMemoryCache(),
});

function getLibrary(provider, connector) {
	// return new ethers.providers.Web3Provider(window.ethereum);
	const test = new Web3Provider(provider);

	return test; // this will vary according to whether you use e.g. ethers or web3.js
}

ReactDOM.render(
	<Web3ReactProvider getLibrary={getLibrary}>
		<ApolloProvider client={client}>
			{/* <React.StrictMode> */}
			<App />
			{/* </React.StrictMode> */}
		</ApolloProvider>
	</Web3ReactProvider>,
	document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
