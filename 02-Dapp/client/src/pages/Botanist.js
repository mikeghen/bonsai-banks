import React, { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import BonsaiBank from "../artifacts/contracts/BonsaiBank.json";
import { Tabs, Typography, Layout, Divider, Menu, Dropdown } from "antd";
import { Table, Tag, Space } from "antd";
import MintBonsai from "../components/MintBonsai";
import GrowBonsai from "../components/GrowBonsai";
import WiltBonsai from "../components/WiltBonsai";
import DestroyBonsai from "../components/DestroyBonsai";
import { gql, useQuery } from "@apollo/client";
const { Content } = Layout;
const { Text, Title, Paragraph } = Typography;

const GET_DOGS = gql`
	query subscriberEntities($botanist: Bytes) {
		bonsais(where: { botanist: $botanist }) {
			id
			lastWatered
			lastFertilized
			consecutiveWaterings
			consecutiveFertilizings
			fertilizerBalance
			uri
			botanist
			careTaker
		}
	}
`;

const columns = [
	{
		title: "Caretaker",
		dataIndex: "careTaker",
		key: "careTaker",
		render: (text) => <>{text}</>,
	},
	{
		title: "Bonsai ID",
		dataIndex: "id",
		key: "id",
		render: (text) => <>{text}</>,
	},
	{
		title: "Action",
		key: "action",
		render: (text, record) => {
			// console.log(record);
			return (
				<Space size="middle">
					<GrowBonsai bonsaiID={record.id} />
					<WiltBonsai bonsaiID={record.id} />
					<DestroyBonsai bonsaiID={record.id} />
				</Space>
			);
		},
	},
];

const data2 = [
	{
		key: "1",
		caretaker: "0x81431b69B1e0E334d4161A13C2955e0f3599381e",
		bonsaiID: 0,
	},
];

function Botanist(params) {
	const web3React = useWeb3React();
	const { loading, error, data } = useQuery(GET_DOGS, {
		variables: { botanist: web3React.account },
	});
	const [dataPoints, setdata] = useState([]);
	useEffect(() => {
		if (!loading && data) {
			console.log(data);
			setdata(data.bonsais);
		}
	}, [loading]);

	if (loading) {
		return (
			<Content
				style={{ padding: "20px 20px", background: "#fff", minHeight: "83vh" }}
			>
				Loading...
			</Content>
		);
	}

	if (!web3React.active) {
		return (
			<Content
				style={{ padding: "20px 20px", background: "#fff", minHeight: "83vh" }}
			>
				Please connect wallet!
			</Content>
		);
	}

	if (error) {
		console.log(error.message);
		return (
			<Content
				style={{ padding: "20px 20px", background: "#fff", minHeight: "83vh" }}
			>
				Something went wrong!
			</Content>
		);
	}

	return (
		<Content
			style={{ padding: "20px 20px", background: "#fff", minHeight: "83vh" }}
		>
			<Title>Welcome Botanist!</Title>
			<MintBonsai />
			<Table dataSource={dataPoints} columns={columns} />
		</Content>
	);
}

export default Botanist;
