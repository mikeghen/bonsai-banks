import React from "react";
import { useWeb3React } from "@web3-react/core";

import { Image, Typography, Layout } from "antd";
import { Table, Tag, Space } from "antd";
import FertilizeBonsai from "../components/FertilizeBonsai";
import WaterBonsai from "../components/WaterBonsai";
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
		title: "Consecutive Fertilizings",
		dataIndex: "consecutiveFertilizings",
		key: "consecutiveFertilizings",
		render: (text) => <>{text}</>,
	},
	{
		title: "Last Watered",
		dataIndex: "lastWatered",
		key: "lastWatered",
		render: (text) => <>{text}</>,
	},
	{
		title: "Pic",
		dataIndex: "uri",
		key: "uri",
		render: (text) => <Image width={200} src={text} />,
	},
	{
		title: "Balances",
		dataIndex: "balances",
		key: "balances",
		render: (text) => <>{text}</>,
	},
	{
		title: "Action",
		key: "action",
		render: (text, record) => {
			// console.log(record);
			return (
				<Space size="middle">
					<WaterBonsai />
					<FertilizeBonsai />
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
		lastWatered: "23 June 2021",
		consecutiveFertilizings: 4,
		balances: 100,
		uri: "https://drive.google.com/uc?export=download&id=1C0UV18Q8ORuFjRNcZZR4aoRH1HEpsLjh",
	},
];

function Caretaker(params) {
	const web3React = useWeb3React();
	return (
		<Content
			style={{ padding: "20px 20px", background: "#fff", minHeight: "83vh" }}
		>
			<Title>Welcome Caretaker!</Title>
			<Table dataSource={data} columns={columns} />
		</Content>
	);
}

export default Caretaker;
