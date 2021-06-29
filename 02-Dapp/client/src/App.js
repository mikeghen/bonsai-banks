import { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import { useWeb3React } from "@web3-react/core";
import { injected } from "./helpers/connector";
import Web3 from "web3";

import { Layout, Menu, Button } from "antd";
import {
	AreaChartOutlined,
	DatabaseOutlined,
	FieldTimeOutlined,
} from "@ant-design/icons";
import { Typography } from "antd";

const { Link, Title } = Typography;
const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

function App() {
	const web3React = useWeb3React();
	const [collapsed, setCollapsed] = useState(true);
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
		// setCollapsed(collapse);
	}

	function onItemClick(item) {
		// console.log(item);

		switch (item.key) {
		}
	}

	return (
		<Layout>
			<Header
				className="header"
				style={{ position: "fixed", zIndex: 1, width: "100%" }}
			></Header>
			<Content className="site-layout" style={{ marginTop: 64 }}>
				<Layout style={{ minHeight: "92vh" }}>
					<Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
						<div className="logo" />
						<Menu theme="light" defaultSelectedKeys={["1"]} mode="inline">
							<Menu.Item
								key="1"
								icon={<AreaChartOutlined />}
								onClick={onItemClick}
							>
								Dashboard
							</Menu.Item>
							<Menu.Item
								key="2"
								icon={<DatabaseOutlined />}
								onClick={onItemClick}
							>
								Manage
							</Menu.Item>
							<Menu.Item
								key="3"
								icon={<FieldTimeOutlined />}
								onClick={onItemClick}
							>
								Timeline
							</Menu.Item>
						</Menu>
					</Sider>
					<Layout className="site-layout">
						<Content>
							<div
								className="site-layout-background"
								style={{ padding: 24, minHeight: 360 }}
							>
								{web3React.active ? (
									"Hello " + web3React.account
								) : (
									<Button onClick={ConnectWallet}>Connect Wallet</Button>
								)}
							</div>
						</Content>
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
