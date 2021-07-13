import React, { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { gql, useQuery } from "@apollo/client";
import { Image, Typography, Layout } from "antd";
import { Table, Tag, Space } from "antd";
import FertilizeBonsai from "../components/FertilizeBonsai";
import WaterBonsai from "../components/WaterBonsai";
const { Content } = Layout;
const { Text, Title, Paragraph } = Typography;

const GET_DOGS = gql`
	query subscriberEntities($careTaker: Bytes) {
		bonsais(where: { careTaker: $careTaker }) {
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
		title: "Water Balances",
		dataIndex: "waterBalance",
		key: "waterBalance",
		render: (text, record) => <>{text}</>,
	},
	{
		title: "Action",
		key: "action",
		render: (text, record) => {
			// console.log(record);
			return (
				<Space size="middle">
					<WaterBonsai bonsaiID={record.id} />
					<FertilizeBonsai bonsaiID={record.id} />
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
	const { loading, error, data } = useQuery(GET_DOGS, {
		variables: { careTaker: web3React.account },
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
			<Title>Welcome Caretaker!</Title>
			<Table dataSource={dataPoints} columns={columns} />
		</Content>
	);
}

export default Caretaker;
