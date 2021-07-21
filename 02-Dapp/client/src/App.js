import { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import { useWeb3React } from "@web3-react/core";
import { injected } from "./helpers/connector";
import Botanist from "./pages/Botanist";
import Caretaker from "./pages/Caretaker";
import Web3 from "web3";

import { Layout, Menu, Button } from "antd";
import { HeartTwoTone, CheckCircleTwoTone } from "@ant-design/icons";
import { Typography } from "antd";

const { Link, Title } = Typography;
const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

function App() {
	const web3React = useWeb3React();
	const [collapsed, setCollapsed] = useState(true);
	const [currentUI, setCurrentUI] = useState(<Caretaker />);
	const onError = (err) => {
		console.error(err);
		// debugger;
	};

	const activateWeb3 = () => {
		web3React.activate(injected, onError, true).catch((err) => {
			console.error(err);
			// debugger;
		});
	};

	async function ConnectWallet() {
		activateWeb3();
	}

	function onCollapse(collapse) {
		setCollapsed(collapse);
	}

	function onItemClick(item) {
		// console.log(item);

		switch (item.key) {
			case "2":
				setCurrentUI(<Botanist />);
				break;
			case "1":
				setCurrentUI(<Caretaker />);
				break;
		}
	}

	return (
		<Layout>
			<Header
				className="header"
				style={{ position: "fixed", zIndex: 1, width: "100%" }}
			>
				<div>
					{web3React.active ? (
						"Hello " + web3React.account
					) : (
						<Button onClick={ConnectWallet}>Connect Wallet</Button>
					)}
				</div>
			</Header>
			<Content className="site-layout" style={{ marginTop: 64 }}>
				<Layout style={{ minHeight: "92vh" }}>
					<Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
						<Menu theme="light" defaultSelectedKeys={["1"]} mode="inline">
							<Menu.Item
								key="1"
								icon={<HeartTwoTone twoToneColor="#eb2f96" />}
								onClick={onItemClick}
							>
								Caretaker
							</Menu.Item>
							<Menu.Item
								key="2"
								icon={<CheckCircleTwoTone twoToneColor="#52c41a" />}
								onClick={onItemClick}
							>
								Botanist
							</Menu.Item>
						</Menu>
					</Sider>
					<Layout className="site-layout">
						<Content>{currentUI}</Content>
						<Footer style={{ textAlign: "center" }}>
							Bonsai Bank ©2021 Created by{" "}
							<Link href="https://twitter.com/mikeghen" target="_blank">
								Mike Ghen
							</Link>
						</Footer>
					</Layout>
				</Layout>
			</Content>
		</Layout>
	);
}

export default App;
