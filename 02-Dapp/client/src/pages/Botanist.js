import React from "react";
import { useWeb3React } from "@web3-react/core";
import BonsaiBank from "../artifacts/contracts/BonsaiBank.json";
import { Tabs, Typography, Layout, Divider, Menu, Dropdown } from "antd";
import { Table, Tag, Space } from "antd";
import MintBonsai from "../components/MintBonsai";
import GrowBonsai from "../components/GrowBonsai";
import WiltBonsai from "../components/WiltBonsai";
import DestroyBonsai from "../components/DestroyBonsai";
const { Content } = Layout;
const { Text, Title, Paragraph } = Typography;

const columns = [
	{
		title: "Caretaker",
		dataIndex: "caretaker",
		key: "caretaker",
		render: (text) => <>{text}</>,
	},
	{
		title: "Bonsai ID",
		dataIndex: "bonsaiID",
		key: "bonsaiID",
		render: (text) => <>{text}</>,
	},
	{
		title: "Action",
		key: "action",
		render: (text, record) => {
			// console.log(record);
			return (
				<Space size="middle">
					<GrowBonsai />
					<WiltBonsai />
					<DestroyBonsai />
				</Space>
			);
		},
	},
];

const data = [
	{
		key: "1",
		caretaker: "0x81431b69B1e0E334d4161A13C2955e0f3599381e",
		bonsaiID: 0,
	},
];

function Botanist(params) {
	const web3React = useWeb3React();
	return (
		<Content
			style={{ padding: "20px 20px", background: "#fff", minHeight: "83vh" }}
		>
			<Title>Welcome Botanist!</Title>
			<MintBonsai />
			<Table dataSource={data} columns={columns} />
		</Content>
	);
}

export default Botanist;
